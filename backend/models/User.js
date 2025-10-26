const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  preferredDistrict: {
    type: String,
    ref: 'District'
  },
  location: {
    latitude: Number,
    longitude: Number,
    accuracy: Number
  },
  language: {
    type: String,
    enum: ['hi', 'en'],
    default: 'hi'
  },
  lastVisit: {
    type: Date,
    default: Date.now
  },
  visitCount: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// TTL index to auto-delete old sessions after 30 days
userSchema.index({ lastVisit: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('User', userSchema);

