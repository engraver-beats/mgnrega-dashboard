const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  districtCode: {
    type: String,
    required: true,
    unique: true
  },
  districtName: {
    type: String,
    required: true
  },
  stateCode: {
    type: String,
    required: true
  },
  stateName: {
    type: String,
    required: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  population: Number,
  ruralPopulation: Number,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
districtSchema.index({ stateCode: 1, districtCode: 1 });
districtSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('District', districtSchema);

