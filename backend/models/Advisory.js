const mongoose = require('mongoose');

const AdvisorySchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    type: {
        type: String,
        enum: ['weather', 'pest', 'market', 'general'],
        required: true
    },
    targetCrops: [{ type: String }], // e.g., ["Soybean", "Mustard"]
    targetStates: [{ type: String }], // e.g., ["Maharashtra", "Gujarat"]
    issuedBy: { type: String, default: 'System' },
    validUntil: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Advisory', AdvisorySchema);
