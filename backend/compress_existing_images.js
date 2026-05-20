require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Jimp = require('jimp');

async function compressBase64(base64Str) {
  if (!base64Str || !base64Str.startsWith('data:image')) {
    return base64Str; // Not a base64 image (maybe a relative path / URL)
  }
  
  try {
    const commaIndex = base64Str.indexOf(',');
    if (commaIndex === -1) return base64Str;
    
    const base64Data = base64Str.substring(commaIndex + 1);
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Read image using Jimp
    const image = await Jimp.read(buffer);
    
    const maxDim = 800;
    let width = image.bitmap.width;
    let height = image.bitmap.height;
    
    let resized = false;
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
      image.resize(width, height);
      resized = true;
    }
    
    image.quality(70); // Compress to 70% JPEG quality
    
    const compressedBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    const compressedBase64 = compressedBuffer.toString('base64');
    const result = `data:image/jpeg;base64,${compressedBase64}`;
    
    console.log(`  - Dimensions: ${image.bitmap.width}x${image.bitmap.height} (resized: ${resized})`);
    return result;
  } catch (err) {
    console.error('  - Error during Jimp compression:', err.message);
    throw err;
  }
}

async function migrate() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // Compress Product Images
    const products = await Product.find({});
    console.log(`\nFound ${products.length} products. Checking for base64 images...`);
    let productUpdates = 0;
    
    for (const p of products) {
      if (p.image && p.image.startsWith('data:image')) {
        const originalKb = (p.image.length / 1024).toFixed(1);
        console.log(`Compressing image for product: "${p.name}" (${originalKb} KB)`);
        
        try {
          const compressed = await compressBase64(p.image);
          const newKb = (compressed.length / 1024).toFixed(1);
          console.log(`  - Size: ${originalKb} KB -> ${newKb} KB`);
          
          if (compressed.length < p.image.length) {
            p.image = compressed;
            await p.save();
            productUpdates++;
            console.log(`  - Saved product successfully!`);
          } else {
            console.log(`  - Already optimal size, skipping update.`);
          }
        } catch (err) {
          console.error(`  - Failed to compress: ${err.message}`);
        }
      }
    }
    console.log(`Updated ${productUpdates} products.`);

    // Compress Category Sub-images
    const categories = await Category.find({});
    console.log(`\nFound ${categories.length} categories. Checking sub-categories...`);
    let categoryUpdates = 0;
    
    for (const c of categories) {
      let categoryModified = false;
      if (c.subs && c.subs.length > 0) {
        for (const sub of c.subs) {
          if (sub.img && sub.img.startsWith('data:image')) {
            const originalKb = (sub.img.length / 1024).toFixed(1);
            console.log(`Compressing image for category "${c.name}" -> sub "${sub.name}" (${originalKb} KB)`);
            
            try {
              const compressed = await compressBase64(sub.img);
              const newKb = (compressed.length / 1024).toFixed(1);
              console.log(`  - Size: ${originalKb} KB -> ${newKb} KB`);
              
              if (compressed.length < sub.img.length) {
                sub.img = compressed;
                categoryModified = true;
              } else {
                console.log(`  - Already optimal size, skipping sub-category update.`);
              }
            } catch (err) {
              console.error(`  - Failed to compress sub-category: ${err.message}`);
            }
          }
        }
      }
      if (categoryModified) {
        c.markModified('subs');
        await c.save();
        categoryUpdates++;
        console.log(`Saved category "${c.name}" successfully!`);
      }
    }
    console.log(`Updated ${categoryUpdates} categories.`);
    
    console.log('\nMigration complete! Database is now optimized.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
