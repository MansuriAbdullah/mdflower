const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const Category = require('./models/Category');

const productsData = [
  // Loose Flower Heads -> Premium
  { category: 'Loose Flower Heads', sub: 'Premium Flower Heads', variety: 'Orchids', name: 'Sapphire Velvet Orchid', price: "$55.00", image: "/premium_orchid_blue_1777448990406.png", color: 'Blue', description: 'Exquisite sapphire blue orchid with velvet-like petals, perfect for luxury centerpieces.' },
  { category: 'Loose Flower Heads', sub: 'Premium Flower Heads', variety: 'Tulips', name: 'Alabaster Silk Tulip', price: "$48.00", image: "/premium_tulip_white_1777449008658.png", color: 'White', description: 'Pure white tulips crafted from fine silk, symbolizing elegance and purity.' },
  { category: 'Loose Flower Heads', sub: 'Premium Flower Heads', variety: 'Daisies', name: 'Golden Sun Daisy', price: "$25.00", image: "/premium_daisy_yellow_1777449025841.png", color: 'Yellow', description: 'Cheerful yellow daisies that bring a touch of sunshine to any arrangement.' },
  { category: 'Loose Flower Heads', sub: 'Premium Flower Heads', variety: 'Cherry Blossoms', name: 'Sakura Dream Branch', price: "$65.00", image: "/cherry_blossom_pink_1777449042427.png", color: 'Pink', description: 'Delicate pink cherry blossoms on a lifelike branch, capturing the essence of spring.' },
  { category: 'Loose Flower Heads', sub: 'Premium Flower Heads', variety: 'Roses', name: 'Royal Gold Metallic Rose', price: "$45.00", image: "/gold_rose_1777449057426.png", color: 'Gold', description: 'Hand-painted metallic gold rose, a statement of luxury and opulence.' },
  { category: 'Loose Flower Heads', sub: 'Premium Flower Heads', variety: 'Roses', name: 'Midnight Velvet Rose', price: "$42.00", image: "/premium_orchid_blue_1777448990406.png", color: 'Blue', description: 'Deep midnight blue rose with a soft velvet texture, ideal for dramatic decor.' },
  { category: 'Loose Flower Heads', sub: 'Premium Flower Heads', variety: 'Liliyums', name: 'Premium Pink Lilyum', price: "$32.00", image: "/cherry_blossom_pink_1777449042427.png", color: 'Pink', description: 'Vibrant pink lily with detailed stamens and life-like petal curvature.' },
  { category: 'Loose Flower Heads', sub: 'Premium Flower Heads', variety: 'Sunflowers', name: 'Gilded Sunflower', price: "$35.00", image: "/premium_daisy_yellow_1777449025841.png", color: 'Orange', description: 'Stunning gilded sunflower with golden highlights, perfect for rustic-luxe themes.' },
  
  // Bunches
  { category: 'Bunches', sub: 'Lavender Bunches', name: 'Provence Lavender Harvest', price: "$75.00", image: "/lavender_bunch_1777449072375.png", color: 'Purple', description: 'A lush bunch of aromatic-style lavender, bringing the fields of Provence to your home.' },
  { category: 'Bunches', sub: 'Flower Bunches', name: 'Royal Pastel Bouquet', price: "$125.00", image: "/cherry_blossom_pink_1777449042427.png", color: 'Pink', description: 'A grand bouquet of mixed pastel blooms, wrapped in premium paper.' },
  { category: 'Bunches', sub: 'Green Bunches', name: 'Premium Eucalyptus Harvest', price: "$45.00", image: "/eucalyptus_bunch_1777449087274.png", color: 'Green', description: 'Silver-green eucalyptus leaves that add a fresh, modern touch to any space.' },

  // Chandeliers
  { category: 'Chandeliers', sub: 'Crystal Chandeliers', name: 'Luxury Bloom Chandelier', price: "$1800.00", image: "/crystal_chandelier_1777449108874.png", color: 'Clear', description: 'A masterpiece of design, this crystal chandelier is shaped like a cascading garden of light.' },
  { category: 'Chandeliers', sub: 'Glass Chandeliers', name: 'Waterfall Crystal Cascade', price: "$1200.00", image: "/crystal_chandelier_1777449108874.png", color: 'Clear', description: 'Elegant glass chandelier inspired by the fluid beauty of a waterfall.' },
  { category: 'Chandeliers', sub: 'Crystal Chandeliers', name: 'Crystal Rain Chandelier', price: "$1500.00", image: "/crystal_chandelier_1777449108874.png", color: 'Clear', description: 'Crystal droplets hanging like rain, creating a dazzling display of reflections.' },

  // LED Item
  { category: 'LED Item', sub: 'LED Stands', name: 'Ethereal Glow Flower Stand', price: "$320.00", image: "/led_flower_stand_1777449127985.png", color: 'White', description: 'Illuminated glass stand that makes the flowers within glow with a soft, magical light.' },
  { category: 'LED Item', sub: 'LED Stands', name: 'Neon Garden Frame', price: "$250.00", image: "/led_flower_stand_1777449127985.png", color: 'Gold', description: 'Sleek gold frame with neon accents, perfect for modern wedding decor.' },

  // Flower Walls
  { category: 'Flower Walls', sub: 'Rose Walls', name: 'Empress Red Rose Wall', price: "$3500.00", image: "/red_rose_wall_1777449145657.png", color: 'Red', description: 'High-density wall of deep red roses, the ultimate backdrop for royal weddings.' },
  { category: 'Flower Walls', sub: 'Flower Mats', name: 'Snow White Floral Mat', price: "$85.00", image: "/white_flower_mat_1777449163130.png", color: 'White', description: 'Pure white floral mat for floors or wall accents, creating a pristine garden feel.' },
  { category: 'Flower Walls', sub: 'Flower Mats', name: 'Blush Peony Wall Mat', price: "$120.00", image: "/cherry_blossom_pink_1777449042427.png", color: 'Pink', description: 'Soft pink peony mat, dense and luxurious, perfect for romantic settings.' },
  { category: 'Flower Walls', sub: 'Flower Mats', name: 'Pastel Meadow Mat', price: "$140.00", image: "/white_flower_mat_1777449163130.png", color: 'Mixed', description: 'A mix of various pastel flowers, creating a diverse and natural meadow appearance.' },

  // Chairs
  { category: 'Chairs', sub: 'Wedding Chairs', name: 'Floral Ghost Ceremony Chair', price: "$280.00", image: "/premium_tulip_white_1777449008658.png", color: 'Pink', description: 'Transparent ghost chair decorated with premium flowers, blending modern and classic styles.' },
  { category: 'Chairs', sub: 'Acrylic Chairs', name: 'Crystal Ghost Elite', price: "$160.00", image: "/crystal_chandelier_1777449108874.png", color: 'Clear', description: 'Sleek, invisible acrylic chair that allows the venue decor to shine.' },

  // Leaves
  { category: 'Leaves', sub: 'Artificial Leaves', name: 'Premium Tropical Philodendron', price: "$18.00", image: "/monstera_leaf_1777449184102.png", description: 'Highly realistic philodendron leaves with deep green hues and natural leaf patterns.' },
  { category: 'Leaves', sub: 'Tropical Leaves', name: 'Grand Monstera Leaf', price: "$35.00", image: "/monstera_leaf_1777449184102.png", description: 'Large, iconic monstera leaf that serves as a bold architectural element in any vase.' },
  { category: 'Leaves', sub: 'Tropical Leaves', name: 'Royal Palm Frond', price: "$28.00", image: "/eucalyptus_bunch_1777449087274.png", description: 'Lush green palm frond, bringing a tropical luxury feel to your arrangements.' },
  { category: 'Leaves', sub: 'Artificial Leaves', name: 'Autumn Maple Spray', price: "$22.00", image: "/premium_daisy_yellow_1777449025841.png", description: 'Richly colored maple leaves in shades of orange and red, perfect for seasonal decor.' },

  // Hangings
  { category: 'Hangings', sub: 'Flower Hangings', name: 'Cascading Wisteria Drape', price: "$95.00", image: "/lavender_bunch_1777449072375.png", description: 'Long, cascading wisteria flowers that create a dreamy, romantic atmosphere from above.' },
  { category: 'Hangings', sub: 'Wisteria Hangings', name: 'Midnight Wisteria Hanging', price: "$110.00", image: "/premium_orchid_blue_1777448990406.png", description: 'Deep purple wisteria hangings for high-contrast dramatic floral ceiling designs.' },

  // Flower Sticks
  { category: 'Flower Sticks', sub: 'N/A', name: 'Elegant Lavender Stick', price: "$15.00", image: "/lavender_bunch_1777449072375.png", color: 'Purple', description: 'Single stem of high-detail lavender, perfect for minimalist vases.' },
  { category: 'Flower Sticks', sub: 'N/A', name: 'Golden Rose Stem', price: "$25.00", image: "/gold_rose_1777449057426.png", color: 'Gold', description: 'Single gold rose on a detailed stem, a perfect single-stem gift or accent.' },

  // Bookey
  { category: 'Bookey', sub: 'N/A', name: 'Signature Red Rose Bridal Bouquet', price: "$180.00", image: "/red_rose_wall_1777449145657.png", description: 'A timeless bridal bouquet of premium red roses, expertly hand-tied for the big day.' },

  // Pots
  { category: 'Pots', sub: 'N/A', name: 'Grand Golden Ceramic Pot', price: "$450.00", image: "/gold_rose_1777449057426.png", description: 'Exquisitely carved golden ceramic pot, a masterpiece of craftsmanship for your luxury plants.' },
  
  // Wedding Special
  { category: 'Wedding Special', sub: 'Bridal Bouquets', name: 'Royal Ivory Bridal Bouquet', price: "$220.00", image: "/premium_tulip_white_1777449008658.png", description: 'A timeless bridal bouquet of premium white silk roses and pearls.' },
  { category: 'Wedding Special', sub: 'Stage Decor', name: 'Golden Arch Garland', price: "$450.00", image: "/gold_rose_1777449057426.png", description: 'Thick, lush golden floral garland for grand stage decorations.' },
  { category: 'Wedding Special', sub: 'Car Decor', name: 'Grand Entrance Floral Hood', price: "$180.00", image: "/red_rose_wall_1777449145657.png", description: 'Elegant red and gold flower arrangement for wedding car decor.' },

  // Home Decor
  { category: 'Home Decor', sub: 'Table Vases', name: 'Minimalist Ceramic Bloom', price: "$65.00", image: "/premium_tulip_white_1777449008658.png", description: 'Modern ceramic vase with a single lifelike lily stem.' },
  { category: 'Home Decor', sub: 'Corner Stands', name: 'Tiered Floral Stand', price: "$145.00", image: "/led_flower_stand_1777449127985.png", description: 'Sleek black metal stand with three levels of cascading flowers.' },

  // Corporate Decor
  { category: 'Corporate Decor', sub: 'Reception Bouquets', name: 'Executive White Orchid', price: "$155.00", image: "/premium_tulip_white_1777449008658.png", description: 'Sophisticated orchids in a glass vase, perfect for high-end reception desks.' },
  { category: 'Corporate Decor', sub: 'Conference Room', name: 'Minimalist Green Spray', price: "$85.00", image: "/eucalyptus_bunch_1777449087274.png", description: 'Fresh and modern greenery for a professional atmosphere.' },
];

