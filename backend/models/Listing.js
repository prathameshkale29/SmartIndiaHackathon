const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true, default: 'kg' }, // kg, quintal, ton
    pricePerUnit: { type: Number, required: true },
    location: {
        address: String,
        city: String,
        state: String,
        zip: String,
        coordinates: { // GeoJSON
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], required: false } // [longitude, latitude]
        }
    },
    status: {
        type: String,
        enum: ['active', 'sold', 'expired', 'draft'],
        default: 'active'
    },
    qualityCertificates: [String], // URLs to images/docs
    description: String,
    createdAt: { type: Date, default: Date.now }
});

// Index for geospatial search if needed later
ListingSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model('Listing', ListingSchema);
