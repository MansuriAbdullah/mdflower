const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const frontendFiles = [
  '../frontend/src/pages/Home.jsx',
  '../frontend/src/pages/TopSellingArticles.jsx'
];

for (const file of frontendFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace all occurences of "$ with "₹
    content = content.replace(/"\$/g, '"₹');
    // For Home.jsx, we also had price="$..."
    content = content.replace(/price="\$([\d.]+)"/g, 'price="₹$1"');
    
    // Fix the mess made in the last replace for Home.jsx
    if (file.includes('Home.jsx')) {
      content = content.replace(/<div style={{ width: '80px', height: '3px', background: '#d4af37', margin: '0 auto' }}        <div style={{ display: 'grid', gridTemplateColumns: 'repeat\(auto-fit, minmax\(280px, 1fr\)\)', gap: '30px' }}>/g, 
        '<div style={{ width: \'80px\', height: \'3px\', background: \'#d4af37\', margin: \'0 auto\' }}></div>\n        </div>\n        <div style={{ display: \'grid\', gridTemplateColumns: \'repeat(auto-fit, minmax(220px, 1fr))\', gap: \'30px\' }}>');
      content = content.replace(/<\/div>\.png" \/>\n        <\/div>/g, '</div>');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated UI prices in ${file}`);
  }
}

// Update Database
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log("Connected to MongoDB");
    const products = await Product.find();
    let updatedCount = 0;
    for (let p of products) {
        if (p.price && p.price.includes('$')) {
            p.price = p.price.replace(/\$/g, '₹');
            await p.save();
            updatedCount++;
        }
    }
    console.log(`Updated ${updatedCount} products in Database.`);
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
