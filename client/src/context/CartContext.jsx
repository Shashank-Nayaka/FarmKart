import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('farmkart_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('farmkart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (product.stock <= 0) {
      alert('This product is currently out of stock.');
      return false;
    }

    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x._id === product._id);
      if (existItem) {
        const newQty = existItem.qty + quantity;
        if (newQty > product.stock) {
          alert(`Only ${product.stock} units available in stock.`);
          return prevItems.map((x) =>
            x._id === product._id ? { ...x, qty: product.stock } : x
          );
        }
        return prevItems.map((x) =>
          x._id === product._id ? { ...x, qty: newQty } : x
        );
      } else {
        const addQty = Math.min(quantity, product.stock);
        return [...prevItems, { ...product, qty: addQty }];
      }
    });

    setIsCartOpen(true);
    return true;
  };

  const updateQuantity = (productId, newQty, maxStock) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    if (newQty > maxStock) {
      alert(`Only ${maxStock} units available in stock.`);
      newQty = maxStock;
    }
    setCartItems((prev) =>
      prev.map((item) => (item._id === productId ? { ...item, qty: newQty } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryPrice = itemsPrice >= 500 || itemsPrice === 0 ? 0 : 50;
  const totalPrice = itemsPrice + deliveryPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemsCount,
        itemsPrice,
        deliveryPrice,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
