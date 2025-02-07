import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';

const WishlistPage = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          product:products (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .match({ user_id: user.id, product_id: productId });

      if (error) throw error;
      setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const addToCart = async (product) => {
    try {
      // Add to cart logic here
      // This will integrate with your cart management system
      console.log('Adding to cart:', product);
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sandbeige-50 flex items-center justify-center">
        <div className="text-lg">Loading wishlist...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sandbeige-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-sandbeige-900">My Wishlist</h1>
          <p className="text-sandbeige-600 mt-2">
            {wishlistItems.length} items in your wishlist
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <Card className="bg-white p-8 text-center">
            <Heart className="w-16 h-16 mx-auto text-sandbeige-400 mb-4" />
            <h2 className="text-xl font-semibold text-sandbeige-900 mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-sandbeige-600 mb-6">
              Add items you love to your wishlist. Review them anytime and easily move them to the cart.
            </p>
            <Link href="/products">
              <Button className="bg-sandbeige-800 hover:bg-sandbeige-900 text-white">
                Explore Products
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="bg-white overflow-hidden">
                <div className="relative">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => removeFromWishlist(item.product_id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-sandbeige-50"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <Link 
                    href={`/products/${item.product.id}`}
                    className="text-lg font-medium text-sandbeige-900 hover:text-sandbeige-800"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sandbeige-600 mt-1">
                    ${item.product.price.toFixed(2)}
                  </p>
                  <div className="mt-4">
                    <Button
                      onClick={() => addToCart(item.product)}
                      className="w-full bg-sandbeige-800 hover:bg-sandbeige-900 text-white"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
