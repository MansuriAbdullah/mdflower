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
const Review = require('./models/Review');
const Lead = require('./models/Lead');
const Visit = require('./models/Visit');
const Image = require('./models/Image');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection Caching helper for Serverless environments (Vercel)
let connectionPromise = null;

const seedDefaultReviews = async () => {
  try {
    const count = await Review.countDocuments();
    if (count === 0) {
      console.log('Review collection empty, seeding default reviews...');
      const defaultReviews = [
        { name: "Priyanka Sharma", city: "Mumbai", img: "/client1.png", text: "The flower wall for my wedding exceeded all expectations. It was the centerpiece.", stars: 5, displayed: true },
        { name: "Rahul Mehta", city: "Delhi", img: "/client2.png", text: "Premium quality artificial flowers that look more real than nature itself. Simply breathtaking.", stars: 5, displayed: true },
        { name: "Ananya Iyer", city: "Bangalore", img: "/client3.png", text: "MD Flowers has changed my home. Their LED hangings bring a magical aura.", stars: 5, displayed: true },
        { name: "Vikram Singh", city: "Jaipur", img: "https://picsum.photos/seed/v/100/100", text: "Exceptional craftsmanship. The attention to detail is unparalleled.", stars: 5, displayed: true },
        { name: "Sanya Kapoor", city: "Chandigarh", img: "https://picsum.photos/seed/s/100/100", text: "Ordered custom floral drapes for a gala. Flawless design.", stars: 5, displayed: true },
        { name: "Meera Das", city: "Kolkata", img: "https://picsum.photos/seed/m/100/100", text: "The loose jasmine heads are so fresh-looking. Perfect for ceremonies.", stars: 5, displayed: true },
        { name: "Karan Johar", city: "Mumbai", img: "https://picsum.photos/seed/k/100/100", text: "The best floral decor in India. Period.", stars: 5, displayed: true },
        { name: "Deepika P.", city: "Bangalore", img: "https://picsum.photos/seed/d/100/100", text: "Elegant, luxury, and classy. Exactly what I wanted.", stars: 5, displayed: true }
      ];
      await Review.insertMany(defaultReviews);
      console.log('Default reviews seeded successfully!');
    }
  } catch (err) {
    console.error('Error seeding default reviews:', err);
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    connectionPromise = null;
  }
  
  if (!connectionPromise) {
    console.log('Database connection initiated...');
    connectionPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,    // Fast timeout so we don't hang serverless functions indefinitely
      tlsAllowInvalidCertificates: true, // Bypass SSL cert validation if handshake fails due to cert issues
      maxPoolSize: 2,                    // Limit connections per serverless instance to prevent exhaustion
      bufferCommands: false              // Disable Mongoose buffering in serverless environment
    }).then(async (conn) => {
      console.log('MongoDB Connected to MDFLOWERS');
      await seedDefaultReviews();
      return conn;
    }).catch((err) => {
      connectionPromise = null;
      console.error('MongoDB Connection Error: ', err);
      throw err;
    });
  }
  
  await connectionPromise;
  return mongoose.connection;
};

// Proactively initiate connection on server startup
connectDB().catch(err => console.log('MongoDB Connection error at startup:', err));

// Root Route
app.get('/', (req, res) => {
  res.send('MDFlowers API is running...');
});

// Health/Debug Route (runs above middleware so it won't trigger 500 if connection fails)
app.get('/api/health', async (req, res) => {
  let dbStatus = 'unknown';
  let dbError = null;
  try {
    await connectDB();
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'error';
    dbError = err.message;
  }

  res.json({
    status: 'ok',
    database: dbStatus,
    databaseError: dbError,
    mongoUriDefined: !!process.env.MONGO_URI,
    mongoUriPrefix: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 15) : null,
    mongoUri: process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@') : null,
    mongooseState: mongoose.connection.readyState,
    apiVersion: 'v3-connection-middleware'
  });
});

// Database connection middleware to handle cold starts and ensure DB is ready before request execution
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection error in middleware:', err);
    res.status(500).json({ error: 'Database connection failed: ' + err.message });
  }
});

// Multer Storage Configuration (Memory Storage for Vercel)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB limit
});

// Connection is managed dynamically by the connectDB helper and middleware


// --- ROUTES ---

