import React, { useContext, useState } from 'react';
import { DataContext } from '../DataContext';
import ProductCard from '../components/ProductCard';

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const hostname = window.location.hostname;
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
  return isLocalHost ? 'http://localhost:5000' : 'https://mdflower-qvjl.vercel.app';
};
const API_URL = getApiUrl();

const resolveImageUrl = (img) => {
  if (!img) return '';
  if (img.startsWith('/') && !img.startsWith('/uploads')) {
    return img;
  }
  if (img.startsWith('http') || img.startsWith('data:')) {
    return img;
  }
  return `${API_URL}${img.startsWith('/') ? img : '/' + img}`;
};

const TopSellingArticles = () => {
  const { topSellingCategories, loading } = useContext(DataContext);
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  if (loading) {
    return (
      <div style={{ padding: '120px 8% 60px', background: '#fffdf0', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="luxury-spinner" style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(212, 175, 55, 0.1)',
          borderTop: '3px solid #d4af37',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }} />
        <p style={{ fontFamily: 'Cinzel, serif', color: '#1a130d', letterSpacing: '2px', fontSize: '1rem' }}>LOADING COLLECTION...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const activeCategory = topSellingCategories[activeTabIdx] || null;

  return (
    <div style={{ padding: 'clamp(100px, 12vw, 140px) 5% 40px', background: '#fffdf0', minHeight: '100vh', fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h4 style={{ color: '#d4af37', textTransform: 'uppercase', letterSpacing: '5px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px' }}>
          Curated Excellence
        </h4>
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.8rem)', marginBottom: '15px', fontFamily: 'Cinzel, serif', color: '#1a130d' }}>
          Top Selling <span className="gold-gradient-text" style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f9e8a2 50%, #b8860b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Articles</span>
        </h1>
        <p style={{ color: '#1a130d', opacity: 0.8, maxWidth: '700px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
          Explore our most coveted pieces, handpicked for their timeless beauty and exceptional craftsmanship.
        </p>
      </div>

      {/* Elegant Category Tabs */}
      {topSellingCategories.length > 0 ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '60px',
          borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
          paddingBottom: '20px'
        }}>
          {topSellingCategories.map((cat, idx) => {
            const isActive = idx === activeTabIdx;
            return (
              <button
                key={cat._id}
                onClick={() => setActiveTabIdx(idx)}
                style={{
                  background: isActive ? '#1a130d' : 'transparent',
                  color: isActive ? '#d4af37' : '#1a130d',
                  border: isActive ? '1px solid #1a130d' : '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '10px 24px',
                  borderRadius: '30px',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  letterSpacing: '1.5px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? '0 4px 15px rgba(26, 19, 13, 0.15)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = '#1a130d';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px 20px', background: '#fff', borderRadius: '15px', border: '1px solid rgba(212, 175, 55, 0.15)' }}>
          <p style={{ fontFamily: 'Cinzel, serif', fontSize: '1.2rem', color: '#1a130d' }}>No collections available at the moment.</p>
        </div>
      )}

      {/* Active Category Display */}
      {activeCategory && (
        <div className="fade-in">
          {activeCategory.image && (
            <div className="category-hero-banner" style={{
              width: '100%',
              height: '320px',
              borderRadius: '20px',
              overflow: 'hidden',
              marginBottom: '50px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.04)',
              border: '1px solid rgba(212, 175, 55, 0.15)',
              position: 'relative'
            }}>
              <img 
                src={resolveImageUrl(activeCategory.image)} 
                alt={activeCategory.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(26, 19, 13, 0.85) 0%, rgba(26, 19, 13, 0.2) 60%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '30px 4%',
                color: '#fff'
              }}>
                <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', margin: 0, color: '#f9e8a2', letterSpacing: '2px', textShadow: '1px 1px 4px rgba(0,0,0,0.5)', fontWeight: 'bold' }}>
                  {activeCategory.name}
                </h2>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem', color: '#fff', opacity: 0.9, marginTop: '8px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)', letterSpacing: '1px' }}>
                  Exquisite {activeCategory.name.toLowerCase()} curated for high-end styling and timeless appeal.
                </p>
              </div>
            </div>
          )}

          {activeCategory.subs && activeCategory.subs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
              {activeCategory.subs.map((sub, subIdx) => {
                const hasProducts = sub.products && sub.products.length > 0;
                if (!hasProducts) return null; // Only render subcategories with products
                return (
                  <div key={sub._id || subIdx} style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: '20px',
                    padding: 'clamp(15px, 4vw, 40px) clamp(10px, 3vw, 30px)',
                    border: '1px solid rgba(212, 175, 55, 0.12)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)'
                  }}>
                    {/* Subcategory Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '30px',
                      borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
                      paddingBottom: '15px'
                    }}>
                      <h3 style={{
                        fontFamily: 'Cinzel, serif',
                        fontSize: '1.3rem',
                        color: '#d4af37',
                        margin: 0,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold'
                      }}>
                        {sub.name}
                      </h3>
                      <span style={{
                        height: '1px',
                        flex: 1,
                        background: 'linear-gradient(to right, rgba(212, 175, 55, 0.3), transparent)'
                      }} />
                      <span style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '0.75rem',
                        color: '#666',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                      }}>
                        {sub.products.length} {sub.products.length === 1 ? 'Item' : 'Items'}
                      </span>
                    </div>

                    {/* Products Grid */}
                    <div className="product-grid" style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: '30px'
                    }}>
                      {sub.products.map((product) => (
                        <ProductCard
                          key={product._id}
                          id={product._id}
                          name={product.name}
                          price={product.price}
                          image={resolveImageUrl(product.image)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* If category has subcategories but all of them are empty */}
              {activeCategory.subs.every(sub => !sub.products || sub.products.length === 0) && (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '15px', border: '1px solid rgba(212, 175, 55, 0.15)' }}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '15px' }}>🌸</span>
                  <h3 style={{ fontFamily: 'Cinzel, serif', color: '#1a130d', marginBottom: '10px' }}>Items Coming Soon</h3>
                  <p style={{ color: '#666', fontSize: '0.95rem' }}>We are currently updating this collection. Check back shortly!</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '15px', border: '1px solid rgba(212, 175, 55, 0.15)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '15px' }}>🌸</span>
              <h3 style={{ fontFamily: 'Cinzel, serif', color: '#1a130d', marginBottom: '10px' }}>Items Coming Soon</h3>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>We are currently updating this collection. Check back shortly!</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TopSellingArticles;
