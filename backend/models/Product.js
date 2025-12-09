const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: {
        type: String,
        required: true,
        enum: ['Oilseeds', 'Pulses', 'Grains', 'Vegetables', 'Fruits', 'Other']
    },
    description: { type: String },
    gradingStandards: { type: String }, // e.g., "A, B, C" or specific text
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
