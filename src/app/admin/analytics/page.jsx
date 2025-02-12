'use client';


import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { supabase } from '@/lib/supabase/client';

// Wrap with AdminLayout
export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <AnalyticsContent />
    </AdminLayout>
  );
}

function AnalyticsContent() {
  const [timeRange, setTimeRange] = useState('week');
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [customerStats, setCustomerStats] = useState({
    total: 0,
    new: 0,
    returning: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch sales data
      const { data: sales } = await supabase
        .from('orders')
        .select('created_at, total, status')
        .eq('status', 'completed')
        .gte('created_at', getDateRange(timeRange));

      // Process sales data for chart
      const processedSales = processSalesData(sales);
      setSalesData(processedSales);

      // Fetch category data
      const { data: categories } = await supabase
        .from('products')
        .select('category, price');

      const processedCategories = processCategoryData(categories);
      setCategoryData(processedCategories);

      // Fetch customer statistics
      const { data: customers } = await supabase
        .from('profiles')
        .select('created_at, last_order_date');

      const stats = processCustomerStats(customers);
      setCustomerStats(stats);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = (range) => {
    const date = new Date();
    switch (range) {
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() - 1);
        break;
    }
    return date.toISOString();
  };

  const processSalesData = (data) => {
    const groupedData = data.reduce((acc, order) => {
      const date = new Date(order.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + order.total;
      return acc;
    }, {});

    return Object.entries(groupedData).map(([date, total]) => ({
      date,
      total
    }));
  };

  const processCategoryData = (data) => {
    const groupedData = data.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(groupedData).map(([name, value]) => ({
      name,
      value
    }));
  };

  const processCustomerStats = (data) => {
    const now = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    return {
      total: data.length,
      new: data.filter(c => new Date(c.created_at) > monthAgo).length,
      returning: data.filter(c => c.last_order_date && new Date(c.last_order_date) > monthAgo).length
    };
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-sandbeige-900">Analytics</h1>
          <p className="text-sandbeige-600">Track your business performance</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            onClick={() => setTimeRange('week')}
            className={timeRange === 'week' ? 'bg-sandbeige-800' : 'border-sandbeige-200'}
          >
            Week
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            onClick={() => setTimeRange('month')}
            className={timeRange === 'month' ? 'bg-sandbeige-800' : 'border-sandbeige-200'}
          >
            Month
          </Button>
          <Button
            variant={timeRange === 'year' ? 'default' : 'outline'}
            onClick={() => setTimeRange('year')}
            className={timeRange === 'year' ? 'bg-sandbeige-800' : 'border-sandbeige-200'}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-sandbeige-900 mb-2">Total Customers</h3>
          <div className="text-3xl font-bold text-sandbeige-900">{customerStats.total}</div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-sandbeige-600">New Customers</span>
              <span className="font-medium text-sandbeige-900">{customerStats.new}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sandbeige-600">Returning Customers</span>
              <span className="font-medium text-sandbeige-900">{customerStats.returning}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-sandbeige-900 mb-2">Total Sales</h3>
          <div className="text-3xl font-bold text-sandbeige-900">
            ${salesData.reduce((sum, day) => sum + day.total, 0).toFixed(2)}
          </div>
          <div className="h-32 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <Line type="monotone" dataKey="total" stroke="#4A3F35" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-sandbeige-900 mb-2">Category Distribution</h3>
          <div className="h-40 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-sandbeige-900 mb-4">Sales Trends</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#4A3F35" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
