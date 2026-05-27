const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// Create indexes for performance
visitSchema.index({ date: 1, ip: 1 });
visitSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Visit', visitSchema);
