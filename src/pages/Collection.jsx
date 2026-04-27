import React, { useState, useMemo, useEffect, useContext } from 'react';
import { productsData } from '../data/products';
import { CartContext } from '../CartContext';

const categoryStructure = [
  { 
    name: 'Loose Flower Heads', 
    subs: [
      { 
        name: 'Premium Flower Heads', 
        varieties: ['Orchids', 'Tulips', 'Liliyums', 'Roses', 'Daisies', 'Cherry Blossoms', 'Peonies', 'Hydrangeas']
      },
      { name: 'Regular Flower Heads', varieties: [] }
    ] 
  },
  { 
    name: 'Leaves', 
    subs: [{ name: 'Artificial Leaves', varieties: [] }, { name: 'Tropical Leaves', varieties: [] }] 
  },
  { 
    name: 'Bunches', 
    subs: [{ name: 'Flower Bunches', varieties: [] }, { name: 'Green Bunches', varieties: [] }, { name: 'Lavender Bunches', varieties: [] }] 
  },
  { 
    name: 'Hangings', 
    subs: [{ name: 'Flower Hangings', varieties: [] }, { name: 'Wisteria Hangings', varieties: [] }] 
  },
  { 
    name: 'Chandeliers', 
    subs: [{ name: 'Crystal Chandeliers', varieties: [] }, { name: 'Glass Chandeliers', varieties: [] }] 
  },
  { 
    name: 'LED Item', 
    subs: [{ name: 'LED Stands', varieties: [] }, { name: 'Glow Frames', varieties: [] }] 
  },
  { 
    name: 'Flower Walls', 
    subs: [{ name: 'Rose Walls', varieties: [] }, { name: 'Flower Mats', varieties: [] }] 
  },
];

