import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { DataContext } from '../DataContext';
import { compressImage } from '../utils/imageCompressor';

const API_URL = import.meta.env.VITE_API_URL || 'https://mdflower-qvjl.vercel.app';

const Admin = () => {
  const { products, categories, refetchData, deleteProduct, deleteCategory, updateProduct, updateCategory } = useContext(DataContext);
  const [activeTab, setActiveTab] = useState('OVERVIEW'); 
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // States
  const [productData, setProductData] = useState({ name: '', category: '', sub: '', variety: '', price: '', color: '', description: '' });
  const [productImageFile, setProductImageFile] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);

  const [categoryData, setCategoryData] = useState({ name: '', subs: [{ name: '', imgFile: null, imgPreview: null }] });
  
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  // Handlers
  const handleProductChange = (e) => setProductData({ ...productData, [e.target.name]: e.target.value });
  
  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImageFile(file);
      const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
      setProductImagePreview(isHeic ? 'HEIC_PLACEHOLDER' : URL.createObjectURL(file));
    }
  };

  const handleCategoryNameChange = (e) => setCategoryData({ ...categoryData, name: e.target.value });
  
  const handleSubChange = (index, field, value) => {
    const newSubs = [...categoryData.subs];
    newSubs[index][field] = value;
    setCategoryData({ ...categoryData, subs: newSubs });
  };

  const handleSubImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newSubs = [...categoryData.subs];
      newSubs[index].imgFile = file;
      const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
      newSubs[index].imgPreview = isHeic ? 'HEIC_PLACEHOLDER' : URL.createObjectURL(file);
      setCategoryData({ ...categoryData, subs: newSubs });
    }
  };
  
  const addSubField = () => setCategoryData({ ...categoryData, subs: [...categoryData.subs, { name: '', imgFile: null, imgPreview: null }] });
  const removeSubField = (index) => setCategoryData({ ...categoryData, subs: categoryData.subs.filter((_, i) => i !== index) });

  // Upload Function
  const uploadImage = async (file) => {
    // Compress the image before uploading
    const compressedFile = await compressImage(file);
    const formData = new FormData();
    formData.append('image', compressedFile, compressedFile.name || file.name);
    const res = await axios.post(`${API_URL}/api/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.imageUrl;
  };

  // Submits
  const submitProduct = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let finalPrice = productData.price;
    if (!finalPrice.startsWith('₹') && !finalPrice.toLowerCase().includes('rs')) finalPrice = '₹' + finalPrice;

    try {
      let imageUrl = productImagePreview || '/premium_orchid_blue_1777448990406.png'; // use existing image or fallback
      if (productImageFile) {
        imageUrl = await uploadImage(productImageFile);
      }

      const newProduct = { ...productData, price: finalPrice, image: imageUrl };
      
      if (editingProductId) {
        await updateProduct(editingProductId, newProduct);
        showMsg('Product updated successfully!');
      } else {
        await axios.post(`${API_URL}/api/products`, newProduct);
        showMsg('Product added successfully!');
      }
      
      setProductData({ name: '', category: '', sub: '', variety: '', price: '', color: '', description: '' });
      setProductImageFile(null);
      setProductImagePreview(null);
      setEditingProductId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowAddProduct(false);
      refetchData();
    } catch (err) { 
      showMsg('Error adding product.', 'error'); 
    } finally {
      setIsUploading(false);
    }
  };

  const submitCategory = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const validSubs = [];
      for (const sub of categoryData.subs) {
        if (sub.name.trim() !== '') {
          let imageUrl = sub.imgPreview || '';
          if (sub.imgFile) {
             imageUrl = await uploadImage(sub.imgFile);
          }
          validSubs.push({ name: sub.name, img: imageUrl });
        }
      }

      if (editingCategoryId) {
        await updateCategory(editingCategoryId, { name: categoryData.name, subs: validSubs });
        showMsg('Category updated successfully!');
      } else {
        await axios.post(`${API_URL}/api/categories`, { name: categoryData.name, subs: validSubs });
        showMsg('Category added successfully!');
      }
      
      setCategoryData({ name: '', subs: [{ name: '', imgFile: null, imgPreview: null }] });
      setEditingCategoryId(null);
      setShowAddCategory(false);
      refetchData();
    } catch (err) { 
      showMsg('Error adding category.', 'error'); 
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try { await deleteProduct(id); showMsg('Product deleted!'); } 
      catch (e) { showMsg('Failed to delete product.', 'error'); }
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try { await deleteCategory(id); showMsg('Category deleted!'); } 
      catch (e) { showMsg('Failed to delete category.', 'error'); }
    }
  };

  const handleEditProduct = (prod) => {
    setProductData({
      name: prod.name, category: prod.category, sub: prod.sub || '', 
      variety: prod.variety || '', price: prod.price, color: prod.color || '', description: prod.description || ''
    });
    setProductImagePreview(prod.image);
    setProductImageFile(null);
    setEditingProductId(prod._id);
    setShowAddProduct(true);
  };

  const handleEditCategory = (cat) => {
    const subs = cat.subs && cat.subs.length > 0 
      ? cat.subs.map(s => ({ name: s.name, imgFile: null, imgPreview: s.img }))
      : [{ name: '', imgFile: null, imgPreview: null }];
    setCategoryData({ name: cat.name, subs });
    setEditingCategoryId(cat._id);
    setShowAddCategory(true);
  };

  const resetProductForm = () => {
    setProductData({ name: '', category: '', sub: '', variety: '', price: '', color: '', description: '' });
    setProductImageFile(null); setProductImagePreview(null); setEditingProductId(null);
    setShowAddProduct(false);
  };

  const resetCategoryForm = () => {
    setCategoryData({ name: '', subs: [{ name: '', imgFile: null, imgPreview: null }] });
    setEditingCategoryId(null);
    setShowAddCategory(false);
  };

  const existingVarieties = Array.from(new Set(products.map(p => p.variety).filter(Boolean)));
  const defaultVarieties = ['Roses', 'Orchids', 'Tulips', 'Carnations', 'Lilies', 'Hydrangea', 'Peonies', 'Sunflowers', 'Daisies', 'Tropical', 'Mixed', 'Other'];
  const allVarieties = Array.from(new Set([...defaultVarieties, ...existingVarieties])).sort();

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#fdfbf7', color: '#1a130d', fontFamily: 'Montserrat, sans-serif' }}>
      
      {/* MOBILE HEADER (Only visible on small screens) */}
      <div className="admin-mobile-header" style={{ display: 'none', padding: '15px 5%', background: '#fff', borderBottom: '1px solid rgba(212,175,55,0.2)', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <h2 style={{ fontFamily: 'Cinzel, serif', color: '#1a130d', margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
          ADMIN <span style={{ color: '#d4af37' }}>PANEL</span>
        </h2>
        <button onClick={() => setIsMobileMenuOpen(true)} style={{ background: 'none', border: 'none', fontSize: '1.8rem', color: '#1a130d', cursor: 'pointer' }}>
          ☰
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)} 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} 
        />
      )}

      {/* PREMIUM LIGHT SIDEBAR */}
      <div className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`} style={{ width: '280px', background: '#ffffff', padding: '40px 20px', flexShrink: 0, borderRight: '1px solid rgba(212, 175, 55, 0.2)', boxShadow: '5px 0 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', zIndex: 1000 }}>
        <div className="sidebar-close-btn" style={{ display: 'none', textAlign: 'right', marginBottom: '20px' }}>
          <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#1a130d' }}>✕</button>
        </div>
        
        <h2 className="sidebar-title" style={{ fontFamily: 'Cinzel, serif', color: '#1a130d', marginBottom: '5px', letterSpacing: '3px', textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold' }}>
          ADMIN <span style={{ color: '#d4af37' }}>PANEL</span>
        </h2>
        <p className="sidebar-subtitle" style={{ textAlign: 'center', fontSize: '0.7rem', color: '#d4af37', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '50px' }}>BOUTIQUE DASHBOARD</p>
        
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <li onClick={() => { setActiveTab('OVERVIEW'); setShowAddProduct(false); setShowAddCategory(false); setIsMobileMenuOpen(false); }} style={{ ...sidebarItem, background: activeTab === 'OVERVIEW' ? 'rgba(212,175,55,0.08)' : 'transparent', color: activeTab === 'OVERVIEW' ? '#1a130d' : '#666', borderLeft: activeTab === 'OVERVIEW' ? '4px solid #d4af37' : '4px solid transparent' }}>
            <span style={{ fontSize: '1.2rem', marginRight: '15px' }}>📊</span> Dashboard
          </li>
          <li onClick={() => { setActiveTab('PRODUCTS'); setShowAddProduct(false); setShowAddCategory(false); setIsMobileMenuOpen(false); }} style={{ ...sidebarItem, background: activeTab === 'PRODUCTS' ? 'rgba(212,175,55,0.08)' : 'transparent', color: activeTab === 'PRODUCTS' ? '#1a130d' : '#666', borderLeft: activeTab === 'PRODUCTS' ? '4px solid #d4af37' : '4px solid transparent' }}>
            <span style={{ fontSize: '1.2rem', marginRight: '15px' }}>🌸</span> Products
          </li>
          <li onClick={() => { setActiveTab('CATEGORIES'); setShowAddProduct(false); setShowAddCategory(false); setIsMobileMenuOpen(false); }} style={{ ...sidebarItem, background: activeTab === 'CATEGORIES' ? 'rgba(212,175,55,0.08)' : 'transparent', color: activeTab === 'CATEGORIES' ? '#1a130d' : '#666', borderLeft: activeTab === 'CATEGORIES' ? '4px solid #d4af37' : '4px solid transparent' }}>
            <span style={{ fontSize: '1.2rem', marginRight: '15px' }}>📁</span> Categories
          </li>
        </ul>

        <div style={{ marginTop: 'auto', textAlign: 'center', padding: '20px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
           <p style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '1px' }}>MD FLOWERS SYSTEM V2.0</p>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="admin-main" style={{ flex: 1, padding: '50px 6%', overflowY: 'auto', background: '#fdfbf7', position: 'relative', minWidth: 0 }}>
        
        {/* Decorative Gold Elements */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />

        {/* NOTIFICATION */}
        {message.text && (
          <div style={{ position: 'fixed', top: '30px', right: '30px', zIndex: 9999, padding: '15px 25px', background: message.type === 'error' ? '#fff' : '#fff', color: message.type === 'error' ? '#cc0000' : '#155724', borderRadius: '8px', fontWeight: 'bold', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderLeft: `5px solid ${message.type === 'error' ? '#ff4444' : '#4ade80'}`, animation: 'slideIn 0.3s ease-out' }}>
            {message.text}
          </div>
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* --- OVERVIEW TAB --- */}
          {activeTab === 'OVERVIEW' && (
            <div className="fade-in">
              <h1 style={headerStyle}>System Overview</h1>
              <p style={{ color: '#666', marginBottom: '40px' }}>Welcome back. Here is the current status of your database.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                <div className="stat-card" style={statCard}>
                  <div style={statIconBox}>📦</div>
                  <div>
                    <p style={{ color: '#666', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '5px', fontWeight: 'bold' }}>TOTAL PRODUCTS</p>
                    <h3 style={{ fontSize: '3rem', color: '#1a130d', margin: 0, fontFamily: 'Cinzel, serif' }}>{products.length}</h3>
                  </div>
                </div>
                <div className="stat-card" style={statCard}>
                  <div style={statIconBox}>📑</div>
                  <div>
                    <p style={{ color: '#666', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '5px', fontWeight: 'bold' }}>TOTAL CATEGORIES</p>
                    <h3 style={{ fontSize: '3rem', color: '#1a130d', margin: 0, fontFamily: 'Cinzel, serif' }}>{categories.length}</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- PRODUCTS TAB --- */}
          {activeTab === 'PRODUCTS' && !showAddProduct && (
            <div className="fade-in">
              <div className="admin-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h1 style={headerStyle}>Product Inventory</h1>
                  <p style={{ color: '#666' }}>Manage your luxury flower collections.</p>
                </div>
                <button onClick={() => setShowAddProduct(true)} className="premium-btn">+ ADD NEW PRODUCT</button>
              </div>
              
              <div className="table-container" style={tableContainer}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: '#f8f9fa', borderBottom: '1px solid #eaeaea' }}>
                    <tr>
                      <th style={thStyle}>Image</th>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Category</th>
                      <th style={thStyle}>Price</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.3s', background: '#fff' }} onMouseEnter={e => e.currentTarget.style.background = '#fcfcfc'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                        <td style={tdStyle}>
                          <div style={{ width: '50px', height: '50px', borderRadius: '8px', border: '1px solid #eee', background: '#fff', padding: '2px', overflow: 'hidden' }}>
                             <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                          </div>
                        </td>
                        <td style={{...tdStyle, fontWeight: 'bold', color: '#1a130d'}}>{p.name}</td>
                        <td style={tdStyle}><span style={badgeStyle}>{p.category}</span></td>
                        <td style={{...tdStyle, color: '#d4af37', fontWeight: 'bold'}}>{p.price}</td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => handleEditProduct(p)} className="edit-btn">Edit</button>
                            <button onClick={() => handleDeleteProduct(p._id)} className="delete-btn">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#666', background: '#fff' }}>No products found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADD / EDIT PRODUCT FORM */}
          {activeTab === 'PRODUCTS' && showAddProduct && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={headerStyle}>{editingProductId ? 'Edit Product' : 'Create Product'}</h1>
                <button onClick={resetProductForm} className="back-btn">← Back to Inventory</button>
              </div>

              <div className="form-container" style={formContainer}>
                <form onSubmit={submitProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                  
                  {/* Image Upload Section */}
                  <div className="image-upload-section" style={{ gridColumn: '1 / -1', display: 'flex', gap: '30px', alignItems: 'center', padding: '25px', background: '#fafafa', borderRadius: '12px', border: '2px dashed #e0e0e0', transition: '0.3s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#d4af37'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e0e0e0'}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '10px', background: '#fff', border: '1px solid #eee', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', flexShrink: 0, textAlign: 'center' }}>
                      {productImagePreview === 'HEIC_PLACEHOLDER' ? (
                        <div style={{ padding: '10px' }}>
                          <span style={{ fontSize: '2rem' }}>📱</span>
                          <p style={{ fontSize: '0.6rem', color: '#666', marginTop: '5px', fontWeight: 'bold' }}>iPhone Photo<br/>(Will be converted)</p>
                        </div>
                      ) : productImagePreview ? (
                        <img src={productImagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ color: '#ccc', fontSize: '2.5rem' }}>📷</span>
                      )}
                    </div>
                    <div>
                      <h4 style={{ color: '#1a130d', marginBottom: '10px', fontSize: '1.1rem', fontWeight: 'bold' }}>Product Image</h4>
                      <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>Upload a high-quality image from your computer gallery.</p>
                      
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button type="button" style={{ background: '#fff', border: '1px solid #d4af37', color: '#d4af37', padding: '8px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', pointerEvents: 'none' }}>
                          CHOOSE FILE
                        </button>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleProductImageChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                      </div>
                      
                      {productImageFile && <span style={{ marginLeft: '15px', fontSize: '0.8rem', color: '#155724', fontWeight: 'bold' }}>✓ Selected: {productImageFile.name}</span>}
                    </div>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Product Name *</label><input required type="text" name="name" value={productData.name} onChange={handleProductChange} style={inputStyle} placeholder="e.g. Royal Gold Metallic Rose" /></div>
                  
                  <div>
                    <label style={labelStyle}>Category *</label>
                    <select required name="category" value={productData.category} onChange={handleProductChange} style={{...inputStyle, appearance: 'none', background: '#fcfcfc url("data:image/svg+xml;utf8,<svg fill=%27%231a130d%27 height=%2724%27 viewBox=%270 0 24 24%27 width=%2724%27 xmlns=%27http://www.w3.org/2000/svg%27><path d=%27M7 10l5 5 5-5z%27/></svg>") no-repeat right 15px center' }}>
                      <option value="">Select Category</option>
                      {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Sub-category</label>
                    <select name="sub" value={productData.sub} onChange={handleProductChange} style={{...inputStyle, appearance: 'none', background: '#fcfcfc url("data:image/svg+xml;utf8,<svg fill=%27%231a130d%27 height=%2724%27 viewBox=%270 0 24 24%27 width=%2724%27 xmlns=%27http://www.w3.org/2000/svg%27><path d=%27M7 10l5 5 5-5z%27/></svg>") no-repeat right 15px center' }} disabled={!productData.category}>
                      <option value="">{productData.category ? "Select Sub-category" : "Select a Category first"}</option>
                      {productData.category && categories.find(c => c.name === productData.category)?.subs?.map((sub, idx) => (
                        <option key={idx} value={sub.name}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label style={labelStyle}>Variety</label>
                    <input 
                      list="variety-options"
                      name="variety" 
                      value={productData.variety} 
                      onChange={handleProductChange} 
                      style={inputStyle}
                      placeholder="Select or type custom variety..."
                      autoComplete="off"
                    />
                    <datalist id="variety-options">
                      {allVarieties.map(v => (
                         <option key={v} value={v} />
                      ))}
                    </datalist>
                  </div>
                  <div><label style={labelStyle}>Price *</label><input required type="text" name="price" value={productData.price} onChange={handleProductChange} style={inputStyle} placeholder="₹0.00" /></div>
                  <div><label style={labelStyle}>Color</label><input type="text" name="color" value={productData.color} onChange={handleProductChange} style={inputStyle} placeholder="e.g. Gold" /></div>
                  
                  <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Description</label><textarea name="description" value={productData.description} onChange={handleProductChange} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="Detail the luxury and quality of the product..." /></div>
                  
                  <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                    <button type="submit" disabled={isUploading} className="premium-btn-large">
                      {isUploading ? 'UPLOADING AND SAVING...' : editingProductId ? 'UPDATE PRODUCT IN DATABASE' : 'SAVE PRODUCT TO DATABASE'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* --- CATEGORIES TAB --- */}
          {activeTab === 'CATEGORIES' && !showAddCategory && (
            <div className="fade-in">
              <div className="admin-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h1 style={headerStyle}>Category Structure</h1>
                  <p style={{ color: '#666' }}>Organize your shop's navigation.</p>
                </div>
                <button onClick={() => setShowAddCategory(true)} className="premium-btn">+ ADD NEW CATEGORY</button>
              </div>
              
              <div className="table-container" style={tableContainer}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: '#f8f9fa', borderBottom: '1px solid #eaeaea' }}>
                    <tr>
                      <th style={thStyle}>Category Name</th>
                      <th style={thStyle}>Sub-Categories</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(c => (
                      <tr key={c._id} style={{ borderBottom: '1px solid #f0f0f0', background: '#fff' }}>
                        <td style={{...tdStyle, fontWeight: 'bold', fontSize: '1.05rem', color: '#1a130d'}}>{c.name}</td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {c.subs && c.subs.map((s, i) => (
                               <span key={i} style={badgeStyleSecondary}>
                                 {s.img && <img src={s.img} alt="" style={{width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover'}} />}
                                 {s.name}
                               </span>
                            ))}
                          </div>
                        </td>
                        <td style={tdStyle}>
                          {c.name !== 'SHOP ALL' && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button onClick={() => handleEditCategory(c)} className="edit-btn">Edit</button>
                              <button onClick={() => handleDeleteCategory(c._id)} className="delete-btn">Delete</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && <tr><td colSpan="3" style={{ padding: '30px', textAlign: 'center', color: '#666', background: '#fff' }}>No categories found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADD / EDIT CATEGORY FORM */}
          {activeTab === 'CATEGORIES' && showAddCategory && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={headerStyle}>{editingCategoryId ? 'Edit Category' : 'Create Category'}</h1>
                <button onClick={resetCategoryForm} className="back-btn">← Back to Categories</button>
              </div>
              
              <div className="form-container" style={formContainer}>
                <form onSubmit={submitCategory}>
                  <div style={{ marginBottom: '40px' }}>
                    <label style={labelStyle}>Main Category Name *</label>
                    <input required type="text" value={categoryData.name} onChange={handleCategoryNameChange} style={{...inputStyle, fontSize: '1.2rem', padding: '18px', fontWeight: 'bold'}} placeholder="e.g. Exotic Flowers" />
                  </div>
                  
                  <div style={{ borderTop: '2px dashed #eee', paddingTop: '30px', marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#1a130d', marginBottom: '10px', fontFamily: 'Cinzel, serif', fontWeight: 'bold' }}>Sub-Categories</h3>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '25px' }}>Add specific sub-categories and upload their display images from your gallery.</p>
                    
                    {categoryData.subs.map((sub, index) => (
                      <div className="sub-cat-row" key={index} style={{ display: 'flex', gap: '25px', alignItems: 'center', marginBottom: '20px', padding: '25px', background: '#fafafa', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                        
                        <div className="sub-cat-preview" style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fff', border: '1px solid #ddd', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textAlign: 'center' }}>
                          {sub.imgPreview === 'HEIC_PLACEHOLDER' ? (
                            <div>
                              <span style={{ fontSize: '1.5rem' }}>📱</span>
                              <p style={{ fontSize: '0.5rem', color: '#666', marginTop: '2px', fontWeight: 'bold' }}>iPhone Photo</p>
                            </div>
                          ) : sub.imgPreview ? (
                            <img src={sub.imgPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '1.5rem', color: '#ccc' }}>📷</span>
                          )}
                        </div>

                        <div style={{ flex: 1 }}>
                          <label style={{...labelStyle, fontSize: '0.75rem'}}>Sub-category Name</label>
                          <input type="text" value={sub.name} onChange={(e) => handleSubChange(index, 'name', e.target.value)} style={inputStyle} placeholder="e.g. Red Exotics" />
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <label style={{...labelStyle, fontSize: '0.75rem'}}>Upload Image</label>
                          <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                            <button type="button" style={{ background: '#fff', border: '1px solid #ccc', color: '#1a130d', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', pointerEvents: 'none', width: '100%', textAlign: 'left' }}>
                              {sub.imgFile ? '✓ Image Selected' : 'CHOOSE FILE...'}
                            </button>
                            <input type="file" accept="image/*" onChange={(e) => handleSubImageChange(index, e)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                          </div>
                        </div>

                        {categoryData.subs.length > 1 && (
                          <button type="button" onClick={() => removeSubField(index)} className="delete-btn" style={{ padding: '10px 15px', alignSelf: 'flex-end', marginBottom: '2px', background: '#fff' }}>🗑️</button>
                        )}
                      </div>
                    ))}
                    
                    <button type="button" onClick={addSubField} className="dashed-btn">
                      + ADD ANOTHER SUB-CATEGORY
                    </button>
                  </div>

                  <div>
                    <button type="submit" disabled={isUploading} className="premium-btn-large">
                       {isUploading ? 'UPLOADING AND SAVING...' : editingCategoryId ? 'UPDATE CATEGORY IN DATABASE' : 'SAVE CATEGORY TO DATABASE'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .premium-btn {
          background: #1a130d;
          color: #d4af37; border: 1px solid #1a130d; padding: 12px 25px; border-radius: 6px;
          font-weight: bold; cursor: pointer; letter-spacing: 1px; transition: 0.3s;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .premium-btn:hover {
          transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15); background: #d4af37; color: #1a130d; border-color: #d4af37;
        }
        .premium-btn-large {
          background: #1a130d;
          color: #d4af37; border: none; padding: 20px; width: 100%; border-radius: 8px;
          font-weight: 800; font-size: 1.1rem; cursor: pointer; letter-spacing: 2px; transition: 0.3s;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .premium-btn-large:hover:not(:disabled) {
          transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2); background: #d4af37; color: #1a130d;
        }
        .premium-btn-large:disabled {
          opacity: 0.7; cursor: not-allowed; background: #666; color: #ccc;
        }
        .delete-btn {
          background: rgba(200, 0, 0, 0.05); color: #cc0000; border: 1px solid rgba(200, 0, 0, 0.2);
          padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 0.8rem; transition: 0.2s;
        }
        .delete-btn:hover {
          background: #cc0000; color: #fff;
        }
        .edit-btn {
          background: rgba(212, 175, 55, 0.1); color: #b8860b; border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 0.8rem; transition: 0.2s;
        }
        .edit-btn:hover {
          background: #d4af37; color: #fff; border-color: #d4af37;
        }
        .dashed-btn {
          background: transparent; border: 2px dashed #d4af37; color: #d4af37;
          padding: 15px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s; width: 100%; letter-spacing: 1px;
        }
        .dashed-btn:hover {
          background: rgba(212, 175, 55, 0.05);
        }
        .back-btn {
          background: transparent; color: #1a130d; border: 1px solid #ccc; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.3s;
        }
        .back-btn:hover {
          background: #f0f0f0; border-color: #1a130d;
        }
        .stat-card:hover {
          transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.08) !important;
        }
        table th, table td { white-space: nowrap; }
        
        @media (max-width: 992px) {
          form { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .admin-layout { flex-direction: column !important; }
          .admin-mobile-header { display: flex !important; }
          .admin-sidebar { 
            position: fixed; top: 0; left: -100%; height: 100vh; width: 280px !important; 
            padding: 20px !important; transition: 0.3s; 
          }
          .admin-sidebar.open { left: 0; }
          .sidebar-close-btn { display: block !important; }
          .sidebar-title { display: none !important; }
          .sidebar-subtitle { display: none !important; }
          .admin-main { padding: 25px 5% !important; }
          h1 { font-size: 1.6rem !important; line-height: 1.2; }
          .admin-header-flex { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
          .admin-header-flex button { width: 100%; }
          .form-container { padding: 20px !important; }
          .table-container { padding: 15px !important; border-radius: 8px !important; }
          .image-upload-section { flex-direction: column !important; text-align: center !important; gap: 15px !important; padding: 15px !important; }
          
          /* Form stack fixes */
          .sub-cat-row { flex-direction: column !important; align-items: flex-start !important; gap: 15px !important; padding: 15px !important; }
          .sub-cat-row > div { width: 100% !important; }
          .sub-cat-preview { width: 80px !important; height: 80px !important; border-radius: 50% !important; margin: 0 auto !important; }
          .sub-cat-row .delete-btn { width: 100%; margin-top: 10px; }
        }
      `}</style>
    </div>
  );
};

// --- STYLES ---
const sidebarItem = {
  padding: '15px 20px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '8px', transition: 'all 0.3s', display: 'flex', alignItems: 'center'
};
const headerStyle = {
  fontFamily: 'Cinzel, serif', color: '#1a130d', margin: 0, fontSize: '2.5rem', fontWeight: 'bold'
};
const statCard = {
  padding: '40px 30px', display: 'flex', alignItems: 'center', gap: '25px', background: '#fff', borderRadius: '15px', border: '1px solid #f0f0f0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', transition: '0.3s'
};
const statIconBox = {
  width: '70px', height: '70px', borderRadius: '15px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
};
const tableContainer = {
  background: '#fff', borderRadius: '15px', border: '1px solid #eaeaea', overflowX: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
};
const formContainer = {
  background: '#fff', padding: '40px', borderRadius: '15px', border: '1px solid #eaeaea', boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
};
const thStyle = { padding: '20px', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1.5px', color: '#666', fontWeight: 'bold' };
const tdStyle = { padding: '15px 20px', color: '#444' };
const labelStyle = { display: 'block', marginBottom: '10px', color: '#1a130d', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' };
const inputStyle = { width: '100%', padding: '15px', background: '#fcfcfc', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem', color: '#1a130d', outline: 'none', transition: '0.3s' };
const badgeStyle = { background: 'rgba(212,175,55,0.1)', color: '#d4af37', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid rgba(212,175,55,0.3)' };
const badgeStyleSecondary = { background: '#f8f9fa', color: '#444', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' };

export default Admin;
