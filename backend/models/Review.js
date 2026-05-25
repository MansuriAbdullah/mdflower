const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String },
  text: { type: String, required: true },
  stars: { type: Number, required: true, default: 5 },
  img: { type: String },
  displayed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
