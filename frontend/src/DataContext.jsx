import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error("Error deleting product", err);
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      console.error("Error deleting category", err);
      throw err;
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, updatedData);
      fetchData();
    } catch (err) {
      console.error("Error updating product", err);
      throw err;
    }
  };

  const updateCategory = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/categories/${id}`, updatedData);
      fetchData();
    } catch (err) {
      console.error("Error updating category", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ products, categories, loading, refetchData: fetchData, deleteProduct, deleteCategory, updateProduct, updateCategory }}>
      {children}
    </DataContext.Provider>
  );
};
