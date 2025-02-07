import React, { useState, useEffect } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch cart items from local storage or API
    const fetchCartItems = async () => {
      try {
        // This will be replaced with actual API call
        const items = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
    // Update localStorage or API
  };

  const removeItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    // Update localStorage or API
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10; // Example shipping cost
  const tax = subtotal * 0.15; // Example tax rate (15%)
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sandbeige-50">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-sandbeige-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-sandbeige-900 mb-4">Your Cart is Empty</h2>
            <p className="text-sandbeige-600 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/products">
              <Button className="bg-sandbeige-800 hover:bg-sandbeige-900 text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sandbeige-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-sandbeige-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="divide-y divide-sandbeige-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="ml-6 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-sandbeige-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-sandbeige-600 mt-1">
                            Size: {item.size}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sandbeige-400 hover:text-sandbeige-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 border border-sandbeige-200 rounded-md"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sandbeige-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 border border-sandbeige-200 rounded-md"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-lg font-medium text-sandbeige-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-medium text-sandbeige-900 mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sandbeige-600">Subtotal</span>
                  <span className="text-sandbeige-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sandbeige-600">Shipping</span>
                  <span className="text-sandbeige-900">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sandbeige-600">Tax</span>
                  <span className="text-sandbeige-900">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-sandbeige-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-sandbeige-900">Total</span>
                    <span className="text-xl font-bold text-sandbeige-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                className="w-full mt-6 bg-sandbeige-800 hover:bg-sandbeige-900 text-white py-3"
              >
                Proceed to Checkout
              </Button>
              <Link href="/products">
                <Button
                  variant="outline"
                  className="w-full mt-4 border-sandbeige-200 text-sandbeige-800 hover:bg-sandbeige-50"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