// Helper function to strip domain host from database image URLs
const stripApiUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  const match = url.match(/(https?:\/\/[^\/]+)?(\/api\/images\/[a-f0-9]+|\/uploads\/[a-zA-Z0-9_\-\.\/]+)/);
  return match ? match[2] : url;
};

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
        quality: 0.95 // High quality conversion for HEIC
      });
      mimeType = 'image/jpeg';
    }
    
    // Create new Image document in DB
    const newImage = new Image({
      data: fileBuffer,
      contentType: mimeType
    });
    const savedImage = await newImage.save();
    
    // Return relative API image URL
    const imageUrl = `/api/images/${savedImage._id}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ message: 'Failed to process image' });
  }
});

// GET Route to serve product detail HTML page for shared links (e.g. WhatsApp) or JSON for API
const handleProductRequest = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean();
    }
    if (!product) {
      product = await Product.findOne({ id: id }).lean();
    }

    const host = req.get('host') || 'mdflower-qvjl.vercel.app';
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const baseUrl = `${protocol}://${host}`;

    let imageUrl = product && product.image ? product.image : '';
    if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }

    const productName = product ? product.name : 'MD Flowers Product';
    const productPrice = product ? product.price : '';
    const productDesc = product ? (product.description || 'Premium luxury floral design from MD Flowers Collection.') : 'MD Flowers Premium Collection';

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${productName} - MD Flowers</title>
  <meta property="og:title" content="${productName} - ${productPrice}">
  <meta property="og:description" content="${productDesc}">
  <meta property="og:image" content="${imageUrl}">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #fffdf0; color: #1a130d; margin: 0; padding: 40px 20px; text-align: center; }
    .container { max-width: 500px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid #d4af37; }
    img { max-width: 100%; height: 300px; object-fit: cover; border-radius: 15px; margin-bottom: 20px; border: 1px solid rgba(212,175,55,0.3); }
    h1 { color: #1a130d; font-size: 1.8rem; margin-bottom: 10px; }
    .price { color: #d4af37; font-size: 1.5rem; font-weight: bold; margin-bottom: 15px; }
    .desc { color: #555; line-height: 1.6; margin-bottom: 25px; font-size: 0.95rem; }
    .btn { display: inline-block; background: #1a130d; color: #d4af37; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: bold; border: 1px solid #d4af37; }
  </style>
</head>
<body>
  <div class="container">
    ${imageUrl ? `<img src="${imageUrl}" alt="${productName}" loading="eager" referrerpolicy="no-referrer" />` : ''}
    <h1>${productName}</h1>
    ${productPrice ? `<div class="price">${productPrice}</div>` : ''}
    <div class="desc">${productDesc}</div>
    <a href="https://wa.me/919016853590?text=${encodeURIComponent(`Hello MD FLOWERS, I am interested in ${productName}`)}" class="btn">Order on WhatsApp 💬</a>
  </div>
</body>
</html>`);
  } catch (err) {
    console.error('Error handling product link:', err);
    res.status(500).send('Error loading product');
  }
};

app.get('/api/products/:id', handleProductRequest);
app.get('/api/product/:id', handleProductRequest);
app.get('/product/:id', handleProductRequest);

// GET Route to serve binary images from DB with cache headers
app.get('/api/images/:id', async (req, res) => {
  try {
    // Validate ObjectId to prevent CastError from crashing/500ing
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send('Invalid image ID');
    }

    const img = await Image.findById(req.params.id).lean();
    if (!img) {
      return res.status(404).send('Image not found');
    }
    
    // Express res.send() needs a Node Buffer to serve binary data correctly.
    // Mongoose .lean() queries return MongoDB Binary objects instead of Buffers.
    const buffer = Buffer.isBuffer(img.data) ? img.data : img.data.buffer;
    
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', img.contentType);
    // Cache for 1 year in browser and Vercel Edge CDN
    res.set('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
    res.send(buffer);
  } catch (err) {
    console.error('Error serving image:', err);
    res.status(500).send('Error serving image');
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
    const cleanedSubs = (subs || []).map(s => ({
      name: s.name,
      img: stripApiUrl(s.img)
    }));
    const newCat = new Category({ name, subs: cleanedSubs });
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
    const cleanedSubs = (subs || []).map(s => ({
      name: s.name,
      img: stripApiUrl(s.img)
    }));
    const updatedCat = await Category.findByIdAndUpdate(
      req.params.id, 
      { name, subs: cleanedSubs },
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
    const productData = { ...req.body };
    if (productData.image) {
      productData.image = stripApiUrl(productData.image);
    }
    const newProduct = new Product(productData);
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
    const productData = { ...req.body };
    if (productData.image) {
      productData.image = stripApiUrl(productData.image);
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      productData, 
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
    const cleanedImage = stripApiUrl(image);
    const cleanedSubs = (subs || []).map(sub => ({
      name: sub.name,
      products: (sub.products || []).map(p => ({
        name: p.name,
        price: p.price,
        image: stripApiUrl(p.image)
      }))
    }));
    const newCat = new TopSellingCategory({ name, image: cleanedImage, subs: cleanedSubs });
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
    const cleanedImage = stripApiUrl(image);
    const cleanedSubs = (subs || []).map(sub => ({
      name: sub.name,
      products: (sub.products || []).map(p => ({
        name: p.name,
        price: p.price,
        image: stripApiUrl(p.image)
      }))
    }));
    const updatedCat = await TopSellingCategory.findByIdAndUpdate(
      req.params.id, 
      { name, image: cleanedImage, subs: cleanedSubs },
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

// --- REVIEWS ROUTES ---

// GET All Reviews (Admin View - all reviews sorted by newest first)
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET Approved Reviews (Public View - displayed: true, sorted by newest first)
app.get('/api/reviews/approved', async (req, res) => {
  try {
    const reviews = await Review.find({ displayed: true }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST New Review (Public submission)
app.post('/api/reviews', async (req, res) => {
  const { name, city, text, stars } = req.body;
  
  // Choose a random seed index for picsum photo, or let user have default avatar
  const seedChar = name ? name.trim().charAt(0).toLowerCase() : 'a';
  const imgUrl = `https://picsum.photos/seed/${seedChar + Math.floor(Math.random() * 100)}/100/100`;

  try {
    const newReview = new Review({
      name,
      city: city || 'India',
      text,
      stars: Number(stars) || 5,
      img: imgUrl,
      displayed: false // Awaits admin approval
    });
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT Update Review (Admin approves/disapproves or updates status)
app.put('/api/reviews/:id', async (req, res) => {
  const { displayed } = req.body;
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { displayed },
      { new: true }
    );
    if (!updatedReview) return res.status(404).json({ message: 'Review not found' });
    res.json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE Review (Admin deletes review)
app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- LEADS ROUTES ---

// GET All Leads (Admin view)
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST New Lead (Public submission)
app.post('/api/leads', async (req, res) => {
  const { name, number, category } = req.body;
  try {
    const newLead = new Lead({ name, number, category });
    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT Update Lead Status (Admin updates status e.g. Contacted, Pending)
app.put('/api/leads/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedLead) return res.status(404).json({ message: 'Lead not found' });
    res.json(updatedLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE Lead (Admin deletes lead)
app.delete('/api/leads/:id', async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);
    if (!deletedLead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ANALYTICS / VISITOR TRACKING ROUTES ---

// POST Route to log page visits
app.post('/api/visits', async (req, res) => {
  try {
    let ip = req.headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || 'unknown';
    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }
    
    // Get IST Date string (YYYY-MM-DD)
    const utcDate = new Date();
    const istDate = new Date(utcDate.getTime() + (330 * 60 * 1000));
    const dateStr = istDate.toISOString().split('T')[0];

    const newVisit = new Visit({ ip, date: dateStr });
    await newVisit.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Error logging visit:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET Route to fetch traffic stats
app.get('/api/analytics', async (req, res) => {
  try {
    const utcDate = new Date();
    const istDate = new Date(utcDate.getTime() + (330 * 60 * 1000));
    const today = istDate.toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7); // YYYY-MM

    // 1. Today's stats
    const todayPageViews = await Visit.countDocuments({ date: today });
    const todayUniqueVisitors = await Visit.distinct('ip', { date: today }).then(ips => ips.length);

    // 2. Current Month's stats
    const monthPageViews = await Visit.countDocuments({ date: new RegExp('^' + currentMonth) });
    const monthUniqueVisitors = await Visit.distinct('ip', { date: new RegExp('^' + currentMonth) }).then(ips => ips.length);

    // 3. Total stats
    const totalPageViews = await Visit.countDocuments();
    const totalUniqueVisitors = await Visit.distinct('ip').then(ips => ips.length);

    res.json({
      today: {
        pageViews: todayPageViews,
        uniqueVisitors: todayUniqueVisitors
      },
      month: {
        pageViews: monthPageViews,
        uniqueVisitors: monthUniqueVisitors
      },
      total: {
        pageViews: totalPageViews,
        uniqueVisitors: totalUniqueVisitors
      }
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
