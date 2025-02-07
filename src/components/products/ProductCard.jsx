import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  return (
    <Card className="group overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square">
          <img
            src={product.images[0]}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Link 
              href={`/products/${product.id}`}
              className="text-lg font-medium text-sandbeige-900 hover:text-sandbeige-800"
            >
              {product.name}
            </Link>
            <p className="text-sm text-sandbeige-600">{product.category}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAddToWishlist(product)}
            className="text-sandbeige-400 hover:text-red-500"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-bold text-sandbeige-900">
              ${product.price.toFixed(2)}
            </span>
            {product.old_price && (
              <span className="ml-2 text-sm line-through text-sandbeige-400">
                ${product.old_price.toFixed(2)}
              </span>
            )}
          </div>
          <Button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="bg-sandbeige-800 hover:bg-sandbeige-900 text-white"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
