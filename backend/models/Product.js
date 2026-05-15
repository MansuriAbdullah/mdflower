const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  sub: { type: String },
  variety: { type: String },
  price: { type: String, required: true },
  image: { type: String },
  color: { type: String },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
