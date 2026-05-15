require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

async function fixUrls() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Update Products
    const products = await Product.find({});
    let productUpdates = 0;
    for (const p of products) {
      if (p.image && p.image.includes('http://localhost:5000')) {
        p.image = p.image.replace('http://localhost:5000', 'https://mdflower-qvjl.vercel.app');
        await p.save();
        productUpdates++;
      }
    }
    console.log(`Updated ${productUpdates} products.`);

    // Update Categories
    const categories = await Category.find({});
    let categoryUpdates = 0;
    for (const c of categories) {
      if (c.image && c.image.includes('http://localhost:5000')) {
        c.image = c.image.replace('http://localhost:5000', 'https://mdflower-qvjl.vercel.app');
        await c.save();
        categoryUpdates++;
      }
    }
    console.log(`Updated ${categoryUpdates} categories.`);

    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixUrls();
