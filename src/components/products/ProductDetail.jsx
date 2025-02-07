import React, { useState } from 'react';
import { Heart, ShoppingCart, Minus, Plus, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductDetail = ({ product, onAddToCart, onAddToWishlist }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    onAddToCart(product, quantity, selectedSize);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 ${
                selectedImage === index ? 'border-sandbeige-800' : 'border-transparent'
              }`}
            >
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-sandbeige-900">{product.name}</h1>
          <p className="text-lg text-sandbeige-600 mt-2">{product.category}</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < product.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sandbeige-600">
            ({product.reviews?.length || 0} reviews)
          </span>
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

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-sandbeige-900">Size</h3>
          <div className="grid grid-cols-4 gap-2">
            {['40', '41', '42', '43', '44', '45'].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-2 text-center rounded-md transition-colors ${
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

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-sandbeige-900">Quantity</h3>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="border-sandbeige-200"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-xl font-medium text-sandbeige-900">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
              className="border-sandbeige-200"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-sandbeige-800 hover:bg-sandbeige-900 text-white"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            onClick={() => onAddToWishlist(product)}
            className="border-sandbeige-200"
          >
            <Heart className="w-5 h-5" />
          </Button>
        </div>

        <div className="border-t border-sandbeige-200 pt-6 space-y-4">
          <p className="text-sandbeige-600">{product.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-sandbeige-600" />
              <span className="text-sm text-sandbeige-600">Free Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-sandbeige-600" />
              <span className="text-sm text-sandbeige-600">2 Year Warranty</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-sandbeige-600" />
              <span className="text-sm text-sandbeige-600">30 Days Return</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
