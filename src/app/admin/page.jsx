import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { supabase } from '@/lib/supabase/client';

// Wrap with AdminLayout
export default function AdminDashboard() {
  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  );
}

function DashboardContent() {
  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
    salesData: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total revenue
      const { data: revenue } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'completed');
      
      const totalRevenue = revenue?.reduce((sum, order) => sum + order.total, 0) || 0;

      // Fetch total orders
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact' });

      // Fetch total customers
      const { count: totalCustomers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      // Fetch total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact' });

      // Fetch recent orders
      const { data: recentOrders } = await supabase
        .from('orders')
        .select(`
          *,
          profile:profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch sales data for chart
      const { data: salesData } = await supabase
        .from('orders')
        .select('created_at, total')
        .eq('status', 'completed')
        .order('created_at', { ascending: true });

      setStatistics({
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        recentOrders,
        salesData: processSalesData(salesData)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const processSalesData = (data) => {
    // Group sales by date and calculate daily totals
    const dailySales = data?.reduce((acc, order) => {
      const date = new Date(order.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + order.total;
      return acc;
    }, {});

    return Object.entries(dailySales || {}).map(([date, amount]) => ({
      date,
      amount
    }));
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${statistics.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      title: 'Total Orders',
      value: statistics.totalOrders,
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'text-blue-500'
    },
    {
      title: 'Total Customers',
      value: statistics.totalCustomers,
      change: '+5.7%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-500'
    },
    {
      title: 'Available Products',
      value: statistics.totalProducts,
      change: '-2.3%',
      trend: 'down',
      icon: TrendingUp,
      color: 'text-orange-500'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sandbeige-600">{stat.title}</p>
                <h3 className="text-2xl font-bold text-sandbeige-900 mt-1">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {stat.trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ml-1 ${
                stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-sandbeige-600 ml-2">vs last month</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Sales Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-sandbeige-900 mb-4">Sales Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={statistics.salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#4A3F35"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Orders */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-sandbeige-900 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-sandbeige-600">
                <th className="pb-4">Order ID</th>
                <th className="pb-4">Customer</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Total</th>
                <th className="pb-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandbeige-200">
              {statistics.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="py-4">#{order.id.slice(0, 8)}</td>
                  <td className="py-4">{order.profile.full_name}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4">${order.total.toFixed(2)}</td>
                  <td className="py-4">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
