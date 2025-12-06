// backend/routes/traceEvents.js
const express = require('express');
const router = express.Router();
const TraceEvent = require('../models/TraceEvent');
const { createTraceEvent, verifyHashChain } = require('../utils/hashChain');
const {
    computeDataHash,
    anchorEventOnChain,
    getOnChainEvents,
    isMilestoneEvent
} = require('../blockchain');

/**
 * POST /api/trace-events
 * Create a new trace event with hash-chain linking and optional on-chain anchoring
 */
router.post('/', async (req, res) => {
    try {
        const { batchId, actorId, actorRole, eventType, eventData } = req.body;

        // Validate required fields
        if (!batchId || !actorId || !actorRole || !eventType || !eventData) {
            return res.status(400).json({
                status: 'error',
                error: 'Missing required fields: batchId, actorId, actorRole, eventType, eventData'
            });
        }

        // Create off-chain event with hash-chain
        const traceEvent = await createTraceEvent({
            batchId,
            actorId,
            actorRole,
            eventType,
            eventData
        });

        console.log(`Created trace event: ${traceEvent._id} for batch ${batchId}`);

        // Check if this is a milestone event that should be anchored on-chain
        if (isMilestoneEvent(eventType)) {
            console.log(`Milestone event detected: ${eventType}. Initiating on-chain anchoring...`);

            // Compute compact data hash for on-chain storage
            const dataHash = computeDataHash(eventData, traceEvent.currentHash);

            // Anchor on blockchain (async - don't wait for confirmation)
            anchorEventOnChain(batchId, eventType, dataHash)
                .then(result => {
                    if (result.success) {
                        // Update event with transaction hash
                        TraceEvent.findByIdAndUpdate(traceEvent._id, {
                            onChainStatus: result.status,
                            txHash: result.txHash
                        }).catch(err => console.error('Error updating txHash:', err));
                    } else {
                        // Mark as failed
                        TraceEvent.findByIdAndUpdate(traceEvent._id, {
                            onChainStatus: result.status
                        }).catch(err => console.error('Error updating status:', err));
                    }
                })
                .catch(err => {
                    console.error('On-chain anchoring error:', err);
                    TraceEvent.findByIdAndUpdate(traceEvent._id, {
                        onChainStatus: 'FAILED'
                    }).catch(e => console.error('Error updating status:', e));
                });

            // Set status to PENDING initially
            traceEvent.onChainStatus = 'PENDING';
            await traceEvent.save();
        }

        res.status(201).json({
            status: 'success',
            data: traceEvent
        });

    } catch (error) {
        console.error('Error creating trace event:', error);
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

/**
 * GET /api/trace-events/:batchId
 * Get all trace events for a batch (off-chain history)
 */
router.get('/:batchId', async (req, res) => {
    try {
        const { batchId } = req.params;

        // Fetch all events for this batch, sorted by timestamp
        const events = await TraceEvent
            .find({ batchId })
            .sort({ timestamp: 1 })
            .lean();

        // Verify hash-chain integrity
        const verification = await verifyHashChain(batchId);

        res.json({
            status: 'success',
            batchId,
            eventCount: events.length,
            hashChainValid: verification.valid,
            verification,
            events
        });

    } catch (error) {
        console.error('Error fetching trace events:', error);
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

/**
 * GET /api/trace-events/:batchId/onchain
 * Get on-chain events for a batch from the blockchain
 */
router.get('/:batchId/onchain', async (req, res) => {
    try {
        const { batchId } = req.params;

        // Query blockchain for on-chain events
        const onChainEvents = await getOnChainEvents(batchId);

        res.json({
            status: 'success',
            batchId,
            onChainEventCount: onChainEvents.length,
            events: onChainEvents
        });

    } catch (error) {
        console.error('Error fetching on-chain events:', error);
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

/**
 * GET /api/trace-events/:batchId/verify
 * Verify hash-chain integrity for a batch
 */
router.get('/:batchId/verify', async (req, res) => {
    try {
        const { batchId } = req.params;

        const verification = await verifyHashChain(batchId);

        res.json({
            status: 'success',
            batchId,
            ...verification
        });

    } catch (error) {
        console.error('Error verifying hash chain:', error);
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

module.exports = router;
