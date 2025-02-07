import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  BarChart2,
  User
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

// Wrap with AdminLayout
export default function CustomersPage() {
  return (
    <AdminLayout>
      <CustomersContent />
    </AdminLayout>
  );
}

function CustomersContent() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCustomers();
  }, [filter]);

  const fetchCustomers = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          orders: orders(count),
          total_spent: orders(total)
        `);

      if (filter !== 'all') {
        // Add filter logic based on your requirements
      }

      const { data, error } = await query;
      if (error) throw error;

      // Process the data to calculate total spent
      const processedCustomers = data.map(customer => ({
        ...customer,
        total_orders: customer.orders[0].count,
        total_spent: customer.total_spent.reduce((sum, order) => sum + order.total, 0)
      }));

      setCustomers(processedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const searchString = searchTerm.toLowerCase();
    return (
      customer.full_name?.toLowerCase().includes(searchString) ||
      customer.email?.toLowerCase().includes(searchString) ||
      customer.phone?.toLowerCase().includes(searchString)
    );
  });

  const stats = [
    {
      title: 'Total Customers',
      value: customers.length,
      icon: User,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active This Month',
      value: customers.filter(c => {
        const lastOrder = new Date(c.last_order_date);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return lastOrder > monthAgo;
      }).length,
      icon: Calendar,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Average Orders',
      value: customers.reduce((acc, c) => acc + c.total_orders, 0) / customers.length || 0,
      icon: ShoppingBag,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Average Spent',
      value: customers.reduce((acc, c) => acc + c.total_spent, 0) / customers.length || 0,
      icon: BarChart2,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-sandbeige-900">Customers</h1>
        <p className="text-sandbeige-600">Manage and analyze your customer base</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-sandbeige-600">{stat.title}</p>
                <h3 className="text-xl font-bold text-sandbeige-900">
                  {typeof stat.value === 'number' 
                    ? stat.value.toFixed(1)
                    : stat.value}
                </h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search customers..."
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
              <option value="all">All Customers</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="vip">VIP</option>
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

      {/* Customers Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sandbeige-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-sandbeige-600">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-sandbeige-600">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-sandbeige-600">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-sandbeige-600">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-sandbeige-600">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-sandbeige-600">
                  Last Order
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-sandbeige-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandbeige-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-sandbeige-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={customer.avatar_url || '/api/placeholder/40/40'}
                        alt={customer.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-sandbeige-900">
                          {customer.full_name}
                        </div>
                        <div className="text-sm text-sandbeige-600">
                          Joined {new Date(customer.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-sandbeige-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center text-sm text-sandbeige-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {customer.city && customer.country && (
                      <div className="flex items-center text-sm text-sandbeige-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {customer.city}, {customer.country}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-sandbeige-900">
                    {customer.total_orders}
                  </td>
                  <td className="px-6 py-4 text-sm text-sandbeige-900">
                    ${customer.total_spent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-sandbeige-600">
                    {customer.last_order_date
                      ? new Date(customer.last_order_date).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" className="border-sandbeige-200">
                      View Details
                    </Button>
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
