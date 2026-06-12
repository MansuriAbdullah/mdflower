import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext();

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
  if (img.startsWith('data:') || img.startsWith('http')) return img;
  if (img.startsWith('/uploads') || img.startsWith('/api/images')) {
    return `${API_URL}${img}`;
  }
  if (img.startsWith('/')) return img; // local public asset
  return `${API_URL}/${img}`; // default backend fallback
};

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topSellingCategories, setTopSellingCategories] = useState([]);
  const [signatureMasterpieces, setSignatureMasterpieces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, topSellingRes, masterpiecesRes] = await Promise.all([
        axios.get(`${API_URL}/api/products`),
        axios.get(`${API_URL}/api/categories`),
        axios.get(`${API_URL}/api/top-selling`),
        axios.get(`${API_URL}/api/signature-masterpieces`)
      ]);
      
      const resolvedProducts = prodRes.data.map(p => ({
        ...p,
        image: resolveImageUrl(p.image)
      }));
      
      const resolvedCategories = catRes.data.map(c => ({
        ...c,
        subs: c.subs ? c.subs.map(s => ({ ...s, img: resolveImageUrl(s.img) })) : []
      }));
      
      const resolvedTopSelling = topSellingRes.data.map(tc => ({
        ...tc,
        image: resolveImageUrl(tc.image),
        subs: tc.subs ? tc.subs.map(sub => ({
          ...sub,
          products: sub.products ? sub.products.map(p => ({ ...p, image: resolveImageUrl(p.image) })) : []
        })) : []
      }));
      
      const resolvedMasterpieces = masterpiecesRes.data.map(p => ({
        ...p,
        image: resolveImageUrl(p.image)
      }));

      setProducts(resolvedProducts);
      setCategories(resolvedCategories);
      setTopSellingCategories(resolvedTopSelling);
      setSignatureMasterpieces(resolvedMasterpieces);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error("Error deleting product", err);
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      console.error("Error deleting category", err);
      throw err;
    }
  };

  const deleteTopSellingCategory = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/top-selling/${id}`);
      setTopSellingCategories(topSellingCategories.filter(c => c._id !== id));
    } catch (err) {
      console.error("Error deleting top selling category", err);
      throw err;
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      await axios.put(`${API_URL}/api/products/${id}`, updatedData);
      fetchData();
    } catch (err) {
      console.error("Error updating product", err);
      throw err;
    }
  };

  const updateCategory = async (id, updatedData) => {
    try {
      await axios.put(`${API_URL}/api/categories/${id}`, updatedData);
      fetchData();
    } catch (err) {
      console.error("Error updating category", err);
      throw err;
    }
  };

  const updateTopSellingCategory = async (id, updatedData) => {
    try {
      await axios.put(`${API_URL}/api/top-selling/${id}`, updatedData);
      fetchData();
    } catch (err) {
      console.error("Error updating top selling category", err);
      throw err;
    }
  };

  const updateSignatureMasterpieces = async (productIds) => {
    try {
      const res = await axios.put(`${API_URL}/api/signature-masterpieces`, { productIds });
      setSignatureMasterpieces(res.data);
    } catch (err) {
      console.error("Error updating signature masterpieces", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ 
      products, 
      categories, 
      topSellingCategories, 
      signatureMasterpieces,
      loading, 
      refetchData: fetchData, 
      deleteProduct, 
      deleteCategory, 
      deleteTopSellingCategory,
      updateProduct, 
      updateCategory,
      updateTopSellingCategory,
      updateSignatureMasterpieces
    }}>
      {children}
    </DataContext.Provider>
  );
};
