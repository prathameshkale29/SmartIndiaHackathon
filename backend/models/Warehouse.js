const mongoose = require('mongoose');

const WarehouseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    currentStock: {
        type: Number,
        default: 0
    },
    commodities: [{
        type: String
    }],
    manager: {
        type: String
    },
    contact: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Warehouse', WarehouseSchema);
