import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    sortBy: 'newest'
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select('*');

      // Apply filters
      if (filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      // Apply price range filter
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-');
        query = query.gte('price', min).lte('price', max);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sandbeige-50">
      {/* Filter Bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-sandbeige-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="flex items-center space-x-2 border-sandbeige-200"
              >
                <Filter size={20} />
                <span>Filters</span>
                <ChevronDown size={20} />
              </Button>

              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="px-4 py-2 border border-sandbeige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sandbeige-200"
              >
                <option value="all">All Categories</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="sport">Sport</option>
              </select>

              <select
                value={filters.priceRange}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                className="px-4 py-2 border border-sandbeige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sandbeige-200"
              >
                <option value="all">All Prices</option>
                <option value="0-50">Under $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200-500">$200 - $500</option>
                <option value="500-">$500+</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="px-4 py-2 border border-sandbeige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sandbeige-200"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <div className="flex items-center border border-sandbeige-200 rounded-lg">
                <Button
                  variant={view === 'grid' ? 'subtle' : 'ghost'}
                  onClick={() => setView('grid')}
                  className="p-2"
                >
                  <Grid size={20} />
                </Button>
                <Button
                  variant={view === 'list' ? 'subtle' : 'ghost'}
                  onClick={() => setView('list')}
                  className="p-2"
                >
                  <List size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div>Loading...</div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-sandbeige-900">{product.name}</h3>
                  <p className="text-sm text-sandbeige-600 mt-1">{product.category}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-sandbeige-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <Button className="bg-sandbeige-800 hover:bg-sandbeige-900 text-white">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition">
                <div className="flex">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-48 h-48 object-cover"
                  />
                  <div className="flex-1 p-6">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-sandbeige-900">{product.name}</h3>
                        <p className="text-sm text-sandbeige-600 mt-1">{product.category}</p>
                        <p className="mt-4">{product.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-sandbeige-900">
                          ${product.price.toFixed(2)}
                        </span>
                        <Button className="block mt-4 bg-sandbeige-800 hover:bg-sandbeige-900 text-white">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
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

export default ProductListing;
