// backend/models/TraceEvent.js
const mongoose = require('mongoose');

const traceEventSchema = new mongoose.Schema({
    batchId: {
        type: String,
        required: true,
        index: true
    },
    actorId: {
        type: String,
        required: true
    },
    actorRole: {
        type: String,
        required: true,
        enum: ['FARMER', 'FPO', 'PROCESSOR', 'DISTRIBUTOR', 'RETAILER', 'WAREHOUSE']
    },
    eventType: {
        type: String,
        required: true,
        enum: [
            'PLANTED',
            'HARVESTED',
            'PROCURED_BY_PROCESSOR',
            'PROCESSED',
            'PACKED',
            'SHIPPED',
            'DELIVERED',
            'QUALITY_CHECK',
            'STORED'
        ]
    },
    eventData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    prevHash: {
        type: String,
        required: true
    },
    currentHash: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    onChainStatus: {
        type: String,
        enum: ['NONE', 'PENDING', 'SUCCESS', 'FAILED'],
        default: 'NONE'
    },
    txHash: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Index for efficient batch queries
traceEventSchema.index({ batchId: 1, timestamp: 1 });

module.exports = mongoose.model('TraceEvent', traceEventSchema);
