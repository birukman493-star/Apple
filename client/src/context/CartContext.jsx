import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('apple_bag');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading bag from localStorage:', e);
      return [];
    }
  });

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('apple_bag', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving bag to localStorage:', e);
    }
  }, [cart]);

  // Add item to cart
  const addToCart = (product, quantity = 1, options = {}) => {
    if (!product) return;

    setCart((prevCart) => {
      const productId = product.id || product.productId;
      const title = product.title || product.name || 'Apple Product';
      const price = parseFloat(product.discount_price ?? product.price_upfront ?? product.price ?? 0);
      const image = product.image_url || product.image || product.imageMain || '';

      const existingIndex = prevCart.findIndex((item) => {
        const sameId = (item.productId || item.id) === productId;
        const sameOptions = JSON.stringify(item.options || {}) === JSON.stringify(options);
        return sameId && sameOptions;
      });

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }

      return [
        ...prevCart,
        {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          productId: productId,
          title: title,
          price: price,
          quantity: quantity,
          image: image,
          category: product.category || 'Accessories',
          badge: product.badge_text || product.badge || null,
          options: options
        }
      ];
    });
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId || item.productId === itemId
          ? { ...item, quantity: Math.min(10, qty) }
          : item
      )
    );
  };

  // Remove item
  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId && item.productId !== itemId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculated values
  const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price || 0) * (item.quantity || 1)), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

