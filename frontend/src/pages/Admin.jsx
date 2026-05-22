import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataContext } from '../DataContext';
import { compressImage } from '../utils/imageCompressor';

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const hostname = window.location.hostname;
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
  return isLocalHost ? 'http://localhost:5000' : 'https://mdflower-qvjl.vercel.app';
};
const API_URL = getApiUrl();

const Admin = () => {
  const { 
    products, 
    categories, 
    topSellingCategories, 
    signatureMasterpieces,
    refetchData, 
    deleteProduct, 
    deleteCategory, 
    deleteTopSellingCategory, 
    updateProduct, 
    updateCategory, 
    updateTopSellingCategory,
    updateSignatureMasterpieces
  } = useContext(DataContext);
  const [activeTab, setActiveTab] = useState('OVERVIEW'); 
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Gallery states
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryTargetCallback, setGalleryTargetCallback] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [gallerySearch, setGallerySearch] = useState('');

  // Top Selling states
  const [selectedTopCat, setSelectedTopCat] = useState(null);
  const [newTopCatName, setNewTopCatName] = useState('');
  const [newTopCatImagePreview, setNewTopCatImagePreview] = useState(null);
  const [newTopCatImageFile, setNewTopCatImageFile] = useState(null);
  const [editingTopCatId, setEditingTopCatId] = useState(null);
  const [newSubName, setNewSubName] = useState('');
  const [showTopProductForm, setShowTopProductForm] = useState(false);
  const [topProductData, setTopProductData] = useState({ name: '', price: '', image: '' });
  const [topProductImageFile, setTopProductImageFile] = useState(null);
  const [topProductImagePreview, setTopProductImagePreview] = useState(null);
  const [editingTopProductIndex, setEditingTopProductIndex] = useState(null);
  const [targetSubIndex, setTargetSubIndex] = useState(null);

  // Signature Pieces states
  const [masterpieceSearch, setMasterpieceSearch] = useState('');
  const [masterpieceCategory, setMasterpieceCategory] = useState('ALL');

  // States
  const [productData, setProductData] = useState({ name: '', category: '', sub: '', variety: '', price: '', color: '', description: '' });
  const [productImageFile, setProductImageFile] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);

  const [categoryData, setCategoryData] = useState({ name: '', subs: [{ name: '', imgFile: null, imgPreview: null }] });
  
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#ffffff';
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

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

  // Gallery Helper
  const openGallery = (callback) => {
    setGalleryTargetCallback(() => callback);
    setIsGalleryOpen(true);
    axios.get(`${API_URL}/api/gallery`)
      .then(res => setGalleryImages(res.data))
      .catch(err => console.error("Error loading gallery", err));
  };

  // Top Selling helpers
  const handleSaveTopCategory = async (e) => {
    e.preventDefault();
    if (!newTopCatName.trim()) return;
    try {
      setIsUploading(true);
      let imageUrl = newTopCatImagePreview || '';
      if (newTopCatImageFile) {
        imageUrl = await uploadImage(newTopCatImageFile);
      }
      
      if (editingTopCatId) {
        const cat = topSellingCategories.find(c => c._id === editingTopCatId);
        await updateTopSellingCategory(editingTopCatId, { 
          ...cat, 
          name: newTopCatName.trim(), 
          image: imageUrl 
        });
        showMsg('Top Selling Category updated successfully!');
        setEditingTopCatId(null);
      } else {
        await axios.post(`${API_URL}/api/top-selling`, { 
          name: newTopCatName.trim(), 
          image: imageUrl, 
          subs: [] 
        });
        showMsg('Top Selling Category added successfully!');
      }
      
      setNewTopCatName('');
      setNewTopCatImagePreview(null);
      setNewTopCatImageFile(null);
      refetchData();
    } catch (err) {
      showMsg('Error saving top selling category.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditTopCategoryTrigger = (cat) => {
    setEditingTopCatId(cat._id);
    setNewTopCatName(cat.name);
    setNewTopCatImagePreview(cat.image || null);
    setNewTopCatImageFile(null);
  };

  const handleDeleteTopCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category? All its items will be removed.")) {
      try {
        await deleteTopSellingCategory(id);
        showMsg('Category deleted!');
        if (selectedTopCat?._id === id) setSelectedTopCat(null);
      } catch (err) {
        showMsg('Failed to delete category.', 'error');
      }
    }
  };

  const handleAddTopSub = async (e) => {
    e.preventDefault();
    if (!newSubName.trim() || !selectedTopCat) return;
    try {
      setIsUploading(true);
      const updatedSubs = [...selectedTopCat.subs, { name: newSubName.trim(), products: [] }];
      const res = await axios.put(`${API_URL}/api/top-selling/${selectedTopCat._id}`, {
        name: selectedTopCat.name,
        subs: updatedSubs
      });
      setSelectedTopCat(res.data);
      setNewSubName('');
      showMsg('Subcategory added!');
      refetchData();
    } catch (err) {
      showMsg('Failed to add subcategory.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRenameTopSub = async (subIndex) => {
    if (!selectedTopCat) return;
    const sub = selectedTopCat.subs[subIndex];
    const newName = window.prompt("Enter new subcategory name:", sub.name);
    if (!newName || !newName.trim() || newName.trim() === sub.name) return;
    try {
      setIsUploading(true);
      const updatedSubs = [...selectedTopCat.subs];
      updatedSubs[subIndex].name = newName.trim();
      const res = await axios.put(`${API_URL}/api/top-selling/${selectedTopCat._id}`, {
        name: selectedTopCat.name,
        subs: updatedSubs
      });
      setSelectedTopCat(res.data);
      showMsg('Subcategory renamed!');
      refetchData();
    } catch (err) {
      showMsg('Failed to rename subcategory.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteTopSub = async (subIndex) => {
    if (!selectedTopCat) return;
    if (window.confirm("Are you sure you want to delete this subcategory and all its products?")) {
      try {
        setIsUploading(true);
        const updatedSubs = selectedTopCat.subs.filter((_, idx) => idx !== subIndex);
        const res = await axios.put(`${API_URL}/api/top-selling/${selectedTopCat._id}`, {
          name: selectedTopCat.name,
          subs: updatedSubs
        });
        setSelectedTopCat(res.data);
        showMsg('Subcategory deleted!');
        refetchData();
      } catch (err) {
        showMsg('Failed to delete subcategory.', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleOpenAddTopProduct = (subIndex) => {
    setTargetSubIndex(subIndex);
    setEditingTopProductIndex(null);
    setTopProductData({ name: '', price: '', image: '' });
    setTopProductImageFile(null);
    setTopProductImagePreview(null);
    setShowTopProductForm(true);
  };

  const handleEditTopProduct = (subIndex, productIndex) => {
    if (!selectedTopCat) return;
    const product = selectedTopCat.subs[subIndex].products[productIndex];
    setTargetSubIndex(subIndex);
    setEditingTopProductIndex(productIndex);
    setTopProductData({ name: product.name, price: product.price, image: product.image });
    setTopProductImageFile(null);
    setTopProductImagePreview(product.image);
    setShowTopProductForm(true);
  };

  const handleDeleteTopProduct = async (subIndex, productIndex) => {
    if (!selectedTopCat) return;
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setIsUploading(true);
        const updatedSubs = [...selectedTopCat.subs];
        updatedSubs[subIndex].products = updatedSubs[subIndex].products.filter((_, idx) => idx !== productIndex);
        const res = await axios.put(`${API_URL}/api/top-selling/${selectedTopCat._id}`, {
          name: selectedTopCat.name,
          subs: updatedSubs
        });
        setSelectedTopCat(res.data);
        showMsg('Product deleted!');
        refetchData();
      } catch (err) {
        showMsg('Failed to delete product.', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveTopProduct = async (e) => {
    e.preventDefault();
    if (!selectedTopCat || targetSubIndex === null) return;
    setIsUploading(true);
    
    let finalPrice = topProductData.price;
    if (!finalPrice.startsWith('₹') && !finalPrice.toLowerCase().includes('rs')) finalPrice = '₹' + finalPrice;

    try {
      let imageUrl = topProductImagePreview || '';
      if (topProductImageFile) {
        imageUrl = await uploadImage(topProductImageFile);
      }
      
      const productObj = { name: topProductData.name, price: finalPrice, image: imageUrl };
      
      const updatedSubs = [...selectedTopCat.subs];
      const sub = updatedSubs[targetSubIndex];
      
      if (editingTopProductIndex !== null) {
        sub.products[editingTopProductIndex] = productObj;
      } else {
        sub.products.push(productObj);
      }
      
      const res = await axios.put(`${API_URL}/api/top-selling/${selectedTopCat._id}`, {
        name: selectedTopCat.name,
        subs: updatedSubs
      });
      
      setSelectedTopCat(res.data);
      showMsg(editingTopProductIndex !== null ? 'Product updated!' : 'Product added!');
      
      setTopProductData({ name: '', price: '', image: '' });
      setTopProductImageFile(null);
      setTopProductImagePreview(null);
      setEditingTopProductIndex(null);
      setTargetSubIndex(null);
      setShowTopProductForm(false);
      refetchData();
    } catch (err) {
      showMsg('Failed to save product.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const existingVarieties = Array.from(new Set(products.map(p => p.variety).filter(Boolean)));
  const defaultVarieties = ['Roses', 'Orchids', 'Tulips', 'Carnations', 'Lilies', 'Hydrangea', 'Peonies', 'Sunflowers', 'Daisies', 'Tropical', 'Mixed', 'Other'];
  const allVarieties = Array.from(new Set([...defaultVarieties, ...existingVarieties])).sort();

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#ffffff', color: '#1a130d', fontFamily: 'Montserrat, sans-serif', overflowX: 'hidden' }}>
      
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
      <div className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`} style={{ width: '240px', background: '#ffffff', padding: '40px 15px', flexShrink: 0, borderRight: '1px solid rgba(212, 175, 55, 0.1)', display: 'flex', flexDirection: 'column', zIndex: 1000 }}>
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
          <li onClick={() => { setActiveTab('TOP_SELLING'); setSelectedTopCat(null); setShowAddProduct(false); setShowAddCategory(false); setIsMobileMenuOpen(false); }} style={{ ...sidebarItem, background: activeTab === 'TOP_SELLING' ? 'rgba(212,175,55,0.08)' : 'transparent', color: activeTab === 'TOP_SELLING' ? '#1a130d' : '#666', borderLeft: activeTab === 'TOP_SELLING' ? '4px solid #d4af37' : '4px solid transparent' }}>
            <span style={{ fontSize: '1.2rem', marginRight: '15px' }}>⭐</span> Top Selling
          </li>
          <li onClick={() => { setActiveTab('SIGNATURE_PIECES'); setShowAddProduct(false); setShowAddCategory(false); setIsMobileMenuOpen(false); }} style={{ ...sidebarItem, background: activeTab === 'SIGNATURE_PIECES' ? 'rgba(212,175,55,0.08)' : 'transparent', color: activeTab === 'SIGNATURE_PIECES' ? '#1a130d' : '#666', borderLeft: activeTab === 'SIGNATURE_PIECES' ? '4px solid #d4af37' : '4px solid transparent' }}>
            <span style={{ fontSize: '1.2rem', marginRight: '15px' }}>💎</span> Signature Pieces
          </li>
        </ul>

        <div style={{ marginTop: 'auto', textAlign: 'center', padding: '20px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
           <p style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '1px' }}>MD FLOWERS SYSTEM V2.0</p>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="admin-main" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: '#ffffff', position: 'relative', minWidth: 0 }}>
        
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
                      
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <button type="button" style={{ background: '#fff', border: '1px solid #d4af37', color: '#d4af37', padding: '8px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', pointerEvents: 'none' }}>
                            CHOOSE FILE
                          </button>
                          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleProductImageChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                        </div>
                        
                        <button type="button" onClick={() => openGallery((url) => { setProductImagePreview(url); setProductImageFile(null); })} style={{ background: '#d4af37', border: '1px solid #d4af37', color: '#fff', padding: '8px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                          SELECT FROM GALLERY
                        </button>
                      </div>
                      
                      {productImageFile && <span style={{ display: 'block', marginTop: '10px', fontSize: '0.8rem', color: '#155724', fontWeight: 'bold' }}>✓ Selected: {productImageFile.name}</span>}
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
                          <label style={{...labelStyle, fontSize: '0.75rem'}}>Upload / Gallery</label>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                              <button type="button" style={{ background: '#fff', border: '1px solid #ccc', color: '#1a130d', padding: '12px 8px', borderRadius: '8px', fontWeight: 'bold', width: '100%', textAlign: 'center', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {sub.imgFile ? '✓ FILE SELECTED' : sub.imgPreview ? '✓ GALLERY SELECTED' : 'UPLOAD'}
                              </button>
                              <input type="file" accept="image/*" onChange={(e) => handleSubImageChange(index, e)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                            </div>
                            <button type="button" onClick={() => openGallery((url) => {
                              const newSubs = [...categoryData.subs];
                              newSubs[index].imgPreview = url;
                              newSubs[index].imgFile = null;
                              setCategoryData({ ...categoryData, subs: newSubs });
                            })} style={{ background: '#d4af37', border: '1px solid #d4af37', color: '#fff', padding: '12px 10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>
                              GALLERY
                            </button>
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

          {/* --- TOP SELLING TAB --- */}
          {activeTab === 'TOP_SELLING' && (
            <div className="fade-in">
              {!selectedTopCat ? (
                <div>
                  <div className="admin-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h1 style={headerStyle}>Top Selling Categories</h1>
                      <p style={{ color: '#666' }}>Manage categories and articles appearing on the Top Selling page.</p>
                    </div>
                  </div>

                  {/* Add New Category Form */}
                  <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', marginBottom: '30px' }}>
                    <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', marginBottom: '15px', color: '#1a130d', fontWeight: 'bold' }}>
                      {editingTopCatId ? 'EDIT TOP SELLING CATEGORY' : 'ADD NEW TOP SELLING CATEGORY'}
                    </h3>
                    <form onSubmit={handleSaveTopCategory} style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                      
                      {/* Image Preview & Selection */}
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '8px', border: '1px solid #eee', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', flexShrink: 0 }}>
                          {newTopCatImagePreview ? (
                            <img src={newTopCatImagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '1.2rem', color: '#ccc' }}>📷</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <div style={{ position: 'relative' }}>
                            <button type="button" style={{ background: '#fff', border: '1px solid #ccc', color: '#1a130d', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer' }}>
                              {newTopCatImageFile ? '✓ SELECTED' : 'UPLOAD'}
                            </button>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setNewTopCatImageFile(file);
                                  setNewTopCatImagePreview(URL.createObjectURL(file));
                                }
                              }} 
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
                            />
                          </div>
                          <button 
                            type="button" 
                            onClick={() => openGallery((url) => {
                              setNewTopCatImagePreview(url);
                              setNewTopCatImageFile(null);
                            })} 
                            style={{ background: '#d4af37', border: '1px solid #d4af37', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            GALLERY
                          </button>
                        </div>
                      </div>

                      {/* Text Input */}
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <input 
                          type="text" 
                          required 
                          placeholder="Enter Category name (e.g. FLOOR PLANTS)..." 
                          value={newTopCatName}
                          onChange={(e) => setNewTopCatName(e.target.value)}
                          style={inputStyle}
                        />
                      </div>

                      {/* Submit & Cancel Actions */}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" disabled={isUploading} className="premium-btn" style={{ padding: '12px 20px' }}>
                          {isUploading ? 'SAVING...' : editingTopCatId ? 'UPDATE CATEGORY' : 'ADD CATEGORY'}
                        </button>
                        {editingTopCatId && (
                          <button 
                            type="button" 
                            onClick={() => {
                              setEditingTopCatId(null);
                              setNewTopCatName('');
                              setNewTopCatImageFile(null);
                              setNewTopCatImagePreview(null);
                            }} 
                            className="back-btn"
                            style={{ padding: '12px 20px' }}
                          >
                            CANCEL
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  <div className="table-container" style={tableContainer}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead style={{ background: '#f8f9fa', borderBottom: '1px solid #eaeaea' }}>
                        <tr>
                          <th style={thStyle}>Image</th>
                          <th style={thStyle}>Category Name</th>
                          <th style={thStyle}>Subcategories Count</th>
                          <th style={thStyle}>Total Products</th>
                          <th style={thStyle}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topSellingCategories.map(c => {
                          const totalProds = c.subs ? c.subs.reduce((sum, s) => sum + (s.products?.length || 0), 0) : 0;
                          return (
                            <tr key={c._id} style={{ borderBottom: '1px solid #f0f0f0', background: '#fff' }}>
                              <td style={tdStyle}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '8px', border: '1px solid #eee', overflow: 'hidden', background: '#fff', padding: '2px' }}>
                                  {c.image ? (
                                    <img 
                                      src={c.image.startsWith('/') && !c.image.startsWith('/uploads') ? c.image : c.image.startsWith('http') || c.image.startsWith('data:') ? c.image : `${API_URL}${c.image}`} 
                                      alt="" 
                                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} 
                                    />
                                  ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', color: '#ccc', fontSize: '1.2rem', borderRadius: '6px' }}>📷</div>
                                  )}
                                </div>
                              </td>
                              <td style={{...tdStyle, fontWeight: 'bold', fontSize: '1.05rem', color: '#1a130d'}}>{c.name}</td>
                              <td style={tdStyle}>{c.subs ? c.subs.length : 0}</td>
                              <td style={tdStyle}><span style={badgeStyle}>{totalProds} Products</span></td>
                              <td style={tdStyle}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                  <button onClick={() => setSelectedTopCat(c)} className="edit-btn">Manage Items</button>
                                  <button onClick={() => handleEditTopCategoryTrigger(c)} className="edit-btn" style={{ background: 'rgba(0,0,0,0.03)', color: '#444', borderColor: '#ccc' }}>Edit</button>
                                  <button onClick={() => handleDeleteTopCategory(c._id)} className="delete-btn">Delete</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {topSellingCategories.length === 0 && <tr><td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#666', background: '#fff' }}>No top selling categories found.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // Detailed subcategories & product management view for a specific category
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#d4af37', letterSpacing: '2px', fontWeight: 'bold', textTransform: 'uppercase' }}>TOP SELLING CATEGORY</span>
                      <h1 style={headerStyle}>{selectedTopCat.name}</h1>
                    </div>
                    <button onClick={() => setSelectedTopCat(null)} className="back-btn">← Back to Categories</button>
                  </div>

                  {/* Add Subcategory Form */}
                  <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', marginBottom: '30px' }}>
                    <form onSubmit={handleAddTopSub} style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '250px' }}>
                        <input 
                          type="text" 
                          required 
                          placeholder="Add a new Subcategory (e.g. Luxe Palms, Geometric Vases)..." 
                          value={newSubName}
                          onChange={(e) => setNewSubName(e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <button type="submit" disabled={isUploading} className="premium-btn">
                        {isUploading ? 'ADDING...' : '+ ADD SUBCATEGORY'}
                      </button>
                    </form>
                  </div>

                  {/* Subcategories & Products Grid */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {selectedTopCat.subs && selectedTopCat.subs.map((sub, subIdx) => (
                      <div key={subIdx} style={{ background: '#fff', borderRadius: '15px', border: '1px solid #eaeaea', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', margin: 0, fontWeight: 'bold' }}>{sub.name}</h2>
                            <span style={badgeStyle}>{sub.products?.length || 0} Products</span>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => handleRenameTopSub(subIdx)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>✏️ Rename</button>
                            <button onClick={() => handleDeleteTopSub(subIdx)} style={{ background: 'none', border: 'none', color: '#cc0000', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>🗑️ Delete</button>
                            <button onClick={() => handleOpenAddTopProduct(subIdx)} className="premium-btn" style={{ padding: '8px 15px', fontSize: '0.8rem' }}>+ ADD PRODUCT</button>
                          </div>
                        </div>

                        {/* Products List inside Subcategory */}
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '10px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888' }}>Image</th>
                                <th style={{ padding: '10px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888' }}>Product Name</th>
                                <th style={{ padding: '10px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888' }}>Price</th>
                                <th style={{ padding: '10px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sub.products && sub.products.map((prod, prodIdx) => (
                                <tr key={prodIdx} style={{ borderBottom: '1px solid #fcfcfc' }}>
                                  <td style={{ padding: '10px' }}>
                                    <div style={{ width: '45px', height: '45px', borderRadius: '6px', border: '1px solid #eee', overflow: 'hidden' }}>
                                      <img src={prod.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                  </td>
                                  <td style={{ padding: '10px', fontWeight: 'bold', color: '#1a130d' }}>{prod.name}</td>
                                  <td style={{ padding: '10px', color: '#d4af37', fontWeight: 'bold' }}>{prod.price}</td>
                                  <td style={{ padding: '10px' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                      <button onClick={() => handleEditTopProduct(subIdx, prodIdx)} className="edit-btn" style={{ padding: '5px 10px', fontSize: '0.75rem' }}>Edit</button>
                                      <button onClick={() => handleDeleteTopProduct(subIdx, prodIdx)} className="delete-btn" style={{ padding: '5px 10px', fontSize: '0.75rem' }}>Delete</button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {(!sub.products || sub.products.length === 0) && (
                                <tr>
                                  <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#888', fontStyle: 'italic' }}>No products in this subcategory. Click "+ Add Product" to create one.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                    {(!selectedTopCat.subs || selectedTopCat.subs.length === 0) && (
                      <div style={{ background: '#fff', padding: '50px', textAlign: 'center', borderRadius: '15px', border: '1px solid #eaeaea', color: '#666' }}>
                        <span style={{ fontSize: '3rem' }}>📂</span>
                        <h3 style={{ marginTop: '15px', fontFamily: 'Cinzel, serif', fontWeight: 'bold' }}>No Subcategories Yet</h3>
                        <p style={{ maxWidth: '400px', margin: '10px auto' }}>Create a subcategory first using the form above to start adding top selling products.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

      {/* TOP SELLING PRODUCT ADD/EDIT MODAL */}
      {showTopProductForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', width: '90%', maxWidth: '550px', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', border: '1px solid rgba(212,175,55,0.2)', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ fontFamily: 'Cinzel, serif', color: '#1a130d', margin: 0, fontSize: '1.6rem', fontWeight: 'bold' }}>
                {editingTopProductIndex !== null ? 'EDIT' : 'ADD'} <span style={{ color: '#d4af37' }}>PRODUCT</span>
              </h2>
              <button onClick={() => setShowTopProductForm(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#1a130d' }}>✕</button>
            </div>
            
            <form onSubmit={handleSaveTopProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Product Name *</label>
                <input 
                  type="text" 
                  required 
                  value={topProductData.name} 
                  onChange={(e) => setTopProductData({ ...topProductData, name: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. Luxe Floor Palm"
                />
              </div>

              <div>
                <label style={labelStyle}>Price *</label>
                <input 
                  type="text" 
                  required 
                  value={topProductData.price} 
                  onChange={(e) => setTopProductData({ ...topProductData, price: e.target.value })}
                  style={inputStyle}
                  placeholder="₹180"
                />
              </div>

              <div>
                <label style={labelStyle}>Product Image *</label>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '15px', background: '#fafafa', borderRadius: '10px', border: '1px dashed #ccc' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '8px', background: '#fff', border: '1px solid #eee', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {topProductImagePreview ? (
                      <img src={topProductImagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '1.5rem', color: '#ccc' }}>📷</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <button type="button" style={{ background: '#fff', border: '1px solid #ccc', color: '#1a130d', padding: '10px 5px', borderRadius: '5px', fontWeight: 'bold', width: '100%', fontSize: '0.75rem', cursor: 'pointer' }}>
                          {topProductImageFile ? '✓ SELECTED' : 'UPLOAD'}
                        </button>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setTopProductImageFile(file);
                              setTopProductImagePreview(URL.createObjectURL(file));
                            }
                          }} 
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => openGallery((url) => {
                          setTopProductImagePreview(url);
                          setTopProductImageFile(null);
                        })} 
                        style={{ background: '#d4af37', border: '1px solid #d4af37', color: '#fff', padding: '10px 15px', borderRadius: '5px', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        GALLERY
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button type="submit" disabled={isUploading} className="premium-btn" style={{ flex: 1, padding: '15px' }}>
                  {isUploading ? 'SAVING...' : 'SAVE PRODUCT'}
                </button>
                <button type="button" onClick={() => setShowTopProductForm(false)} className="back-btn" style={{ flex: 1, padding: '15px' }}>
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

          {/* --- SIGNATURE PIECES TAB --- */}
          {activeTab === 'SIGNATURE_PIECES' && (
            <div className="fade-in" style={{ maxWidth: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(212,175,55,0.15)', paddingBottom: '20px' }}>
                <div>
                  <h2 className="signature-title" style={{ fontFamily: 'Cinzel, serif', color: '#1a130d', margin: 0, fontSize: '2.4rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                    SIGNATURE <span style={{ color: '#d4af37' }}>PIECES</span>
                  </h2>
                  <p style={{ color: '#666', fontSize: '0.95rem', marginTop: '6px', fontFamily: 'Montserrat, sans-serif' }}>
                    Curate the exclusive array of 10 masterpiece floral designs displayed prominently on the homepage.
                  </p>
                </div>
              </div>

              {/* Progress and status */}
              <div className="signature-status-card" style={{ background: '#fff', padding: '20px 24px', borderRadius: '16px', border: '1px solid rgba(212,175,55,0.18)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', marginBottom: '35px' }}>
                <div className="showcase-status-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontWeight: '800', fontSize: '1rem', color: '#1a130d', letterSpacing: '0.5px' }}>
                    Masterpiece Showcase Status
                  </span>
                  <span style={{ fontWeight: '800', color: '#d4af37', fontSize: '1.05rem', background: '#1a130d', padding: '4px 12px', borderRadius: '20px', border: '1px solid #d4af37' }}>
                    {signatureMasterpieces.length} / 10 Products Selected
                  </span>
                </div>
                <div style={{ width: '100%', height: '10px', background: '#f5f5f5', borderRadius: '5px', overflow: 'hidden', border: '1px solid #eee' }}>
                  <div style={{ width: `${(signatureMasterpieces.length / 10) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #b8860b, #d4af37, #fde08d)', borderRadius: '5px', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                </div>
                {signatureMasterpieces.length < 10 && (
                  <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px', fontStyle: 'italic' }}>
                    💡 Tip: We recommend selecting exactly 10 premium products to create a perfectly balanced homepage display.
                  </p>
                )}
              </div>

              <div className="signature-pieces-grid">
                {/* CURRENT LIST WITH REORDERING & REMOVAL */}
                <div className="signature-card" style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 45px rgba(0,0,0,0.02)' }}>
                  <h3 className="card-header-flex" style={{ fontFamily: 'Cinzel, serif', color: '#1a130d', fontSize: '1.4rem', borderBottom: '2px solid #fcf9f2', paddingBottom: '18px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                    <span>Selected Masterpieces</span>
                    <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'none', fontFamily: 'Montserrat, sans-serif', fontWeight: 'normal' }}>Adjust homepage display order</span>
                  </h3>

                  {signatureMasterpieces.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', color: '#999', background: '#fafafa', borderRadius: '12px', border: '2px dashed #eee' }}>
                      <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>💎</span>
                      No signature masterpieces selected yet. Select products from the collection catalog on the right.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {signatureMasterpieces.map((item, idx) => (
                        <div 
                          key={item._id} 
                          className="masterpiece-item"
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            padding: '16px 20px', 
                            background: '#ffffff', 
                            borderRadius: '12px', 
                            border: '1px solid rgba(212,175,55,0.15)', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.01)', 
                            transition: 'all 0.25s ease', 
                            position: 'relative' 
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#d4af37';
                            e.currentTarget.style.boxShadow = '0 6px 18px rgba(212,175,55,0.08)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'rgba(212,175,55,0.15)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.01)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <div className="masterpiece-info-wrapper" style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                            {/* Thumbnail with Index Rank */}
                            <div style={{ position: 'relative', marginRight: '20px', flexShrink: 0 }}>
                              <img 
                                src={item.image ? (item.image.startsWith('/') && !item.image.startsWith('/uploads') ? item.image : item.image.startsWith('http') || item.image.startsWith('data:') ? item.image : `${API_URL}${item.image}`) : ''} 
                                alt="" 
                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.2)', display: 'block' }}
                              />
                              <div style={{
                                position: 'absolute',
                                top: '-6px',
                                left: '-6px',
                                background: '#1a130d',
                                color: '#d4af37',
                                border: '1px solid #d4af37',
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                              }}>
                                {idx + 1}
                              </div>
                            </div>

                            <div style={{ flex: 1, minWidth: 0, marginRight: '15px' }}>
                              <p style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#1a130d', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Montserrat, sans-serif' }}>
                                {item.name}
                              </p>
                              <p style={{ fontSize: '0.8rem', color: '#666', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>{item.category}</span>
                                <span style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '0.9rem' }}>{item.price}</span>
                              </p>
                            </div>
                          </div>

                          {/* Reordering and removal controls */}
                          <div className="masterpiece-controls-wrapper" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                              disabled={idx === 0}
                              onClick={async () => {
                                const newIds = signatureMasterpieces.map(p => p._id);
                                const temp = newIds[idx];
                                newIds[idx] = newIds[idx - 1];
                                newIds[idx - 1] = temp;
                                try {
                                  await updateSignatureMasterpieces(newIds);
                                  showMsg('Order updated!');
                                } catch (err) {
                                  showMsg('Failed to update order.', 'error');
                                }
                              }}
                              style={{
                                width: '34px',
                                height: '34px',
                                background: idx === 0 ? '#f9f9f9' : 'rgba(212,175,55,0.06)',
                                color: idx === 0 ? '#ccc' : '#d4af37',
                                border: '1px solid ' + (idx === 0 ? '#eee' : 'rgba(212,175,55,0.15)'),
                                borderRadius: '8px',
                                cursor: idx === 0 ? 'not-allowed' : 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: 'bold',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              onMouseEnter={e => { if (idx !== 0) { e.currentTarget.style.background = '#d4af37'; e.currentTarget.style.color = '#fff'; } }}
                              onMouseLeave={e => { if (idx !== 0) { e.currentTarget.style.background = 'rgba(212,175,55,0.06)'; e.currentTarget.style.color = '#d4af37'; } }}
                              title="Move Up"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                            </button>
                            <button
                              disabled={idx === signatureMasterpieces.length - 1}
                              onClick={async () => {
                                const newIds = signatureMasterpieces.map(p => p._id);
                                const temp = newIds[idx];
                                newIds[idx] = newIds[idx + 1];
                                newIds[idx + 1] = temp;
                                try {
                                  await updateSignatureMasterpieces(newIds);
                                  showMsg('Order updated!');
                                } catch (err) {
                                  showMsg('Failed to update order.', 'error');
                                }
                              }}
                              style={{
                                width: '34px',
                                height: '34px',
                                background: idx === signatureMasterpieces.length - 1 ? '#f9f9f9' : 'rgba(212,175,55,0.06)',
                                color: idx === signatureMasterpieces.length - 1 ? '#ccc' : '#d4af37',
                                border: '1px solid ' + (idx === signatureMasterpieces.length - 1 ? '#eee' : 'rgba(212,175,55,0.15)'),
                                borderRadius: '8px',
                                cursor: idx === signatureMasterpieces.length - 1 ? 'not-allowed' : 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: 'bold',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              onMouseEnter={e => { if (idx !== signatureMasterpieces.length - 1) { e.currentTarget.style.background = '#d4af37'; e.currentTarget.style.color = '#fff'; } }}
                              onMouseLeave={e => { if (idx !== signatureMasterpieces.length - 1) { e.currentTarget.style.background = 'rgba(212,175,55,0.06)'; e.currentTarget.style.color = '#d4af37'; } }}
                              title="Move Down"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                            <button
                              onClick={async () => {
                                const newIds = signatureMasterpieces.filter(p => p._id !== item._id).map(p => p._id);
                                try {
                                  await updateSignatureMasterpieces(newIds);
                                  showMsg('Product removed from masterpieces!');
                                } catch (err) {
                                  showMsg('Failed to remove product.', 'error');
                                }
                              }}
                              style={{
                                width: '34px',
                                height: '34px',
                                background: 'rgba(220,53,69,0.04)',
                                color: '#dc3545',
                                border: '1px solid rgba(220,53,69,0.12)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: 'bold',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: '4px'
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#dc3545'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#dc3545'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,53,69,0.04)'; e.currentTarget.style.color = '#dc3545'; e.currentTarget.style.borderColor = 'rgba(220,53,69,0.12)'; }}
                              title="Remove"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SEARCH CATALOG & ADD PRODUCTS */}
                <div className="signature-card" style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 45px rgba(0,0,0,0.02)' }}>
                  <h3 style={{ fontFamily: 'Cinzel, serif', color: '#1a130d', fontSize: '1.4rem', borderBottom: '2px solid #fcf9f2', paddingBottom: '18px', marginBottom: '25px', fontWeight: 'bold' }}>
                    Add from Collection
                  </h3>

                  {/* Search and Filters */}
                  <div className="catalog-filters">
                    <div style={{ position: 'relative', flex: 1.3 }}>
                      <input 
                        type="text" 
                        placeholder="Search catalog products..." 
                        value={masterpieceSearch}
                        onChange={(e) => setMasterpieceSearch(e.target.value)}
                        style={{ 
                          width: '100%', 
                          padding: '14px 16px 14px 40px', 
                          border: '1px solid rgba(212,175,55,0.25)', 
                          borderRadius: '10px', 
                          fontSize: '0.95rem', 
                          outline: 'none', 
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.12)'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)'; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                      <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#8a6d3b', fontSize: '1.1rem' }}>🔍</span>
                    </div>
                    
                    <select
                      value={masterpieceCategory}
                      onChange={(e) => setMasterpieceCategory(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '14px 16px', 
                        border: '1px solid rgba(212,175,55,0.25)', 
                        borderRadius: '10px', 
                        fontSize: '0.95rem', 
                        background: '#fff url("data:image/svg+xml;utf8,<svg fill=%27%238a6d3b%27 height=%2724%27 viewBox=%270 0 24 24%27 width=%2724%27 xmlns=%27http://www.w3.org/2000/svg%27><path d=%27M7 10l5 5 5-5z%27/></svg>") no-repeat right 15px center',
                        appearance: 'none',
                        outline: 'none',
                        color: '#1a130d',
                        flex: 1
                      }}
                    >
                      <option value="ALL">All Categories</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Products list */}
                  <div 
                    className="fancy-scroll"
                    style={{ 
                      maxHeight: '520px', 
                      overflowY: 'auto', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '12px', 
                      paddingRight: '6px' 
                    }}
                  >
                    {products
                      .filter(p => {
                        const matchesSearch = p.name.toLowerCase().includes(masterpieceSearch.toLowerCase());
                        const matchesCat = masterpieceCategory === 'ALL' || p.category === masterpieceCategory;
                        return matchesSearch && matchesCat;
                      })
                      .map((product) => {
                        const isAlreadySelected = signatureMasterpieces.some(p => p._id === product._id);
                        const isLimitReached = signatureMasterpieces.length >= 10;
                        
                        return (
                          <div 
                            key={product._id} 
                            className="catalog-item"
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              padding: '12px 16px', 
                              background: '#fafafa', 
                              borderRadius: '10px', 
                              border: '1px solid #eeeeee',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; e.currentTarget.style.background = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#eeeeee'; e.currentTarget.style.background = '#fafafa'; }}
                          >
                            <div className="catalog-info-wrapper" style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                              <img 
                                src={product.image ? (product.image.startsWith('/') && !product.image.startsWith('/uploads') ? product.image : product.image.startsWith('http') || product.image.startsWith('data:') ? product.image : `${API_URL}${product.image}`) : ''} 
                                alt="" 
                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', marginRight: '15px', border: '1px solid rgba(0,0,0,0.05)' }}
                              />
                              <div style={{ flex: 1, minWidth: 0, marginRight: '10px' }}>
                                <p style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#1a130d', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
                                <p style={{ fontSize: '0.75rem', color: '#888', margin: '2px 0 0' }}>{product.category} • <strong style={{ color: '#d4af37' }}>{product.price}</strong></p>
                              </div>
                            </div>
                            
                            <div className="catalog-button-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                              {isAlreadySelected ? (
                                <button 
                                  disabled 
                                  style={{ 
                                    padding: '8px 14px', 
                                    background: 'rgba(212,175,55,0.08)', 
                                    color: '#b8860b', 
                                    border: '1px solid rgba(212,175,55,0.2)', 
                                    borderRadius: '6px', 
                                    fontSize: '0.75rem', 
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  ✓ Added
                                </button>
                              ) : (
                                <button
                                  disabled={isLimitReached}
                                  onClick={async () => {
                                    const newIds = [...signatureMasterpieces.map(p => p._id), product._id];
                                    try {
                                      await updateSignatureMasterpieces(newIds);
                                      showMsg('Product added to masterpieces!');
                                    } catch (err) {
                                      showMsg('Failed to add product.', 'error');
                                    }
                                  }}
                                  style={{ 
                                    padding: '8px 14px', 
                                    background: isLimitReached ? '#f5f5f5' : '#1a130d', 
                                    color: isLimitReached ? '#ccc' : '#d4af37', 
                                    border: isLimitReached ? '1px solid #ddd' : '1px solid #1a130d', 
                                    borderRadius: '6px', 
                                    fontSize: '0.75rem', 
                                    fontWeight: 'bold', 
                                    cursor: isLimitReached ? 'not-allowed' : 'pointer', 
                                    transition: 'all 0.2s ease' 
                                  }}
                                  onMouseEnter={e => { if (!isLimitReached) { e.currentTarget.style.background = '#d4af37'; e.currentTarget.style.color = '#1a130d'; e.currentTarget.style.borderColor = '#d4af37'; } }}
                                  onMouseLeave={e => { if (!isLimitReached) { e.currentTarget.style.background = '#1a130d'; e.currentTarget.style.color = '#d4af37'; e.currentTarget.style.borderColor = '#1a130d'; } }}
                                >
                                  {isLimitReached ? 'Full' : '+ Add'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    {products.filter(p => {
                      const matchesSearch = p.name.toLowerCase().includes(masterpieceSearch.toLowerCase());
                      const matchesCat = masterpieceCategory === 'ALL' || p.category === masterpieceCategory;
                      return matchesSearch && matchesCat;
                    }).length === 0 && (
                      <div style={{ textAlign: 'center', padding: '45px 20px', color: '#999', fontSize: '0.9rem', background: '#fafafa', borderRadius: '8px', border: '1px dashed #eee' }}>
                        No matching products found in catalog.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* REUSABLE IMAGE GALLERY SELECTOR MODAL */}
      {isGalleryOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', width: '90%', maxWidth: '800px', maxHeight: '80%', borderRadius: '15px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', border: '1px solid rgba(212,175,55,0.2)', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'Cinzel, serif', color: '#1a130d', margin: 0, fontSize: '1.6rem', fontWeight: 'bold' }}>IMAGE <span style={{ color: '#d4af37' }}>GALLERY</span></h2>
              <button 
                onClick={() => { setIsGalleryOpen(false); setGallerySearch(''); }} 
                style={{ 
                  background: 'rgba(0,0,0,0.05)', 
                  border: 'none', 
                  fontSize: '1.1rem', 
                  cursor: 'pointer', 
                  color: '#1a130d',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s, transform 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.15)'; e.currentTarget.style.transform = 'rotate(90deg)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'rotate(0deg)'; }}
              >
                ✕
              </button>
            </div>
            
            <input 
              type="text" 
              placeholder="Search images by name..." 
              value={gallerySearch} 
              onChange={(e) => setGallerySearch(e.target.value)} 
              style={{ 
                width: '100%', 
                padding: '12px 15px', 
                border: '1px solid #e0e0e0', 
                borderRadius: '8px', 
                marginBottom: '20px', 
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.15)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none'; }}
            />

            <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gridAutoRows: '130px', gap: '15px', padding: '10px' }}>
              {/* Direct Device Upload Card */}
              <div 
                style={{ 
                  position: 'relative', 
                  height: '130px',
                  width: '100%',
                  borderRadius: '8px', 
                  border: '2px dashed #d4af37', 
                  background: 'rgba(212, 175, 55, 0.03)',
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s, transform 0.2s',
                  padding: '10px',
                  textAlign: 'center'
                }}
                onMouseEnter={e => { if (!isUploading) { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)'; e.currentTarget.style.transform = 'scale(1.03)'; } }}
                onMouseLeave={e => { if (!isUploading) { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.03)'; e.currentTarget.style.transform = 'scale(1)'; } }}
              >
                {isUploading ? (
                  <>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      border: '2px solid rgba(212, 175, 55, 0.2)',
                      borderTop: '2px solid #d4af37',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginBottom: '8px'
                    }} />
                    <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: 'bold' }}>Uploading...</span>
                  </>
                ) : (
                  <>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setIsUploading(true);
                          try {
                            const imageUrl = await uploadImage(file);
                            if (galleryTargetCallback) {
                              galleryTargetCallback(imageUrl);
                            }
                            setIsGalleryOpen(false);
                            setGallerySearch('');
                            refetchData();
                          } catch (err) {
                            showMsg('Failed to upload image.', 'error');
                          } finally {
                            setIsUploading(false);
                          }
                        }
                      }}
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '2rem', marginBottom: '4px' }}>📤</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#d4af37' }}>Upload from Phone</span>
                  </>
                )}
              </div>

              {galleryImages.filter(img => img.toLowerCase().includes(gallerySearch.toLowerCase())).map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => { 
                    if (galleryTargetCallback) galleryTargetCallback(img); 
                    setIsGalleryOpen(false); 
                    setGallerySearch('');
                  }} 
                  style={{ 
                    position: 'relative', 
                    height: '130px',
                    width: '100%',
                    borderRadius: '8px', 
                    border: '1px solid #eaeaea', 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, transform 0.2s',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.borderColor = '#d4af37'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = '#eaeaea'; }}
                >
                  <img src={img.startsWith('/') && !img.startsWith('/uploads') ? img : img.startsWith('http') || img.startsWith('data:') ? img : `${API_URL}${img}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
              {galleryImages.filter(img => img.toLowerCase().includes(gallerySearch.toLowerCase())).length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#888' }}>No images found in library.</div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .admin-main {
          flex: 1;
          padding: 24px 24px 24px 16px;
          overflow-y: auto;
          overflow-x: hidden;
          background: #ffffff;
          position: relative;
          min-width: 0;
        }
        @media (max-width: 1200px) {
          .admin-main {
            padding: 16px 16px 16px 12px;
          }
        }
        .signature-pieces-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 16px;
          align-items: start;
        }
        @media (max-width: 1350px) {
          .signature-pieces-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        .signature-card {
          padding: 20px !important;
        }
        .signature-status-card {
          padding: 20px 24px !important;
        }
        .catalog-info-wrapper {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 0;
        }
        .catalog-button-wrapper {
          display: flex;
          align-items: center;
        }
        .catalog-filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 25px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
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
        
        @media (max-width: 576px) {
          .showcase-status-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .showcase-status-header span {
            width: 100% !important;
          }
          .showcase-status-header span:last-child {
            text-align: center !important;
            box-sizing: border-box !important;
          }
          .card-header-flex {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
          .card-header-flex span {
            width: 100% !important;
          }
          .card-header-flex span:last-child {
            text-align: left !important;
          }
          .masterpiece-item {
            flex-direction: column !important;
            align-items: stretch !important;
            padding: 12px !important;
          }
          .masterpiece-info-wrapper {
            width: 100% !important;
            margin-bottom: 12px !important;
          }
          .masterpiece-controls-wrapper {
            justify-content: flex-end !important;
            border-top: 1px solid #f5f5f5 !important;
            padding-top: 10px !important;
          }
          .catalog-filters {
            grid-template-columns: 1fr !important;
          }
          .catalog-item {
            flex-direction: column !important;
            align-items: stretch !important;
            padding: 12px !important;
          }
          .catalog-info-wrapper {
            width: 100% !important;
            margin-bottom: 12px !important;
          }
          .catalog-button-wrapper {
            justify-content: flex-end !important;
            border-top: 1px solid #f5f5f5 !important;
            padding-top: 10px !important;
          }
          .signature-card {
            padding: 12px !important;
          }
          .signature-status-card {
            padding: 12px !important;
          }
          .signature-title {
            font-size: clamp(1.6rem, 5vw, 2.4rem) !important;
          }
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
