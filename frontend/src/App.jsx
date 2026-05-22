import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Collection from './pages/Collection';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import Reviews from './pages/Reviews';
import TopSellingArticles from './pages/TopSellingArticles';
import Varieties from './pages/Varieties';
import Admin from './pages/Admin';
import { CartProvider, CartContext } from './CartContext';
import { DataProvider } from './DataContext';

// --- Global Styles ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      scroll-behavior: smooth;
    }

    body {
      background-color: #fffdf0;
      color: #4a3b2c; /* Softer brown instead of black */
      font-family: 'Montserrat', sans-serif;
      overflow-x: hidden;
      line-height: 1.5;
    }

    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #fffdf0; }
    ::-webkit-scrollbar-thumb { 
      background: linear-gradient(180deg, #d4af37, #c89b2a);
      border-radius: 10px;
      border: 2px solid #fffdf0;
    }
    ::-webkit-scrollbar-thumb:hover { background: #b8860b; }

    .luxury-sidebar {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border: 1px solid rgba(212, 175, 55, 0.15);
      border-radius: 30px;
      box-shadow: 0 15px 45px rgba(0,0,0,0.03);
    }

    h1, h2, h3, .brand-name {
      font-family: 'Cinzel', serif;
      color: #3e2f1d; /* Softer dark brown instead of black */
    }

    /* Restored Luxury Headings */
    h1 { font-size: clamp(2rem, 8vw, 3.5rem); }
    h2 { font-size: clamp(1.8rem, 6vw, 2.8rem); }
    h3 { font-size: clamp(1.4rem, 4vw, 1.8rem); }
    
    .hero-heading {
      font-family: 'Playfair Display', serif;
      font-style: italic;
    }

    @keyframes revealText {
      from { transform: translateY(100px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .reveal-anim {
      animation: revealText 1.2s cubic-bezier(0.2, 1, 0.3, 1) forwards;
      opacity: 0;
    }

    @keyframes rotateShiny {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .fancy-scroll {
      scrollbar-width: thin;
      scrollbar-color: #d4af37 #fffdf0;
    }

    .gold-gradient-text {
      background: linear-gradient(90deg, #b8860b, #d4af37, #fde08d, #b8860b);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shine 4s linear infinite;
    }

    @keyframes shine {
      to { background-position: 200% center; }
    }

    .btn-gold {
      background: #1a130d;
      color: #fffdf0;
      border: none;
      padding: 12px 35px;
      border-radius: 8px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
      z-index: 1;
    }

    .btn-gold::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: 0.5s;
      z-index: -1;
    }

    .btn-gold:hover::before {
      left: 100%;
    }

    .btn-gold:hover {
      background: #d4af37;
      transform: translateY(-2px);
      box-shadow: 0 8px 15px rgba(212, 175, 55, 0.2);
    }

    section {
      padding: 80px 8%;
    }

    @media (max-width: 768px) {
      section {
        padding: 60px 5%;
      }
    }

    @media (max-width: 480px) {
      section {
        padding: 40px 4%;
      }
      h1 { font-size: clamp(1.8rem, 8vw, 2.5rem); }
      h2 { font-size: clamp(1.5rem, 6vw, 2rem); }
      h3 { font-size: clamp(1.2rem, 4vw, 1.5rem); }
      .glass-card { padding: 20px 15px !important; }
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 30px;
    }
    @media (max-width: 576px) {
      .product-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 15px 10px !important;
      }
      .product-grid .glass-card {
        border-radius: 12px !important;
      }
      .product-grid .glass-card > a > div:first-child {
        padding: 8px !important;
      }
      .product-grid .glass-card > a > div:first-child > div {
        height: 120px !important;
        border-radius: 8px !important;
      }
      .product-grid .glass-card > a > div:nth-child(2) {
        padding: 0 10px 10px !important;
      }
      .product-grid .glass-card h3 {
        font-size: 0.8rem !important;
        margin-bottom: 4px !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .product-grid .glass-card p {
        font-size: 0.9rem !important;
      }
      .product-grid .glass-card button {
        width: 28px !important;
        height: 28px !important;
        font-size: 0.8rem !important;
      }
    }

    @keyframes floatGlow {
      from { transform: translateY(0) translateX(0); opacity: 0.4; }
      to { transform: translateY(-20px) translateX(15px); opacity: 0.8; }
    }
    @keyframes fallingPetals {
      0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
      10% { opacity: 0.5; }
      90% { opacity: 0.5; }
      100% { transform: translateY(110vh) translateX(60px) rotate(720deg); opacity: 0; }
    }
    @keyframes boxRotate {
      0% { transform: rotate(0deg); }
      25% { transform: rotate(0.8deg); }
      50% { transform: rotate(-0.8deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes leafColor {
      0%, 100% { filter: hue-rotate(0deg) drop-shadow(0 0 10px gold); }
      50% { filter: hue-rotate(180deg) drop-shadow(0 0 20px #d4af37); }
    }
    @keyframes imageFade {
      0% { opacity: 0; transform: scale(1.05); }
      10% { opacity: 1; transform: scale(1); }
      90% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(0.97); }
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(15px);
      border: 1px solid #8a6d3b;
      border-radius: 24px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      transition: all 0.4s ease;
    }

    .glass-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(138, 109, 59, 0.2);
      border: 2px solid #8a6d3b;
    }

    .shiny-border-card {
      position: relative;
      background: #1a130d;
      border-radius: 20px;
      padding: 3px;
      overflow: hidden;
      transition: all 0.4s ease;
      z-index: 1;
    }

    .shiny-border-card::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(
        transparent, 
        #d4af37, 
        transparent 30%
      );
      animation: rotateShiny 4s linear infinite;
      z-index: -1;
    }

    .shiny-border-card:hover {
      transform: scale(1.02) translateY(-5px);
      box-shadow: 0 20px 50px rgba(212, 175, 55, 0.3);
    }

    .shiny-border-card:hover::before {
      background: conic-gradient(
        transparent, 
        #f5e27a, 
        transparent 30%
      );
      animation: rotateShiny 2s linear infinite;
    }

    .card-content {
      background: #1a130d;
      border-radius: 17px;
      height: 100%;
      width: 100%;
      color: #fffdf0;
      transition: all 0.4s ease;
    }

    /* Light Theme Variant */
    .shiny-border-card.light {
      background: #fff;
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.1);
    }
    .shiny-border-card.light .card-content {
      background: #fff;
      color: #1a130d;
    }
    .shiny-border-card.light:hover {
      box-shadow: 0 15px 45px rgba(212, 175, 55, 0.2);
    }

    @media (max-width: 480px) {
      .btn-gold {
        padding: 10px 20px;
        font-size: 0.7rem;
      }
    }
  `}</style>
);

const FallingGold = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setParticles(Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 10 + Math.random() * 10,
      size: 8 + Math.random() * 15,
    })));
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-50px',
            fontSize: `${p.size}px`,
            color: '#d4af37',
            opacity: 0.4,
            animation: `fallingPetals ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {['✨', '🌸', '✺'][Math.floor(Math.random() * 3)]}
        </div>
      ))}
    </div>
  );
};

const CartSidebar = () => {
  const { cartItems, increaseQty, decreaseQty, removeFromCart, clearCart, totalCount, isCartOpen, setIsCartOpen } = useContext(CartContext);
  const total = cartItems.reduce((sum, item) => {
    const num = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    return sum + num * item.qty;
  }, 0);

  const handleCheckout = () => {
    const phoneNumber = "9016853590";
    let message = `Hello MD FLOWERS, I would like to place an order:\n\n`;
    cartItems.forEach((item, index) => {
      let itemName = item.name;
      if (item.selectedColor && item.selectedColor !== 'Default') {
        itemName += ` [Color: ${item.selectedColor}]`;
      }
      message += `${index + 1}. ${itemName} - ${item.price} (Qty: ${item.qty})\n`;
      message += `   Image: https://mdflowers.in${item.image}\n`;
    });
    message += `\n*Total Amount: ₹${total.toFixed(2)}*\n\nPlease process my order.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/91${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 1998,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}
      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: isCartOpen ? 0 : '-100%',
        width: 'min(400px, 100%)',
        height: '100vh',
        background: '#fffdf0',
        zIndex: 1999,
        boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
        transition: 'right 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '2px solid rgba(212,175,55,0.2)',
      }}>
        {/* Header */}
        <div style={{
          padding: '25px 28px',
          borderBottom: '1px solid rgba(212,175,55,0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fff',
        }}>
          <h3 style={{ color: '#1a130d', fontFamily: 'Cinzel', fontSize: '1.2rem', margin: 0 }}>
            🛒 My Cart {totalCount > 0 && `(${totalCount})`}
          </h3>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'none', border: 'none', color: '#1a130d', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
          >✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#bbb' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🛒</div>
              <p style={{ fontSize: '1rem', color: '#9c7c2d' }}>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: '1px solid rgba(212,175,55,0.12)',
              }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '70px',
                    height: '70px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '2px solid rgba(212,175,55,0.3)',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1a130d', marginBottom: '3px' }}>
                    {item.name}
                    {item.selectedColor && item.selectedColor !== 'Default' && <span style={{ fontSize: '0.75rem', color: '#888' }}> ({item.selectedColor})</span>}
                  </p>
                  <p style={{ color: '#d4af37', fontWeight: '800', fontSize: '0.9rem' }}>{item.price}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                    <button
                      onClick={() => decreaseQty(item.cartId)}
                      style={{ background: '#d4af37', color: '#fff', border: 'none', borderRadius: '5px', width: '25px', height: '25px', cursor: 'pointer' }}
                    >-</button>
                    <span style={{ fontWeight: 'bold' }}>{item.qty}</span>
                    <button
                      onClick={() => increaseQty(item.cartId)}
                      style={{ background: '#d4af37', color: '#fff', border: 'none', borderRadius: '5px', width: '25px', height: '25px', cursor: 'pointer' }}
                    >+</button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.cartId)}
                  style={{
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: '8px',
                    color: '#b8860b',
                    cursor: 'pointer',
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                  }}
                >Remove</button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '20px 28px',
            borderTop: '1px solid rgba(212,175,55,0.2)',
            background: 'rgba(212,175,55,0.04)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontWeight: '700', color: '#1a130d', fontSize: '1rem' }}>Total:</span>
              <span style={{ fontWeight: '900', color: '#d4af37', fontSize: '1.2rem' }}>₹{total.toFixed(2)}</span>
            </div>
            <button
              className="btn-gold"
              style={{ width: '100%', marginBottom: '10px', padding: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              onClick={handleCheckout}
            >
              <span>🛒</span> Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid rgba(212,175,55,0.4)',
                borderRadius: '8px',
                padding: '10px',
                cursor: 'pointer',
                color: '#9c7c2d',
                fontSize: '0.75rem',
                fontWeight: '600',
                letterSpacing: '1px',
              }}
            >Clear Cart</button>
          </div>
        )}
      </div>
    </>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { totalCount, setIsCartOpen } = useContext(CartContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false); // Close menu on route change
  }, [location.pathname]);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      padding: scrolled ? '10px 8%' : '20px 8%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      transition: 'all 0.4s ease',
      backgroundColor: (scrolled || menuOpen) ? 'rgba(255, 253, 240, 0.98)' : 'transparent',
      backdropFilter: (scrolled || menuOpen) ? 'blur(8px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(212, 175, 55, 0.1)' : 'none',
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', zIndex: 1001 }}>
        <img src="/logo.png" alt="Logo" style={{ height: 'clamp(40px, 6vw, 60px)', width: 'auto', transition: '0.4s' }} />
        <div className="brand-name" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', letterSpacing: '2px' }}>
          <span className="gold-gradient-text">MD FLOWERS</span>
        </div>
      </Link>

      {/* Desktop Menu */}
      <div className="desktop-menu" style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        {[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
          { name: 'Collection', path: '/collection' },
          { name: 'Reviews', path: '/reviews' },
          { name: 'Contact', path: '/contact' }
        ].map((item, i) => (
          <Link key={item.name} to={item.path} style={{
            textDecoration: 'none',
            color: location.pathname === item.path ? '#d4af37' : '#1a130d',
            fontWeight: '700',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            transition: 'all 0.4s',
            opacity: 0,
            animation: `revealText 0.8s forwards ${0.3 + i * 0.1}s`
          }}
            onMouseEnter={(e) => e.target.style.color = '#d4af37'}
            onMouseLeave={(e) => e.target.style.color = location.pathname === item.path ? '#d4af37' : '#1a130d'}
          >
            {item.name}
          </Link>
        ))}
        {/* Cart Button (Desktop) */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="btn-gold"
          style={{
            padding: '8px 18px',
            fontSize: '0.6rem',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            position: 'relative',
          }}
        >
          <span style={{ fontSize: '0.9rem' }}>🛒</span>
          Cart
          {totalCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#d4af37',
              color: '#1a130d',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.6rem',
              fontWeight: '900',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>{totalCount}</span>
          )}
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <div style={{ display: 'none' }} className="mobile-toggle-container">
        <button
          onClick={() => setIsCartOpen(true)}
          style={{ background: 'none', border: 'none', position: 'relative', cursor: 'pointer', marginRight: '15px' }}
        >
          <span style={{ fontSize: '1.4rem' }}>🛒</span>
          {totalCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: '#d4af37',
              color: '#1a130d',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.6rem',
              fontWeight: '900',
            }}>{totalCount}</span>
          )}
        </button>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#1a130d' }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: '#fffdf0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '30px',
          zIndex: 1000,
          animation: 'revealText 0.4s ease'
        }}>
          {[
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
            { name: 'Collection', path: '/collection' },
            { name: 'Reviews', path: '/reviews' },
            { name: 'Contact', path: '/contact' }
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: location.pathname === item.path ? '#d4af37' : '#1a130d',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                fontFamily: 'Cinzel',
                textTransform: 'uppercase',
                letterSpacing: '3px'
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 992px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle-container { display: flex !important; align-items: center; z-index: 1001; }
          nav { padding: 15px 5% !important; }
        }
      `}</style>
    </nav>
  );
};

const Footer = () => (
  <footer style={{
    padding: '60px 8% 30px',
    backgroundColor: '#fffdf0',
    color: '#1a130d',
    borderTop: '2px solid #8a6d3b',
    position: 'relative'
  }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '50px' }}>
      <div style={{ gridColumn: 'span 1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <img src="/logo.png" alt="MD FLOWER" style={{ height: 'clamp(55px, 8vw, 75px)', width: 'auto' }} />
          <h2 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', fontFamily: 'Cinzel', margin: 0 }}>
            <span className="gold-gradient-text">MD FLOWER</span>
          </h2>
        </div>
        <p style={{ color: '#5c4b22', fontSize: '0.85rem', marginBottom: '15px', lineHeight: '1.6' }}>
          Bringing eternal beauty to your spaces with India's finest artificial floral collections.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
          <p style={{ color: '#1a130d' }}><strong>📍 Office:</strong> 4455/SF/1, Niraj House, Ahmedabad</p>
          <p style={{ color: '#1a130d' }}><strong>📞 WhatsApp:</strong> +91 90168 53590</p>
          <p style={{ color: '#1a130d' }}><strong>✉️ Email:</strong> info@mdflowers.in</p>
        </div>
      </div>

      <div>
        <h4 style={{ color: '#1a130d', marginBottom: '20px', fontSize: '1.1rem', fontFamily: 'Cinzel', fontWeight: 'bold', borderBottom: '1px solid #d4af37', display: 'inline-block', paddingBottom: '5px' }}>Categories</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
          {['Loose Flower Heads', 'Leaves', 'Bunches', 'Hangings', 'Flower Sticks'].map(item => (
            <Link key={item} to="/collection" style={{ color: '#5c4b22', textDecoration: 'none', transition: '0.3s', fontSize: '0.9rem' }} onMouseEnter={(e) => e.target.style.color = '#d4af37'} onMouseLeave={(e) => e.target.style.color = '#5c4b22'}>{item}</Link>
          ))}
        </div>
      </div>

      <div>
        <h4 style={{ color: '#1a130d', marginBottom: '20px', fontSize: '1.1rem', fontFamily: 'Cinzel', fontWeight: 'bold', borderBottom: '1px solid #d4af37', display: 'inline-block', paddingBottom: '5px' }}>Quick Links</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
          {['About', 'Exibition', 'Contact', 'Privacy Policy', 'Terms'].map(item => (
            <Link key={item} to={item === 'About' ? '/about' : item === 'Contact' ? '/contact' : '#'} style={{ color: '#5c4b22', textDecoration: 'none', transition: '0.3s', fontSize: '0.9rem' }} onMouseEnter={(e) => e.target.style.color = '#d4af37'} onMouseLeave={(e) => e.target.style.color = '#5c4b22'}>{item}</Link>
          ))}
        </div>
      </div>

      <div>
        <h4 style={{ color: '#1a130d', marginBottom: '20px', fontSize: '1.1rem', fontFamily: 'Cinzel', fontWeight: 'bold', borderBottom: '1px solid #d4af37', display: 'inline-block', paddingBottom: '5px' }}>Newsletter</h4>
        <p style={{ color: '#5c4b22', fontSize: '0.85rem', marginBottom: '15px', marginTop: '15px' }}>Subscribe for luxury collection updates.</p>
        <div style={{ display: 'flex', gap: '5px' }}>
          <input type="email" placeholder="Email" style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #d4af37', background: 'transparent', flex: 1, fontSize: '0.8rem' }} />
          <button style={{ background: '#1a130d', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}>Join</button>
        </div>
      </div>
    </div>

    <div style={{ borderTop: '1px solid rgba(138, 109, 59, 0.2)', paddingTop: '30px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '15px' }}>
        {['Instagram', 'Facebook', 'WhatsApp', 'YouTube'].map(s => <a key={s} href="#" style={{ color: '#8a6d3b', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>{s}</a>)}
      </div>
      <p style={{ fontSize: '0.75rem', color: '#5c4b22' }}>&copy; 2026 MD Flowers Boutique. All Rights Reserved. Crafted with Luxury.</p>
    </div>
  </footer>
);

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <CartProvider>
      <DataProvider>
        <div style={{ position: 'relative', background: isAdminRoute ? '#ffffff' : '#fffdf0', minHeight: '100vh' }}>
          <GlobalStyles />
          {!isAdminRoute && <FallingGold />}
          {!isAdminRoute && <Navbar />}
          {!isAdminRoute && <CartSidebar />}
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/top-selling" element={<TopSellingArticles />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/varieties" element={<Varieties />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          
          {!isAdminRoute && <Footer />}
        </div>
      </DataProvider>
    </CartProvider>
  );
};

export default App;
