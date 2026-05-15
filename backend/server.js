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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
