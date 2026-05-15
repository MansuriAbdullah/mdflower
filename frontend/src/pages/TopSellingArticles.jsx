import React from 'react';
import ProductCard from '../components/ProductCard';

const TopSellingArticles = () => {
  const products = [
    { id: 'ts1', name: "Luxe Floor Palm", price: "₹180", image: "/cat_floor.png", variety: 'Plant' },
    { id: 'ts2', name: "Marble Geometric Vase", price: "₹95", image: "/cat_planters.png", variety: 'Decor' },
    { id: 'ts3', name: "Emerald Hanging Ivy", price: "₹65", image: "/cat_hanging.png", variety: 'Plant' },
    { id: 'ts4', name: "Golden Elephant Statue", price: "₹220", image: "/cat_table.png", variety: 'Decor' },
    { id: 'ts5', name: "Floral Canvas Art", price: "₹140", image: "/cat_wall.png", variety: 'Art' },
    { id: 'ts6', name: "Crystal Chandelier", price: "₹450", image: "/crystal_chandelier_luxe_1776254399476.png", variety: 'Light' },
    { id: 'ts7', name: "Premium Rose Box", price: "₹120", image: "/product1.png", variety: 'Flower' },
    { id: 'ts8', name: "Autumn Gold Bundle", price: "₹85", image: "/product2.png", variety: 'Flower' },
  ];

  return (
    <div style={{ padding: '120px 8% 60px', background: '#fffdf0', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h4 style={{ color: '#d4af37', textTransform: 'uppercase', letterSpacing: '5px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px' }}>
          Curated Excellence
        </h4>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', marginBottom: '15px' }}>Top Selling <span className="gold-gradient-text">Articles</span></h1>
        <p style={{ color: '#1a130d', opacity: 0.8, maxWidth: '700px', margin: '0 auto' }}>
          Explore our most coveted pieces, handpicked for their timeless beauty and exceptional craftsmanship.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '40px' 
      }}>
        {products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default TopSellingArticles;
