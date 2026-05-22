const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const heicConvert = require('heic-convert');
require('dotenv').config();

const Product = require('./models/Product');
const Category = require('./models/Category');
const TopSellingCategory = require('./models/TopSellingCategory');
const SignatureMasterpiece = require('./models/SignatureMasterpiece');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Storage Configuration (Memory Storage for Vercel)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB limit
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected to MDFLOWERS'))
.catch(err => console.log('MongoDB Connection Error: ', err));

// --- ROUTES ---

// Root Route
app.get('/', (req, res) => {
  res.send('MDFlowers API is running...');
});

// Health/Debug Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongoUriDefined: !!process.env.MONGO_URI,
    mongoUriPrefix: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 15) : null
  });
});

// Image Upload Route
app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  try {
    let fileBuffer = req.file.buffer;
    let mimeType = req.file.mimetype;
    
    // Check if the uploaded file is a HEIC image (from iPhone)
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext === '.heic' || ext === '.heif') {
      fileBuffer = await heicConvert({
        buffer: fileBuffer,
        format: 'JPEG',
        quality: 0.8 // Slightly reduced quality to keep base64 size manageable
      });
      mimeType = 'image/jpeg';
    }
    
    // Convert buffer to base64
    const base64Image = fileBuffer.toString('base64');
    const imageUrl = `data:${mimeType};base64,${base64Image}`;
    
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ message: 'Failed to process image' });
  }
});

// GET All Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST New Category
app.post('/api/categories', async (req, res) => {
  const { name, subs } = req.body;
  try {
    const newCat = new Category({ name, subs: subs || [] });
    const savedCat = await newCat.save();
    res.status(201).json(savedCat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE Category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const deletedCat = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCat) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT (Update) Category
app.put('/api/categories/:id', async (req, res) => {
  const { name, subs } = req.body;
  try {
    const updatedCat = await Category.findByIdAndUpdate(
      req.params.id, 
      { name, subs: subs || [] },
      { new: true }
    );
    if (!updatedCat) return res.status(404).json({ message: 'Category not found' });
    res.json(updatedCat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET All Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST New Product
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE Product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT (Update) Product
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- TOP SELLING CATEGORIES ROUTES ---

// GET All Top Selling Categories
app.get('/api/top-selling', async (req, res) => {
  try {
    const topSelling = await TopSellingCategory.find().sort({ createdAt: 1 });
    res.json(topSelling);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST New Top Selling Category
app.post('/api/top-selling', async (req, res) => {
  const { name, image, subs } = req.body;
  try {
    const newCat = new TopSellingCategory({ name, image, subs: subs || [] });
    const savedCat = await newCat.save();
    res.status(201).json(savedCat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE Top Selling Category
app.delete('/api/top-selling/:id', async (req, res) => {
  try {
    const deletedCat = await TopSellingCategory.findByIdAndDelete(req.params.id);
    if (!deletedCat) return res.status(404).json({ message: 'Top selling category not found' });
    res.json({ message: 'Top selling category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT (Update) Top Selling Category
app.put('/api/top-selling/:id', async (req, res) => {
  const { name, image, subs } = req.body;
  try {
    const updatedCat = await TopSellingCategory.findByIdAndUpdate(
      req.params.id, 
      { name, image, subs: subs || [] },
      { new: true }
    );
    if (!updatedCat) return res.status(404).json({ message: 'Top selling category not found' });
    res.json(updatedCat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- IMAGE GALLERY ROUTE ---

// GET Image Gallery
app.get('/api/gallery', async (req, res) => {
  try {
    const products = await Product.find({}, 'image');
    const categories = await Category.find({}, 'subs.img');
    const topCategories = await TopSellingCategory.find({}, 'image subs.products.image');
    
    const imageUrls = new Set();
    
    products.forEach(p => {
      if (p.image) imageUrls.add(p.image);
    });
    
    categories.forEach(c => {
      if (c.subs) {
        c.subs.forEach(s => {
          if (s.img) imageUrls.add(s.img);
        });
      }
    });

    topCategories.forEach(tc => {
      if (tc.image) imageUrls.add(tc.image);
      if (tc.subs) {
        tc.subs.forEach(sub => {
          if (sub.products) {
            sub.products.forEach(prod => {
              if (prod.image) imageUrls.add(prod.image);
            });
          }
        });
      }
    });
    
    // Also list local uploads if any
    const uploadsDir = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      try {
        const files = fs.readdirSync(uploadsDir);
        files.forEach(file => {
          if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
            imageUrls.add(`/uploads/${file}`);
          }
        });
      } catch (fsErr) {
        console.error("Error reading uploads dir:", fsErr);
      }
    }
    
    res.json(Array.from(imageUrls));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- SIGNATURE MASTERPIECES ROUTES ---

// GET Signature Masterpieces
app.get('/api/signature-masterpieces', async (req, res) => {
  try {
    const doc = await SignatureMasterpiece.findOne().populate('products');
    if (!doc) {
      return res.json([]);
    }
    res.json(doc.products || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT (Update) Signature Masterpieces
app.put('/api/signature-masterpieces', async (req, res) => {
  const { productIds } = req.body;
  if (!Array.isArray(productIds)) {
    return res.status(400).json({ message: 'productIds must be an array' });
  }
  if (productIds.length > 10) {
    return res.status(400).json({ message: 'Maximum limit of 10 signature masterpieces exceeded' });
  }
  try {
    let doc = await SignatureMasterpiece.findOne();
    if (!doc) {
      doc = new SignatureMasterpiece({ products: productIds });
    } else {
      doc.products = productIds;
    }
    await doc.save();
    const populated = await doc.populate('products');
    res.json(populated.products || []);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
