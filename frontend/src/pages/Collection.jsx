import React, { useState, useMemo, useEffect, useContext } from 'react';
import { DataContext } from '../DataContext';
import { CartContext } from '../CartContext';

const colors = [
  { name: 'Blue', image: '/premium_orchid_blue_1777448990406.png', code: '#0000FF' },
  { name: 'White', image: '/premium_tulip_white_1777449008658.png', code: '#FFFFFF' },
  { name: 'Purple', image: '/lavender_bunch_1777449072375.png', code: '#800080' },
  { name: 'Pink', image: '/cherry_blossom_pink_1777449042427.png', code: '#FFC0CB' },
  { name: 'Red', image: '/red_rose_wall_1777449145657.png', code: '#FF0000' },
  { name: 'Gold', image: '/gold_rose_1777449057426.png', code: '#D4AF37' },
  { name: 'Emerald', image: '/eucalyptus_bunch_1777449087274.png', code: '#50C878' }
];

// --- COMPONENTS ---
const Collection = () => {
  const [activeMainCategory, setActiveMainCategory] = useState('SHOP ALL');
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Filter states
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortOption, setSortOption] = useState('Bestsellers');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [gridColumns, setGridColumns] = useState(4); // 2, 3, or 4
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentColor, setCurrentColor] = useState('Default');
  const { addToCart } = useContext(CartContext);
  const { products, categories, loading } = useContext(DataContext);

  const handleTypeChange = (type) => setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  const handlePriceChange = (price) => setSelectedPrices(prev => prev.includes(price) ? prev.filter(p => p !== price) : [...prev, price]);
  const handleColorChange = (color) => setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);

  // Handle outside click for filter dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showFilterDropdown && !e.target.closest('.filter-container')) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showFilterDropdown]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => {
      // Search logic
      let matchesSearch = true;
      if (searchQuery) {
        let normalizedQuery = searchQuery.toLowerCase();
        // Handle specific misspellings for Hydrangea
        if (normalizedQuery.includes('hydenga') || normalizedQuery.includes('hydenja')) {
          normalizedQuery = 'hydrangea';
        }
        
        const searchTarget = `${p.name || ''} ${p.variety || ''} ${p.sub || ''} ${p.category || ''} ${p.description || ''}`.toLowerCase();
        matchesSearch = searchTarget.includes(normalizedQuery);
      }

      let matchesMain = true;
      if (activeMainCategory !== 'SHOP ALL') {
        if (activeMainCategory === 'Candles & Showpieces') {
            matchesMain = p.category === 'Home Decor' || p.category === 'Candles';
        } else {
            matchesMain = p.category === activeMainCategory;
        }
      }
      
      const matchesSub = activeSubCategory === 'All' || p.sub === activeSubCategory;
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(p.sub) || selectedTypes.includes(p.variety);
      
      const matchesPrice = selectedPrices.length === 0 || selectedPrices.some(range => {
        const numPrice = parseFloat(p.price.replace(/[^0-9.]/g, ''));
        if (range === 'Under $50') return numPrice < 50;
        if (range === '$50 - $100') return numPrice >= 50 && numPrice <= 100;
        if (range === 'Over $100') return numPrice > 100;
        return false;
      });

      const matchesColor = selectedColors.length === 0 || selectedColors.includes(p.color);
      return matchesSearch && matchesMain && matchesSub && matchesType && matchesPrice && matchesColor;
    });

    if (sortOption === 'Price: Low to High') {
      filtered.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, '')));
    } else if (sortOption === 'Price: High to Low') {
      filtered.sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, '')));
    }
    return filtered;
  }, [searchQuery, activeMainCategory, activeSubCategory, selectedTypes, selectedPrices, selectedColors, sortOption, products]);

  const activeCategoryObj = categories.find(c => c.name === activeMainCategory) || { name: 'SHOP ALL', subs: [] };
  const typeOptions = activeCategoryObj.subs.map(s => s.name);
  const mainCategories = ['SHOP ALL', ...categories.map(c => c.name)];

  if (loading) {
    return <div style={{ padding: '150px', textAlign: 'center' }}>Loading products...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fffdf0', fontFamily: 'Montserrat, sans-serif' }}>
      
      <div className="collection-page-layout">
        
        {/* LEFT SIDEBAR */}
        <div className={`collection-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
          <h2 style={{ fontFamily: 'Cinzel', fontSize: '1.4rem', marginBottom: '30px', color: '#1a130d', letterSpacing: '2px', borderBottom: '1px solid rgba(212,175,55,0.3)', paddingBottom: '15px' }}>
            Varieties
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {mainCategories.map((cat) => {
              const isActive = activeMainCategory === cat;
              return (
                <div 
                  key={cat}
                  onClick={() => { setActiveMainCategory(cat); setActiveSubCategory('All'); setSelectedTypes([]); setIsSidebarOpen(false); }}
                  style={{
                    padding: '12px 15px',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? '800' : '600',
                    color: isActive ? '#fffdf0' : '#1a130d',
                    backgroundColor: isActive ? '#1a130d' : 'transparent',
                    borderLeft: isActive ? '4px solid #d4af37' : '4px solid transparent',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.1)'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {cat}
                </div>
              );
            })}
          </div>
        </div>

      <div className="collection-main-content">
        
        {/* MOBILE SIDEBAR TOGGLE BUTTON */}
        <div className="mobile-sidebar-toggle">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            style={{
              background: '#1a130d', color: '#d4af37', border: '1px solid #d4af37', padding: '10px 20px', 
              fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '5px'
            }}
          >
            ☰ VIEW VARIETIES
          </button>
        </div>
        
        {/* 2. CIRCULAR SUB-CATEGORIES */}
        <div className="sub-category-scroll" style={{ padding: '10px 0 10px', display: 'flex', justifyContent: 'center', gap: '30px' }}>
          {activeCategoryObj.subs.length > 0 ? activeCategoryObj.subs.map(sub => (
            <div 
              key={sub.name}
              onClick={() => setActiveSubCategory(sub.name === activeSubCategory ? 'All' : sub.name)}
              style={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', 
                cursor: 'pointer', opacity: activeSubCategory === 'All' || activeSubCategory === sub.name ? 1 : 0.4, 
                transition: '0.3s', width: '100px'
              }}
            >
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden',
                boxShadow: activeSubCategory === sub.name ? '0 5px 15px rgba(212,175,55,0.3)' : 'none',
                border: activeSubCategory === sub.name ? '2px solid #d4af37' : '1px solid rgba(0,0,0,0.1)',
                background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <img src={sub.img} alt={sub.name} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
              </div>
              <span style={{ color: '#1a130d', fontSize: '0.75rem', textAlign: 'center', lineHeight: '1.2', fontWeight: activeSubCategory === sub.name ? 'bold' : 'normal' }}>
                {sub.name}
              </span>
            </div>
          )) : (
            <div style={{ height: '0px' }} /> // Removed huge spacer to pull things up
          )}
        </div>

        {/* MAIN TITLE REMOVED HERE AS REQUESTED */}

        {/* 4. FILTER, SORT & GRID TOGGLE BAR */}
        <div className="filter-sort-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '20px' }}>
          
          <div style={{ display: 'flex', gap: '10px', position: 'relative', flexWrap: 'wrap' }} className="filter-container">
            {/* SEARCH INPUT */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Search (e.g. Hydrangea)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: '#fffdf0', border: '1px solid rgba(212, 175, 55, 0.5)', padding: '10px 35px 10px 15px', borderRadius: '5px',
                  color: '#1a130d', outline: 'none', width: '220px', fontSize: '0.85rem'
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#d4af37', fontSize: '1.2rem' }}>×</button>
              )}
            </div>

            {/* FILTER BUTTON */}
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              style={{
                background: '#1a130d', color: '#d4af37', border: '1px solid #d4af37', padding: '12px 25px', 
                fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '10px', transition: '0.3s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#d4af37'; e.currentTarget.style.color = '#1a130d'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#1a130d'; e.currentTarget.style.color = '#d4af37'; }}
            >
              FILTER <span>+</span>
            </button>
            
            {/* SORT BUTTON */}
            <div style={{ border: '1px solid rgba(212, 175, 55, 0.5)', display: 'flex', alignItems: 'center', padding: '0 15px', background: '#fffdf0' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1a130d', letterSpacing: '1px', marginRight: '10px' }}>SORT BY</span>
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
                style={{ background: 'transparent', border: 'none', fontSize: '0.8rem', color: '#1a130d', outline: 'none', cursor: 'pointer', appearance: 'none', paddingRight: '15px' }}
              >
                <option>Bestsellers</option>
                <option>New Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <span style={{ fontSize: '0.7rem', color: '#d4af37', pointerEvents: 'none', marginLeft: '-10px' }}>v</span>
            </div>

            {/* FILTER DROPDOWN */}
            {showFilterDropdown && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, marginTop: '10px', background: '#fffdf0', 
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '1px solid rgba(212, 175, 55, 0.4)', zIndex: 100, 
                width: '300px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px'
              }}>
                <div>
                  <h4 style={{ fontSize: '0.8rem', letterSpacing: '1px', color: '#d4af37', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '5px', marginBottom: '10px' }}>TYPE</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(typeOptions.length > 0 ? typeOptions : ['Premium', 'Regular']).map(opt => (
                      <label key={opt} style={{ fontSize: '0.85rem', color: '#1a130d', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" checked={selectedTypes.includes(opt)} onChange={() => handleTypeChange(opt)} style={{ accentColor: '#d4af37' }} /> {opt}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.8rem', letterSpacing: '1px', color: '#d4af37', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '5px', marginBottom: '10px' }}>PRICE</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['Under $50', '$50 - $100', 'Over $100'].map(opt => (
                      <label key={opt} style={{ fontSize: '0.85rem', color: '#1a130d', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" checked={selectedPrices.includes(opt)} onChange={() => handlePriceChange(opt)} style={{ accentColor: '#d4af37' }} /> {opt}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.8rem', letterSpacing: '1px', color: '#d4af37', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '5px', marginBottom: '10px' }}>COLOR</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {colors.map(c => (
                      <div 
                        key={c.name} onClick={() => handleColorChange(c.name)}
                        style={{
                          width: '24px', height: '24px', borderRadius: '50%', background: c.code, cursor: 'pointer',
                          border: selectedColors.includes(c.name) ? '2px solid #d4af37' : '1px solid #ddd',
                          boxShadow: selectedColors.includes(c.name) ? '0 0 0 2px #fffdf0 inset' : 'none'
                        }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* GRID TOGGLES */}
          <div className="grid-toggles" style={{ display: 'flex', gap: '15px', color: '#1a130d' }}>
            <div onClick={() => setGridColumns(2)} style={{ cursor: 'pointer', opacity: gridColumns === 2 ? 1 : 0.4, display: 'flex', alignItems: 'center', gap: '5px' }}>
               <span style={{ fontSize: '1.2rem', letterSpacing: '-2px' }}>||</span> <span style={{ fontSize: '0.7rem' }}>2</span>
            </div>
            <div onClick={() => setGridColumns(3)} style={{ cursor: 'pointer', opacity: gridColumns === 3 ? 1 : 0.4, display: 'flex', alignItems: 'center', gap: '5px' }}>
               <span style={{ fontSize: '1.2rem', letterSpacing: '-2px' }}>|||</span> <span style={{ fontSize: '0.7rem' }}>3</span>
            </div>
            <div onClick={() => setGridColumns(4)} style={{ cursor: 'pointer', opacity: gridColumns === 4 ? 1 : 0.4, display: 'flex', alignItems: 'center', gap: '5px' }}>
               <span style={{ fontSize: '1.2rem', letterSpacing: '-2px' }}>||||</span> <span style={{ fontSize: '0.7rem' }}>4</span>
            </div>
          </div>

        </div>

        {/* 5. PRODUCT COUNT */}
        <p style={{ color: '#d4af37', fontSize: '0.85rem', marginBottom: '30px', fontWeight: 'bold' }}>{filteredProducts.length} products</p>

        {/* 6. FULL WIDTH PRODUCT GRID */}
        <div className="product-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`, 
          gap: '30px' 
        }}>
          {filteredProducts.map((p, i) => (
            <div 
              key={i} 
              onClick={() => { setSelectedProduct(p); setCurrentColor('Default'); }}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative' }}
              className="product-card"
            >
              <div style={{ position: 'absolute', top: '15px', left: '15px', background: '#1a130d', padding: '5px 10px', fontSize: '0.7rem', fontWeight: 'bold', color: '#d4af37', zIndex: 2 }}>
                Luxe
              </div>
              
              <div style={{ height: gridColumns === 2 ? '500px' : gridColumns === 3 ? '400px' : '300px', overflow: 'hidden', background: '#fff' }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="product-img" />
              </div>
              <div style={{ padding: '15px 0', textAlign: 'center' }}>
                <h3 style={{ fontSize: '0.9rem', margin: '0 0 5px', color: '#1a130d', fontWeight: '600', textTransform: 'uppercase' }}>{p.name}</h3>
                <p style={{ fontSize: '1.1rem', margin: 0, color: '#d4af37', fontWeight: 'bold' }}>{p.price}</p>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
           <div style={{ textAlign: 'center', padding: '100px 0', color: '#d4af37', fontSize: '1.2rem', fontWeight: 'bold' }}>
             No products found for the selected filters.
           </div>
        )}
      </div> {/* Close collection-main-content */}
      </div> {/* Close collection-page-layout */}

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (() => {
        // Find available colors by grouping by variety (with typo handling) or fallback to name
        const relatedProducts = products.filter(p => {
            if (p.variety && selectedProduct.variety) {
                let v1 = p.variety.toLowerCase().trim();
                let v2 = selectedProduct.variety.toLowerCase().trim();
                if (v1 === 'hydenga' || v1 === 'hydenja') v1 = 'hydrangea';
                if (v2 === 'hydenga' || v2 === 'hydenja') v2 = 'hydrangea';
                return v1 === v2;
            }
            return p.name === selectedProduct.name;
        });
        const uniqueColorNames = [...new Set(relatedProducts.map(p => p.color).filter(Boolean))];
        let productColors = uniqueColorNames.map(colorName => {
           const existing = colors.find(c => c.name === colorName);
           if (existing) return existing;
           const prodWithColor = relatedProducts.find(p => p.color === colorName);
           return { name: colorName, code: '#ccc', image: prodWithColor?.image || selectedProduct.image };
        });

        if (productColors.length === 0 && selectedProduct.color) {
            productColors = [{ name: selectedProduct.color, code: '#ccc', image: selectedProduct.image }];
        }

        return (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(26,19,13,0.8)', backdropFilter: 'blur(5px)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={() => setSelectedProduct(null)}>
          <div className="modal-content-wrapper" style={{
            background: '#fffdf0', maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', position: 'relative',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(212, 175, 55, 0.3)'
          }} onClick={e => e.stopPropagation()}>
            
            <button 
              onClick={() => setSelectedProduct(null)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: '#fffdf0', border: '1px solid rgba(212,175,55,0.5)', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.8rem', cursor: 'pointer', zIndex: 10, color: '#1a130d', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
            >×</button>

            <div className="modal-img-container" style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', borderRight: '1px solid rgba(212,175,55,0.2)' }}>
               <img 
                 src={currentColor === 'Default' ? selectedProduct.image : productColors.find(c => c.name === currentColor)?.image || selectedProduct.image} 
                 alt={selectedProduct.name} 
                 style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
               />
            </div>

            <div style={{ padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#d4af37', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>{selectedProduct.category}</span>
                  {selectedProduct.sub && <span style={{ color: '#8a6d3b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>• {selectedProduct.sub}</span>}
                  {selectedProduct.variety && <span style={{ color: '#8a6d3b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>• {selectedProduct.variety}</span>}
                </div>
                <h2 style={{ fontSize: '2rem', fontFamily: 'Cinzel, serif', marginTop: '5px', marginBottom: '15px', color: '#1a130d' }}>{selectedProduct.name}</h2>
                <p style={{ fontSize: '1.5rem', color: '#d4af37', fontWeight: 'bold', marginBottom: '25px' }}>{selectedProduct.price}</p>
                
                <p style={{ color: '#1a130d', lineHeight: '1.6', marginBottom: '40px', fontSize: '0.95rem' }}>
                  {selectedProduct.description || "Our exquisite floral collection brings nature's finest beauty to your space with unmatched luxury."}
                </p>

                {productColors.length > 0 && (
                  <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#1a130d', marginBottom: '15px' }}>AVAILABLE COLORS</h4>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                       {productColors.map((c, idx) => {
                          const isActive = (currentColor === 'Default' && selectedProduct.color === c.name) || currentColor === c.name;
                          return (
                            <div 
                              key={idx} 
                              onClick={() => {
                                  const matchingProd = relatedProducts.find(p => p.color === c.name);
                                  if (matchingProd) {
                                      setSelectedProduct(matchingProd);
                                      setCurrentColor('Default');
                                  } else {
                                      setCurrentColor(c.name);
                                  }
                              }}
                              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                            >
                              <div style={{ 
                                width: '40px', height: '40px', borderRadius: '50%',
                                border: isActive ? '2px solid #d4af37' : '1px solid rgba(0,0,0,0.1)',
                                padding: '3px', transition: '0.2s'
                              }}>
                                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: c.code, backgroundImage: `url(${c.image})`, backgroundSize: 'cover' }}></div>
                              </div>
                              <span style={{ fontSize: '0.7rem', color: '#1a130d', fontWeight: isActive ? 'bold' : 'normal' }}>{c.name}</span>
                            </div>
                          );
                       })}
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => { 
                  const selectedImage = currentColor === 'Default' ? selectedProduct.image : productColors.find(c => c.name === currentColor)?.image || selectedProduct.image;
                  addToCart({
                    ...selectedProduct, 
                    selectedColor: currentColor === 'Default' ? null : currentColor,
                    image: selectedImage
                  }); 
                  setSelectedProduct(null); 
                }}
                style={{ width: '100%', background: '#1a130d', color: '#d4af37', border: '1px solid #d4af37', padding: '18px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '1px', transition: '0.3s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#d4af37'; e.currentTarget.style.color = '#1a130d'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#1a130d'; e.currentTarget.style.color = '#d4af37'; }}
              >ADD TO BAG</button>
            </div>
          </div>
        </div>
        );
      })()}

      <style>{`
        .product-card:hover .product-img { transform: scale(1.05); }
        .product-img { transition: transform 0.6s ease; }
        
        .collection-page-layout {
          display: flex;
          padding-top: 80px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .collection-sidebar {
          width: 280px;
          flex-shrink: 0;
          padding: 40px 20px;
          border-right: 1px solid rgba(212, 175, 55, 0.2);
          background: #fffdf0;
          height: calc(100vh - 80px);
          position: sticky;
          top: 80px;
          overflow-y: auto;
        }

        .collection-main-content {
          flex: 1;
          padding: 0 5% 60px;
          min-width: 0; /* Prevents flex children from blowing out */
        }

        .mobile-sidebar-toggle {
          display: none;
        }

        .mobile-close-btn {
          display: none;
        }
        
        @media (max-width: 992px) {
           .filter-container { flex-direction: column; width: 100%; }
           
           .collection-sidebar {
             position: fixed;
             top: 0;
             left: -100%;
             width: 80%;
             max-width: 350px;
             height: 100vh;
             z-index: 2000;
             transition: left 0.4s ease;
             box-shadow: 10px 0 30px rgba(0,0,0,0.2);
           }
           
           .collection-sidebar.open {
             left: 0;
           }

           .mobile-sidebar-toggle {
             display: block;
             margin-top: 10px;
             margin-bottom: 10px;
             border-bottom: 1px solid rgba(212,175,55,0.2);
             padding-bottom: 15px;
           }

           .mobile-close-btn {
             display: block;
             position: absolute;
             top: 20px;
             right: 20px;
             background: none;
             border: none;
             font-size: 2rem;
             color: #1a130d;
             cursor: pointer;
           }
        }
        
        @media (max-width: 768px) {
           .modal-img-container {
             padding: 20px !important;
             border-right: none !important;
             border-bottom: 1px solid rgba(212,175,55,0.2);
           }
           .modal-content-wrapper > div:nth-child(3) { /* The text container */
             padding: 30px 20px !important;
           }

           .sub-category-scroll {
             justify-content: flex-start !important;
             overflow-x: auto;
             -webkit-overflow-scrolling: touch;
             padding-bottom: 15px !important;
           }
           .sub-category-scroll::-webkit-scrollbar { display: none; }
           .sub-category-scroll > div { flex-shrink: 0; }
           
           .filter-sort-bar {
             flex-direction: column;
             align-items: flex-start !important;
             gap: 15px;
           }
           
           .grid-toggles {
             display: none !important;
           }
           
           .product-grid {
             grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
             gap: 10px !important;
           }
        }
      `}</style>
      
      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1999, backdropFilter: 'blur(3px)'
          }}
        />
      )}
    </div>
  );
};

export default Collection;
