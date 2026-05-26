import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../CartContext';

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const hostname = window.location.hostname;
  const isLocal = hostname === 'localhost' || 
                  hostname === '127.0.0.1' || 
                  hostname.startsWith('192.168.') || 
                  hostname.startsWith('10.') || 
                  hostname.startsWith('172.');
  return isLocal ? `http://${hostname}:5000` : 'https://mdflower-qvjl.vercel.app';
};
const API_URL = getApiUrl();

const resolveImageUrl = (img) => {
  if (!img) return '';
  if (img.startsWith('/') && !img.startsWith('/uploads')) return img;
  if (img.startsWith('http') || img.startsWith('data:')) return img;
  return `${API_URL}${img.startsWith('/') ? img : '/' + img}`;
};

const ProductCard = ({ id, name, price, image }) => {
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault(); // Prevent navigating if clicking the button
    addToCart({ id, name, price, image: resolveImageUrl(image) });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="glass-card" style={{
      overflow: 'hidden',
      border: '1px solid #8a6d3b',
      background: '#fff',
      animation: 'revealText 0.8s ease'
    }}>
      <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ padding: '15px' }}>
          <div style={{ 
            height: '180px', 
            overflow: 'hidden', 
            borderRadius: '15px', 
            position: 'relative' 
          }}>
            <img 
              src={resolveImageUrl(image)} 
              alt={name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.9)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: '900', color: '#1a130d', letterSpacing: '1px' }}>PREMIUM</div>
          </div>
        </div>

        <div style={{ padding: '0 20px 20px', textAlign: 'left' }}>
          <h3 style={{ 
            fontSize: '1rem', 
            color: '#1a130d', // Dark font
            fontWeight: '900', 
            marginBottom: '8px',
            fontFamily: 'Montserrat, sans-serif'
          }}>
            {name}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#000', fontWeight: '900', fontSize: '1.1rem' }}>{price}</p>
            <button
               onClick={handleAdd}
               style={{
                 background: added ? '#4CAF50' : '#1a130d',
                 color: '#fff',
                 border: 'none',
                 width: '35px',
                 height: '35px',
                 borderRadius: '50%',
                 cursor: 'pointer',
                 fontSize: '1rem',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 transition: '0.3s'
               }}
            >
              {added ? '✓' : '+'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
