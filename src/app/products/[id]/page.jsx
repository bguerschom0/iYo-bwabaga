import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Star, Heart, Share2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';

const ProductDetail = () => {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProductDetails();
  }, [params.id]);

  const fetchProductDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          reviews (
            *,
            user:users(full_name)
          )
        `)
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sandbeige-50">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sandbeige-50">
        <div className="text-lg">Product not found</div>
      </div>
    );
  }

  const averageRating = product.reviews?.length 
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-sandbeige-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-w-1 aspect-h-1 w-full">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-w-1 aspect-h-1 ${
                      selectedImage === index ? 'ring-2 ring-sandbeige-800' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-sandbeige-900">{product.name}</h1>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-sandbeige-600">
                      ({product.reviews?.length || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="text-sandbeige-600 hover:text-sandbeige-800">
                      <Heart className="w-6 h-6" />
                    </button>
                    <button className="text-sandbeige-600 hover:text-sandbeige-800">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-3xl font-bold text-sandbeige-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.old_price && (
                  <span className="ml-2 text-lg line-through text-sandbeige-400">
                    ${product.old_price.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-sandbeige-600">{product.description}</p>

              {/* Size Selection */}
              <div>
                <h3 className="text-sm font-medium text-sandbeige-900">Size</h3>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {['40', '41', '42', '43', '44', '45'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 text-center rounded-md ${
                        selectedSize === size
                          ? 'bg-sandbeige-800 text-white'
                          : 'border border-sandbeige-200 text-sandbeige-800 hover:bg-sandbeige-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-medium text-sandbeige-900">Quantity</h3>
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-sandbeige-200 rounded-md"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-medium text-sandbeige-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border border-sandbeige-200 rounded-md"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                className="w-full bg-sandbeige-800 hover:bg-sandbeige-900 text-white py-3 rounded-lg"
                disabled={!selectedSize}
              >
                Add to Cart
              </Button>

              {/* Additional Info */}
              <div className="border-t border-sandbeige-200 pt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-sandbeige-900">Free Delivery</h3>
                  <p className="mt-1 text-sm text-sandbeige-600">
                    Enter your postal code for delivery availability
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-sandbeige-900">Returns</h3>
                  <p className="mt-1 text-sm text-sandbeige-600">
                    Free 30-day returns. See our return policy for more details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-sandbeige-200 px-8 py-6">
            <h2 className="text-2xl font-bold text-sandbeige-900 mb-6">Customer Reviews</h2>
            <div className="space-y-6">
              {product.reviews?.map((review) => (
                <div key={review.id} className="border-b border-sandbeige-200 pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sandbeige-900">{review.user.full_name}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-sandbeige-600">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-4 text-sandbeige-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
