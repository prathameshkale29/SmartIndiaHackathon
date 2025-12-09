// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['farmer', 'buyer', 'admin'],
    default: 'farmer'
  },
  profile: {
    phone: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: { type: String, default: 'India' }
    }
  },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals for relationships
UserSchema.virtual('listings', {
  ref: 'Listing',
  localField: '_id',
  foreignField: 'seller'
});

UserSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'buyer'
});

module.exports = mongoose.model('User', UserSchema);
