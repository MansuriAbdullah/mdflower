import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.name === product.name);
      if (existing) {
        return prev.map(item =>
          item.name === product.name ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const increaseQty = (name) => {
    setCartItems(prev =>
      prev.map(item =>
        item.name === name ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (name) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.name === name ? { ...item, qty: item.qty - 1 } : item
        )
        .filter(item => item.qty > 0)
    );
  };

  const removeFromCart = (name) => {
    setCartItems(prev => prev.filter(item => item.name !== name));
  };

  const clearCart = () => setCartItems([]);

  const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, increaseQty, decreaseQty,
      removeFromCart, clearCart, totalCount, isCartOpen, setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};
