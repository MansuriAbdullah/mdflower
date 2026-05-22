const mongoose = require('mongoose');

const SignatureMasterpieceSchema = new mongoose.Schema({
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, { timestamps: true });

module.exports = mongoose.model('SignatureMasterpiece', SignatureMasterpieceSchema);
