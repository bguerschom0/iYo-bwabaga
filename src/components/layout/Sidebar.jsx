import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Home,
  ShoppingBag,
  Heart,
  User,
  Settings,
  LogOut,
  Package,
  Clock,
  CreditCard
} from 'lucide-react';

const Sidebar = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const customerNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Orders', href: '/dashboard/orders', icon: Package },
    { name: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
    { name: 'Order History', href: '/dashboard/history', icon: Clock },
    { name: 'Payment Methods', href: '/dashboard/payment', icon: CreditCard },
    { name: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
  ];

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Orders', href: '/admin/orders', icon: Package },
    { name: 'Customers', href: '/admin/customers', icon: User },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const navigation = user?.role === 'admin' ? adminNavigation : customerNavigation;

  const isActive = (path) => router.pathname === path;

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-sandbeige-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold text-sandbeige-900">
            iYo-bwabaga
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  active
                    ? 'bg-sandbeige-100 text-sandbeige-900'
                    : 'text-sandbeige-600 hover:bg-sandbeige-50 hover:text-sandbeige-900'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sandbeige-200">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="flex-shrink-0">
              <img
                src={user?.avatar_url || '/api/placeholder/32/32'}
                alt={user?.full_name}
                className="h-8 w-8 rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sandbeige-900 truncate">
                {user?.full_name}
              </p>
              <p className="text-xs text-sandbeige-600 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={signOut}
            className="flex items-center w-full px-4 py-2 mt-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
