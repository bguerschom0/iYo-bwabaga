import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { Package, ChevronRight, Eye } from 'lucide-react';
import Link from 'next/link';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-200 text-green-900';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sandbeige-50 flex items-center justify-center">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sandbeige-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-sandbeige-900">My Orders</h1>
          <p className="text-sandbeige-600 mt-2">View and track your orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="bg-white p-8 text-center">
            <Package className="w-16 h-16 mx-auto text-sandbeige-400 mb-4" />
            <h2 className="text-xl font-semibold text-sandbeige-900 mb-2">No Orders Yet</h2>
            <p className="text-sandbeige-600 mb-6">
              Looks like you haven't placed any orders yet.
            </p>
            <Link href="/products">
              <Button className="bg-sandbeige-800 hover:bg-sandbeige-900 text-white">
                Start Shopping
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-white overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-sandbeige-900">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-sandbeige-600">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="border-t border-sandbeige-200 -mx-6 px-6 py-4">
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="ml-4">
                            <h4 className="text-sandbeige-900 font-medium">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-sandbeige-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-sandbeige-900 font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-sandbeige-200 -mx-6 px-6 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sandbeige-600">Total Amount:</span>
                        <span className="ml-2 text-lg font-bold text-sandbeige-900">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button
                          variant="outline"
                          className="border-sandbeige-200 text-sandbeige-800 hover:bg-sandbeige-50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
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

export default OrdersPage;
