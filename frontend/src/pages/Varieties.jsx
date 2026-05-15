import React, { useState, useMemo } from 'react';
import { DataContext } from '../DataContext';

const Varieties = () => {
  const [activeTab, setActiveTab] = useState({
    main: 'Loose Flower Heads',
    sub: 'Premium Flower Heads'
  });

  const { products, categories, loading } = React.useContext(DataContext);

  const categoryTree = categories.map(c => ({
    name: c.name,
    subs: c.subs ? c.subs.map(s => s.name || s) : []
  }));

  // Mocking 4 images per specific sub-category for the demo as requested
  const filteredVarieties = useMemo(() => {
    const allProducts = products;
    let items = allProducts.filter(p => 
      p.category === activeTab.main && p.sub === activeTab.sub
    );
    
    if (items.length === 0) {
      items = allProducts.filter(p => p.category === activeTab.main);
    }
    if (items.length === 0) {
      items = allProducts.slice(0, 4); 
    }

    while (items.length > 0 && items.length < 4) {
      items = [...items, ...items];
    }
    
    return items.slice(0, 12); 
  }, [activeTab]);

  if (loading) return <div style={{ padding: '150px', textAlign: 'center' }}>Loading varieties...</div>;

  return (
    <div style={{ 
      padding: '120px 5% 50px', 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #fffdf0, #f8f4e1)',
      fontFamily: 'Montserrat, sans-serif'
    }}>
      
      {/* Page Title */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 className="reveal-anim" style={{ 
          fontSize: '3.5rem', 
          fontFamily: 'Cinzel, serif', 
          color: '#1a130d', 
          letterSpacing: '12px',
          textTransform: 'uppercase',
          margin: 0
        }}>Luxury <span className="gold-gradient-text">Varieties</span></h1>
        <p style={{ letterSpacing: '5px', fontSize: '0.8rem', color: '#8b6914', marginTop: '10px', fontWeight: 'bold' }}>CURATED FOR THE EXTRAORDINARY</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '300px 300px 1fr', 
        gap: '40px',
        alignItems: 'start'
      }}>
        
        {/* Sidebar 1: Main Category - Luxury Glassmorphism */}
        <div className="luxury-sidebar" style={{ 
          padding: '40px 30px',
          maxHeight: '80vh',
          overflowY: 'auto',
          position: 'sticky',
          top: '120px'
        }}>
          <h3 style={{ fontSize: '0.8rem', letterSpacing: '4px', color: '#d4af37', marginBottom: '30px', textAlign: 'center', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '10px' }}>CATEGORIES</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categoryTree.map((cat, i) => (
              <div 
                key={i}
                onClick={() => setActiveTab({ main: cat.name, sub: cat.subs[0] || 'N/A' })}
                style={{
                  padding: '18px 25px',
                  borderRadius: '15px',
                  fontSize: '0.9rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  background: activeTab.main === cat.name ? '#1a130d' : 'rgba(255,255,255,0.4)',
                  color: activeTab.main === cat.name ? '#fff' : '#1a130d',
                  transform: activeTab.main === cat.name ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: activeTab.main === cat.name ? '0 10px 25px rgba(0,0,0,0.15)' : 'none',
                  border: activeTab.main === cat.name ? '1px solid #d4af37' : '1px solid rgba(212,175,55,0.1)'
                }}
                onMouseEnter={e => { if(activeTab.main !== cat.name) e.currentTarget.style.background = 'rgba(212,175,55,0.15)'; }}
                onMouseLeave={e => { if(activeTab.main !== cat.name) e.currentTarget.style.background = 'rgba(255,255,255,0.4)'; }}
              >
                {cat.name}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar 2: Sub Category - Minimalist Floating */}
        <div className="luxury-sidebar" style={{ 
          padding: '40px 30px',
          maxHeight: '70vh',
          overflowY: 'auto',
          position: 'sticky',
          top: '150px'
        }}>
          <h3 style={{ fontSize: '0.8rem', letterSpacing: '4px', color: '#d4af37', marginBottom: '30px', textAlign: 'center', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '10px' }}>SUB-TIER</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {(categoryTree.find(c => c.name === activeTab.main)?.subs || []).map((sub, i) => (
              <div 
                key={i}
                onClick={() => setActiveTab({ ...activeTab, sub: sub })}
                style={{
                  padding: '15px 20px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: '0.3s',
                  background: activeTab.sub === sub ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                  color: activeTab.sub === sub ? '#d4af37' : '#5c4b22',
                  borderLeft: activeTab.sub === sub ? '4px solid #d4af37' : '4px solid transparent',
                  paddingLeft: activeTab.sub === sub ? '25px' : '20px'
                }}
              >
                {sub}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area: Products (Varieties) */}
        <div style={{ padding: '0 30px', animation: 'revealText 1s ease' }}>
          <div style={{ marginBottom: '50px', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '20px', textAlign: 'right' }}>
            <h2 style={{ fontSize: '2.5rem', fontFamily: 'Cinzel', color: '#1a130d', margin: 0, textTransform: 'uppercase' }}>{activeTab.sub}</h2>
            <p style={{ fontSize: '0.9rem', color: '#8b6914', marginTop: '8px', letterSpacing: '2px' }}>PREMIUM CHOICE • {activeTab.main.toUpperCase()}</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '40px' 
          }}>
            {filteredVarieties.map((v, idx) => (
              <div 
                key={idx}
                className="variety-card glass-card"
                style={{
                  borderRadius: '25px',
                  overflow: 'hidden',
                  transition: 'all 0.5s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div style={{ height: '320px', overflow: 'hidden', position: 'relative' }}>
                  <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.8s' }} className="vari-img" />
                  <div style={{ 
                    position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,19,13,0.8) 0%, transparent 40%)',
                    display: 'flex', alignItems: 'flex-end', padding: '25px', opacity: 1
                  }}>
                    <div style={{ width: '100%' }}>
                       <span style={{ color: '#d4af37', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px' }}>LUXE ITEM</span>
                       <h4 style={{ color: '#fff', fontSize: '1.2rem', margin: '5px 0 0', fontFamily: 'Cinzel' }}>{v.name}</h4>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                  <span style={{ fontSize: '1.1rem', color: '#1a130d', fontWeight: '900' }}>{v.price}</span>
                  <button style={{ background: '#d4af37', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold' }}>VIEW</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .variety-card:hover .vari-img { transform: scale(1.15); }
        .variety-card:hover { transform: translateY(-15px); box-shadow: 0 30px 60px rgba(212, 175, 55, 0.25) !important; }
        
        /* Custom Scrollbar for sidebars */
        .luxury-sidebar::-webkit-scrollbar { width: 5px; }
        .luxury-sidebar::-webkit-scrollbar-track { background: transparent; }
        .luxury-sidebar::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.3); border-radius: 10px; }
        .luxury-sidebar::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.6); }
      `}</style>
    </div>
  );
};

export default Varieties;
