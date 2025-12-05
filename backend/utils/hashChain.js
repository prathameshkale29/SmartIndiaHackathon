// backend/utils/hashChain.js
const crypto = require('crypto');
const TraceEvent = require('../models/TraceEvent');

/**
 * Computes SHA256 hash for a trace event
 * @param {string} batchId - Batch identifier
 * @param {string} eventType - Type of event
 * @param {object} eventData - Event data object
 * @param {Date} timestamp - Event timestamp
 * @param {string} prevHash - Previous event hash
 * @returns {string} SHA256 hash
 */
function computeHash(batchId, eventType, eventData, timestamp, prevHash) {
    const dataString = batchId +
        eventType +
        JSON.stringify(eventData) +
        timestamp.toISOString() +
        prevHash;

    return crypto.createHash('sha256').update(dataString).digest('hex');
}

/**
 * Gets the hash of the last event for a batch
 * @param {string} batchId - Batch identifier
 * @returns {Promise<string>} Last event hash or "GENESIS"
 */
async function getLastEventHash(batchId) {
    try {
        const lastEvent = await TraceEvent
            .findOne({ batchId })
            .sort({ timestamp: -1 })
            .select('currentHash')
            .lean();

        return lastEvent ? lastEvent.currentHash : 'GENESIS';
    } catch (error) {
        console.error('Error getting last event hash:', error);
        return 'GENESIS';
    }
}

/**
 * Creates a new trace event with proper hash-chain linking
 * @param {object} eventDetails - Event details
 * @returns {Promise<object>} Created trace event
 */
async function createTraceEvent(eventDetails) {
    const { batchId, actorId, actorRole, eventType, eventData } = eventDetails;

    // Get previous hash
    const prevHash = await getLastEventHash(batchId);

    // Create timestamp
    const timestamp = new Date();

    // Compute current hash
    const currentHash = computeHash(batchId, eventType, eventData, timestamp, prevHash);

    // Create and save event
    const traceEvent = new TraceEvent({
        batchId,
        actorId,
        actorRole,
        eventType,
        eventData,
        timestamp,
        prevHash,
        currentHash,
        onChainStatus: 'NONE'
    });

    await traceEvent.save();

    return traceEvent;
}

/**
 * Verifies hash-chain integrity for a batch
 * @param {string} batchId - Batch identifier
 * @returns {Promise<object>} Verification result
 */
async function verifyHashChain(batchId) {
    try {
        const events = await TraceEvent
            .find({ batchId })
            .sort({ timestamp: 1 })
            .lean();

        if (events.length === 0) {
            return { valid: true, message: 'No events found' };
        }

        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const expectedPrevHash = i === 0 ? 'GENESIS' : events[i - 1].currentHash;

            if (event.prevHash !== expectedPrevHash) {
                return {
                    valid: false,
                    message: `Hash chain broken at event ${i}`,
                    eventId: event._id
                };
            }

            // Recompute hash
            const recomputedHash = computeHash(
                event.batchId,
                event.eventType,
                event.eventData,
                event.timestamp,
                event.prevHash
            );

            if (recomputedHash !== event.currentHash) {
                return {
                    valid: false,
                    message: `Hash mismatch at event ${i}`,
                    eventId: event._id
                };
            }
        }

        return { valid: true, message: 'Hash chain verified', eventCount: events.length };
    } catch (error) {
        return { valid: false, message: error.message };
    }
}

module.exports = {
    computeHash,
    getLastEventHash,
    createTraceEvent,
    verifyHashChain
};
