import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    const cartId = `${product.name}_${product.selectedColor || 'Default'}`;
    setCartItems(prev => {
      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        return prev.map(item =>
          item.cartId === cartId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, cartId, qty: 1 }];
    });
  };

  const increaseQty = (cartId) => {
    setCartItems(prev =>
      prev.map(item =>
        item.cartId === cartId ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (cartId) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.cartId === cartId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter(item => item.qty > 0)
    );
  };

  const removeFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
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
