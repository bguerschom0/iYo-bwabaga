import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

// Wrap with AdminLayout
export default function ProductsPage() {
  return (
    <AdminLayout>
      <ProductsContent />
    </AdminLayout>
  );
}

function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      let query = supabase.from('products').select('*');

      if (filter !== 'all') {
        query = query.eq('category', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);

        if (error) throw error;
        setProducts(products.filter(product => product.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm('Are you sure you want to delete selected products?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .in('id', selectedProducts);

        if (error) throw error;
        setProducts(products.filter(product => !selectedProducts.includes(product.id)));
        setSelectedProducts([]);
      } catch (error) {
        console.error('Error deleting products:', error);
      }
    }
  };

  const toggleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sandbeige-900">Products</h1>
          <p className="text-sandbeige-600">Manage your product inventory</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-sandbeige-800 hover:bg-sandbeige-900 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-sandbeige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sandbeige-200"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-sandbeige-400" />
          </div>
          <div className="flex gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-sandbeige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sandbeige-200"
            >
              <option value="all">All Categories</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="sport">Sport</option>
            </select>
            <Button variant="outline" className="border-sandbeige-200">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
            <Button variant="outline" className="border-sandbeige-200">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sandbeige-50">
                <th className="w-8 p-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(products.map(p => p.id));
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                    className="rounded border-sandbeige-200"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-sandbeige-600">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-sandbeige-600">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-sandbeige-600">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-sandbeige-600">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-sandbeige-600">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-sandbeige-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandbeige-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-sandbeige-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelectProduct(product.id)}
                      className="rounded border-sandbeige-200"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-sandbeige-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-sandbeige-600">
                          SKU: {product.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-sandbeige-600">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-sandbeige-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-sandbeige-600">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.stock > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Edit2 className="w-4 h-4 text-sandbeige-600" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sandbeige-200 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-sm text-sandbeige-600">
              {selectedProducts.length} products selected
            </div>
            <div className="space-x-4">
              <Button variant="outline" className="border-sandbeige-200">
                Update Stock
              </Button>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={handleBulkDelete}
              >
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
