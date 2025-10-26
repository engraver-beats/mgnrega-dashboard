const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  districtCode: {
    type: String,
    required: true,
    ref: 'District'
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  // Key MGNREGA Metrics
  totalJobCards: {
    type: Number,
    default: 0
  },
  activeJobCards: {
    type: Number,
    default: 0
  },
  totalHouseholds: {
    type: Number,
    default: 0
  },
  householdsWorked: {
    type: Number,
    default: 0
  },
  totalPersonDays: {
    type: Number,
    default: 0
  },
  womenPersonDays: {
    type: Number,
    default: 0
  },
  averageWageRate: {
    type: Number,
    default: 0
  },
  totalWagesPaid: {
    type: Number,
    default: 0
  },
  worksCompleted: {
    type: Number,
    default: 0
  },
  worksOngoing: {
    type: Number,
    default: 0
  },
  // Performance Indicators
  employmentProvided: {
    type: Number,
    default: 0
  },
  averageDaysPerHousehold: {
    type: Number,
    default: 0
  },
  womenParticipation: {
    type: Number,
    default: 0
  },
  // API metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  dataSource: {
    type: String,
    default: 'data.gov.in'
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
performanceSchema.index({ districtCode: 1, year: -1, month: -1 });
performanceSchema.index({ year: -1, month: -1 });

module.exports = mongoose.model('Performance', performanceSchema);