const Collection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState({
    main: 'All',
    sub: 'All',
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentColor, setCurrentColor] = useState('Default');
  const { addToCart } = useContext(CartContext);

  const colors = [
    { name: 'Blue', image: '/rose_blue.png', code: '#0000FF' },
    { name: 'White', image: '/rose_white.png', code: '#FFFFFF' },
    { name: 'Purple', image: '/rose_purple.png', code: '#800080' },
    { name: 'Pink', image: '/rose_pink.png', code: '#FFC0CB' },
    { name: 'Red', image: '/rose_red.png', code: '#FF0000' },
    { name: 'Gold', image: '/royal_gold_rose_luxe_1776258088166.png', code: '#D4AF37' },
    { name: 'Emerald', image: '/green_eucalyptus_bunch_luxe_1776317733519.png', code: '#50C878' }
  ];

  const filteredProducts = useMemo(() => {
    return productsData.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMain = activeFilter.main === 'All' || p.category === activeFilter.main;
      const matchesSub = activeFilter.sub === 'All' || p.sub === activeFilter.sub;
      return matchesSearch && matchesMain && matchesSub;
    });
  }, [activeFilter, searchQuery]);

  const openProduct = (product) => {
    setSelectedProduct(product);
    setCurrentColor('Default');
  };

  const closeProduct = () => {
    setSelectedProduct(null);
  };

  return (
    <div style={{ 
      padding: '100px 5% 50px', 
      minHeight: '100vh', 
      background: '#fffdf0',
      fontFamily: 'Montserrat, sans-serif'
    }}>
      
      {/* Modern Header - SHOP & ALL COLLECTIONS Side by Side */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginBottom: '40px',
        borderBottom: '2px solid rgba(26,19,13,0.1)',
        paddingBottom: '20px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 8vw, 3.5rem)', 
          fontFamily: 'Cinzel, serif', 
          color: '#1a130d', 
          letterSpacing: '5px',
          margin: 0,
        }}>LUXURY COLLECTION</h1>
        
        <h2 style={{ 
          fontSize: '0.9rem', 
          color: '#d4af37', 
          fontFamily: 'Montserrat', 
          letterSpacing: '4px', 
          margin: 0,
          fontWeight: '900'
        }}>ALL COLLECTIONS</h2>
      </div>

      {/* Fancy Search Bar & Explore Button */}
      <div style={{ maxWidth: '1000px', margin: '0 auto 40px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <input 
            type="text" 
            placeholder="Search our luxury collection..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '15px 25px',
              borderRadius: '50px',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              background: '#fff',
              fontSize: '0.9rem',
              outline: 'none',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.1)',
              color: '#1a130d'
            }}
          />
          <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: '#d4af37' }}>🔍</span>
        </div>
        
        <button 
          onClick={() => window.location.href = '/varieties'}
          style={{
            flex: '1 1 auto',
            whiteSpace: 'nowrap',
            padding: '15px 25px',
            borderRadius: '50px',
            background: 'linear-gradient(135deg, #d4af37 0%, #c89b2a 100%)',
            color: '#fff',
            border: 'none',
            fontWeight: '900',
            fontSize: '0.75rem',
            letterSpacing: '1px',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)',
            transition: '0.3s'
          }}
        >
          EXPLORE ALL VARIETIES
        </button>
      </div>

      <div className="collection-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px' }}>
        
        {/* Sidebar */}
        <aside className="sidebar" style={{ 
          height: 'fit-content', 
          position: 'sticky', 
          top: '120px',
          background: '#fff',
          padding: '25px',
          borderRadius: '25px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
          border: '1px solid rgba(212, 175, 55, 0.1)',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div 
              onClick={() => setActiveFilter({ main: 'All', sub: 'All' })}
              style={{ 
                  padding: '12px 15px', borderRadius: '12px', cursor: 'pointer',
                  background: activeFilter.main === 'All' ? 'linear-gradient(135deg, #1a130d 0%, #3a2a1e 100%)' : 'transparent',
                  color: activeFilter.main === 'All' ? '#fff' : '#1a130d',
                  fontWeight: '700', fontSize: '0.85rem', transition: '0.3s'
              }}
            >
              SHOP ALL
            </div>

            {categoryStructure.map((cat, i) => (
              <div key={i}>
                <div 
                  onClick={() => setActiveFilter({ 
                    main: activeFilter.main === cat.name ? 'All' : cat.name, 
                    sub: 'All' 
                  })}
                  style={{ 
                      padding: '12px 15px', borderRadius: '12px', cursor: 'pointer',
                      background: activeFilter.main === cat.name ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                      color: activeFilter.main === cat.name ? '#d4af37' : '#1a130d', 
                      fontWeight: '800', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between'
                  }}
                >
                  {cat.name}
                  <span style={{ transform: activeFilter.main === cat.name ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>▾</span>
                </div>

                {activeFilter.main === cat.name && (
                  <div style={{ padding: '8px 0 8px 20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                     {cat.subs.map((sub, si) => (
                        <div 
                          key={si}
                          onClick={() => setActiveFilter({ ...activeFilter, sub: sub.name })}
                          style={{ 
                            fontSize: '0.8rem', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px',
                            color: activeFilter.sub === sub.name ? '#d4af37' : '#666', 
                            fontWeight: activeFilter.sub === sub.name ? 'bold' : '500',
                            background: activeFilter.sub === sub.name ? '#fff' : 'transparent',
                            boxShadow: activeFilter.sub === sub.name ? '0 4px 10px rgba(0,0,0,0.05)' : 'none'
                          }}
                        >
                          {sub.name}
                        </div>
                     ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <main>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 30vw, 200px), 1fr))', 
            gap: 'clamp(15px, 2vw, 30px)' 
          }}>
            {filteredProducts.map((p, i) => (
              <div 
                key={i} 
                className="boutique-card"
                onClick={() => openProduct(p)}
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '10px',
                  border: '1px solid #8a6d3b',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ 
                  height: 'clamp(140px, 25vw, 200px)', 
                  borderRadius: '15px 15px 0 0', 
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.6s' }} className="card-img" />
                </div>
                <div style={{ padding: '15px 8px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '0.75rem', margin: '0 0 5px', color: '#1a130d', fontWeight: '800', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase' }}>{p.name}</h3>
                  <p style={{ fontSize: '0.9rem', margin: 0, color: '#d4af37', fontWeight: '900' }}>{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(0px, 2vw, 20px)'
        }} onClick={closeProduct}>
          <div className="modal-content" style={{
            background: '#fff', maxWidth: '1100px', width: '100%', maxHeight: '95vh', borderRadius: '30px',
            overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            
            <button 
              onClick={closeProduct}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.05)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', zIndex: 10 }}
            >×</button>

            {/* Image Section */}
            <div style={{ background: '#fcfaf0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
               <img 
                 src={currentColor === 'Default' ? selectedProduct.image : colors.find(c => c.name === currentColor).image} 
                 alt={selectedProduct.name} 
                 style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '20px' }}
               />
            </div>

            {/* Info Section */}
            <div style={{ padding: 'clamp(30px, 5vw, 60px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ color: '#d4af37', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px', marginBottom: '10px' }}>PREMIUM CHOICE</span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontFamily: 'Cinzel', marginBottom: '10px', color: '#1a130d' }}>{selectedProduct.name}</h2>
              <p style={{ fontSize: '1.5rem', color: '#d4af37', fontWeight: 'bold', marginBottom: '20px' }}>{selectedProduct.price}</p>
              
              <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '30px', fontSize: '0.9rem' }}>
                {selectedProduct.description || "Our exquisite floral collection brings nature's finest beauty to your space with unmatched luxury."}
              </p>

              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '15px' }}>Color Variation:</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                   {colors.map((c, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setCurrentColor(c.name)}
                        style={{ 
                          width: '45px', height: '45px', borderRadius: '10px', cursor: 'pointer',
                          border: currentColor === c.name ? '3px solid #d4af37' : '1px solid rgba(0,0,0,0.1)',
                          overflow: 'hidden', padding: '2px', transition: '0.2s'
                        }}
                      >
                         <div style={{ width: '100%', height: '100%', borderRadius: '6px', background: c.code, backgroundImage: `url(${c.image})`, backgroundSize: 'cover' }}></div>
                      </div>
                   ))}
                </div>
              </div>

              <button 
                onClick={() => { addToCart({...selectedProduct}); closeProduct(); }}
                style={{ width: '100%', background: '#1a130d', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >ADD TO CART</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .boutique-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(212, 175, 55, 0.1); }
        
        @media (max-width: 992px) {
          .collection-layout { grid-template-columns: 1fr !important; gap: 30px !important; }
          .sidebar { 
            position: relative !important; 
            top: 0 !important; 
            display: flex !important; 
            overflow-x: auto !important; 
            padding: 10px !important; 
            border-radius: 15px !important;
            scrollbar-width: none;
          }
          .sidebar > div { flex-direction: row !important; white-space: nowrap !important; }
          .sidebar::-webkit-scrollbar { display: none; }
          .sidebar > div > div { display: inline-block !important; margin-right: 10px; }
        }
      `}</style>
    </div>
  );
};

export default Collection;
