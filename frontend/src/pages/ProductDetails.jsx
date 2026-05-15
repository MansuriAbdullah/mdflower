import React, { useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataContext } from '../DataContext';
import { CartContext } from '../CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const { products, loading } = useContext(DataContext);

  const product = useMemo(() => {
    return products.find(p => p._id === id || p.id === id); // _id for mongo, id for local/old data
  }, [id, products]);

  if (loading) return <div style={{ padding: '150px 8%', textAlign: 'center' }}><h2>Loading product...</h2></div>;

  if (!product) {
    return (
      <div style={{ padding: '150px 8%', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/collection')} className="btn-gold" style={{ marginTop: '20px' }}>Back to Collection</button>
      </div>
    );
  }

  return (
    <div className="product-details-container" style={{ padding: 'clamp(100px, 15vw, 150px) 8% 100px', minHeight: '100vh', background: '#fffdf0' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          background: 'none', border: 'none', color: '#1a130d', cursor: 'pointer', 
          fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px' 
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>←</span> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(30px, 5vw, 60px)' }}>
        {/* Product Image */}
        <div style={{ position: 'relative' }}>
          <div className="glass-card" style={{ padding: 'clamp(10px, 3vw, 20px)', borderRadius: '30px' }}>
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ width: '100%', height: 'auto', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} 
            />
          </div>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: 'clamp(2rem, 5vw, 4rem)', opacity: 0.2 }}>🌸</div>
        </div>

        {/* Product Info */}
        <div className="product-info-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ color: '#d4af37', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: '900', marginBottom: '10px', fontSize: '0.75rem' }}>
            {product.variety || product.sub || product.category}
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', marginBottom: '15px', lineHeight: '1.1' }}>{product.name}</h1>
          <p className="price" style={{ color: '#d4af37', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '800', marginBottom: '25px' }}>{product.price}</p>
          
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '25px', marginBottom: '35px' }}>
            <h4 style={{ textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', color: '#1a130d', fontSize: '0.85rem' }}>Details & Description</h4>
            <p style={{ fontSize: '1rem', color: '#444', lineHeight: '1.7', maxWidth: '600px' }}>
              {product.description || "Our premium boutique collection features hand-picked items crafted with the highest attention to detail. This piece represents the pinnacle of luxury floral design."}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
             <button 
               className="btn-gold" 
               style={{ padding: '15px 40px', fontSize: '0.9rem' }}
               onClick={() => {
                 addToCart(product);
               }}
             >
               Add to Cart 🛒
             </button>
             {product.color && (
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <div style={{ 
                   width: '24px', height: '24px', borderRadius: '50%', 
                   background: product.color.toLowerCase() === 'gold' ? '#d4af37' : product.color.toLowerCase(),
                   border: '2px solid #fff', boxShadow: '0 0 8px rgba(0,0,0,0.1)'
                 }}></div>
                 <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{product.color}</span>
               </div>
             )}
          </div>

          <div className="feature-icons" style={{ marginTop: '40px', display: 'flex', gap: '20px', opacity: 0.7 }}>
             {[
               { icon: '🚚', label: 'Fast Delivery' },
               { icon: '✨', label: 'Premium Quality' },
               { icon: '🛡️', label: 'Secure Payment' }
             ].map((item, idx) => (
               <div key={idx} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '1.4rem', margin: '0 0 5px' }}>{item.icon}</p>
                  <p style={{ fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.label}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
           .product-details-container {
             padding: 80px 5% 60px !important;
           }
           .product-info-text h1 {
             font-size: 2rem !important;
           }
           .product-info-text p.price {
             font-size: 1.5rem !important;
             margin-bottom: 15px !important;
           }
           .product-info-text button {
             width: 100%;
             margin-bottom: 10px;
           }
           .product-info-text .feature-icons {
             flex-wrap: wrap;
             gap: 15px !important;
             justify-content: center;
             margin-top: 20px !important;
           }
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;
