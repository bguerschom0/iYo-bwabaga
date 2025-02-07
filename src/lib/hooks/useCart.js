import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase/client';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      // Load cart from localStorage for non-authenticated users
      const localCart = localStorage.getItem('cart');
      setCartItems(localCart ? JSON.parse(localCart) : []);
      setLoading(false);
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1, size) => {
    if (user) {
      try {
        // Check if item already exists in cart
        const existingItem = cartItems.find(
          item => item.product_id === product.id && item.size === size
        );

        if (existingItem) {
          const { error } = await supabase
            .from('cart')
            .update({ quantity: existingItem.quantity + quantity })
            .eq('id', existingItem.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('cart')
            .insert({
              user_id: user.id,
              product_id: product.id,
              quantity,
              size
            });

          if (error) throw error;
        }

        await fetchCartItems();
      } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
      }
    } else {
      // Handle non-authenticated cart
      const newItem = {
        id: Date.now(),
        product_id: product.id,
        product,
        quantity,
        size
      };

      const updatedCart = [...cartItems];
      const existingItemIndex = cartItems.findIndex(
        item => item.product_id === product.id && item.size === size
      );

      if (existingItemIndex >= 0) {
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        updatedCart.push(newItem);
      }

      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('cart')
          .update({ quantity })
          .eq('id', itemId);

        if (error) throw error;
        await fetchCartItems();
      } catch (error) {
        console.error('Error updating quantity:', error);
        throw error;
      }
    } else {
      const updatedCart = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const removeItem = async (itemId) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('id', itemId);

        if (error) throw error;
        await fetchCartItems();
      } catch (error) {
        console.error('Error removing item:', error);
        throw error;
      }
    } else {
      const updatedCart = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
        setCartItems([]);
      } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
      }
    } else {
      setCartItems([]);
      localStorage.removeItem('cart');
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const value = {
    cartItems,
    cartItemsCount: cartItems.length,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
