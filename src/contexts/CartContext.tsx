import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (project: Project) => void;
  removeFromCart: (projectId: string) => void;
  updateQuantity: (projectId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('ZipMyProject_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ZipMyProject_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (project: Project) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.project.id === project.id);
      if (existingItem) {
        return prev.map(item =>
          item.project.id === project.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { project, quantity: 1 }];
    });
  };

  const removeFromCart = (projectId: string) => {
    setCartItems(prev => prev.filter(item => item.project.id !== projectId));
  };

  const updateQuantity = (projectId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(projectId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.project.id === projectId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.project.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};