// backend/models/LoginHistory.js
const mongoose = require('mongoose');

const LoginHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',      // reference to User collection
    required: false   // may be null if user not found
  },
  email: {
    type: String,
    required: true
  },
  success: {
    type: Boolean,
    required: true
  },
  ip: {
    type: String
  },
  userAgent: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LoginHistory', LoginHistorySchema);
