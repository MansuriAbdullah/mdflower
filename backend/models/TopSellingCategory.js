const mongoose = require('mongoose');

const TopSellingCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String },
  subs: [{
    name: { type: String, required: true },
    products: [{
      name: { type: String, required: true },
      price: { type: String, required: true },
      image: { type: String, required: true }
    }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('TopSellingCategory', TopSellingCategorySchema);
