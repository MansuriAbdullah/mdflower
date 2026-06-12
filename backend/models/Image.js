const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Image', ImageSchema);
