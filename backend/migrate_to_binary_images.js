require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const TopSellingCategory = require('./models/TopSellingCategory');
const Image = require('./models/Image');

async function convertBase64ToBinary(base64Str) {
  if (!base64Str || !base64Str.startsWith('data:image')) {
    return null; // Not a base64 string
  }

  try {
    const commaIndex = base64Str.indexOf(',');
    if (commaIndex === -1) return null;

    const mimePart = base64Str.substring(0, commaIndex);
    const mimeMatch = mimePart.match(/data:(image\/[a-zA-Z0-9\+\-\.]+);base64/);
    const contentType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    const base64Data = base64Str.substring(commaIndex + 1);
    const buffer = Buffer.from(base64Data, 'base64');

    // Create Image model document
    const imgDoc = new Image({
      data: buffer,
      contentType: contentType
    });
    await imgDoc.save();

    return `/api/images/${imgDoc._id}`;
  } catch (err) {
    console.error('Failed to convert base64 to binary:', err.message);
    return null;
  }
}

async function migrate() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // 1. Migrate Product Images
    const products = await Product.find({});
    console.log(`\nFound ${products.length} products. Checking for base64 images...`);
    let productUpdates = 0;
    for (const p of products) {
      if (p.image && p.image.startsWith('data:image')) {
        const originalLengthKb = (p.image.length / 1024).toFixed(1);
        console.log(`Migrating product "${p.name}" image (${originalLengthKb} KB base64)...`);
        const newUrl = await convertBase64ToBinary(p.image);
        if (newUrl) {
          p.image = newUrl;
          await p.save();
          productUpdates++;
          console.log(`  -> Migrated! Image path is now: ${newUrl}`);
        }
      }
    }
    console.log(`Successfully migrated ${productUpdates} products.`);

    // 2. Migrate Category Sub-images
    const categories = await Category.find({});
    console.log(`\nFound ${categories.length} categories. Checking sub-categories...`);
    let categoryUpdates = 0;
    for (const c of categories) {
      let categoryModified = false;
      if (c.subs && c.subs.length > 0) {
        for (const sub of c.subs) {
          if (sub.img && sub.img.startsWith('data:image')) {
            const originalLengthKb = (sub.img.length / 1024).toFixed(1);
            console.log(`Migrating category "${c.name}" -> sub "${sub.name}" image (${originalLengthKb} KB base64)...`);
            const newUrl = await convertBase64ToBinary(sub.img);
            if (newUrl) {
              sub.img = newUrl;
              categoryModified = true;
              console.log(`  -> Migrated! Image path is now: ${newUrl}`);
            }
          }
        }
      }
      if (categoryModified) {
        c.markModified('subs');
        await c.save();
        categoryUpdates++;
        console.log(`Successfully updated category "${c.name}"`);
      }
    }
    console.log(`Successfully migrated ${categoryUpdates} categories.`);

    // 3. Migrate Top Selling Category Images and Products
    const topSelling = await TopSellingCategory.find({});
    console.log(`\nFound ${topSelling.length} top-selling categories. Checking...`);
    let topSellingUpdates = 0;
    for (const tc of topSelling) {
      let tcModified = false;
      if (tc.image && tc.image.startsWith('data:image')) {
        console.log(`Migrating top-selling category "${tc.name}" main image...`);
        const newUrl = await convertBase64ToBinary(tc.image);
        if (newUrl) {
          tc.image = newUrl;
          tcModified = true;
        }
      }
      if (tc.subs && tc.subs.length > 0) {
        for (const sub of tc.subs) {
          if (sub.products && sub.products.length > 0) {
            for (const p of sub.products) {
              if (p.image && p.image.startsWith('data:image')) {
                console.log(`Migrating top-selling product "${p.name}" in sub "${sub.name}"...`);
                const newUrl = await convertBase64ToBinary(p.image);
                if (newUrl) {
                  p.image = newUrl;
                  tcModified = true;
                }
              }
            }
          }
        }
      }
      if (tcModified) {
        await tc.save();
        topSellingUpdates++;
        console.log(`Successfully updated top-selling category "${tc.name}"`);
      }
    }
    console.log(`Successfully migrated ${topSellingUpdates} top-selling categories.`);

    console.log('\nMigration successfully complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
