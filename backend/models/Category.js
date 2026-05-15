const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subs: [{
    name: String,
    img: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