const categoryStructure = [
  { name: 'SHOP ALL', subs: [] },
  { name: 'Loose Flower Heads', subs: [{name: 'Premium Flower Heads', img: '/premium_orchid_blue_1777448990406.png'}, {name: 'Regular Flower Heads', img: '/premium_tulip_white_1777449008658.png'}] },
  { name: 'Leaves', subs: [{name: 'Artificial Leaves', img: '/monstera_leaf_1777449184102.png'}, {name: 'Tropical Leaves', img: '/eucalyptus_bunch_1777449087274.png'}] },
  { name: 'Bunches', subs: [{name: 'Flower Bunches', img: '/cherry_blossom_pink_1777449042427.png'}, {name: 'Green Bunches', img: '/eucalyptus_bunch_1777449087274.png'}, {name: 'Lavender Bunches', img: '/lavender_bunch_1777449072375.png'}] },
  { name: 'Hangings', subs: [{name: 'Flower Hangings', img: '/lavender_bunch_1777449072375.png'}, {name: 'Wisteria Hangings', img: '/premium_orchid_blue_1777448990406.png'}] },
  { name: 'Chandeliers', subs: [{name: 'Crystal Chandeliers', img: '/crystal_chandelier_1777449108874.png'}, {name: 'Glass Chandeliers', img: '/crystal_chandelier_1777449108874.png'}] },
  { name: 'LED Item', subs: [{name: 'LED Stands', img: '/led_flower_stand_1777449127985.png'}, {name: 'Glow Frames', img: '/led_flower_stand_1777449127985.png'}] },
  { name: 'Flower Walls', subs: [{name: 'Rose Walls', img: '/red_rose_wall_1777449145657.png'}, {name: 'Flower Mats', img: '/white_flower_mat_1777449163130.png'}] },
  { name: 'Flower Sticks', subs: [{name: 'Elegant Sticks', img: '/gold_rose_1777449057426.png'}] },
  { name: 'Candles & Showpieces', subs: [{name: 'Candles', img: '/premium_daisy_yellow_1777449025841.png'}, {name: 'Showpieces', img: '/led_flower_stand_1777449127985.png'}] },
  { name: 'Pots', subs: [{name: 'Ceramic Pots', img: '/gold_rose_1777449057426.png'}] },
  { name: 'Wedding Special', subs: [{name: 'Bridal Bouquets', img: ''}, {name: 'Stage Decor', img: ''}, {name: 'Car Decor', img: ''}] },
  { name: 'Home Decor', subs: [{name: 'Table Vases', img: ''}, {name: 'Corner Stands', img: ''}] },
  { name: 'Corporate Decor', subs: [{name: 'Reception Bouquets', img: ''}, {name: 'Conference Room', img: ''}] }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected. Starting Seed...');

    // Clear existing
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Insert Categories
    for (const cat of categoryStructure) {
      if (cat.name !== 'SHOP ALL') {
        await Category.create({ name: cat.name, subs: cat.subs });
      }
    }
    console.log('Categories seeded.');

    // Insert Products
    if (productsData.length > 0) {
      await Product.insertMany(productsData);
      console.log(`Seeded ${productsData.length} products.`);
    } else {
      console.log("No products found to seed.");
    }

    console.log('Seed Complete!');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
