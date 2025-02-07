import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { 
  Menu, X, ShoppingBag, Heart, User, 
  Search, Sun, Moon, ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const MainLayout = ({ children }) => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const userNavigation = user ? [
    { name: 'My Profile', href: '/dashboard/profile' },
    { name: 'My Orders', href: '/dashboard/orders' },
    { name: 'Wishlist', href: '/dashboard/wishlist' },
    ...(user.role === 'admin' ? [{ name: 'Admin Panel', href: '/admin' }] : []),
  ] : [];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Main Nav */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-sandbeige-900">
                iYo-bwabaga
              </Link>
              <div className="hidden md:flex items-center ml-10 space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sandbeige-600 hover:text-sandbeige-900"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-sandbeige-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sandbeige-200"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-sandbeige-400" />
              </div>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-sandbeige-600 hover:text-sandbeige-900"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Link href="/dashboard/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sandbeige-600 hover:text-sandbeige-900"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sandbeige-600 hover:text-sandbeige-900 relative"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-sandbeige-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    0
                  </span>
                </Button>
              </Link>

              {user ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-sandbeige-600 hover:text-sandbeige-900"
                  >
                    <User className="h-5 w-5" />
                    <ChevronDown className="h-4 w-4" />
                  </Button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                      {userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-sandbeige-700 hover:bg-sandbeige-50"
                        >
                          {item.name}
                        </Link>
                      ))}
                      <button
                        onClick={signOut}
                        className="block w-full text-left px-4 py-2 text-sm text-sandbeige-700 hover:bg-sandbeige-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login">
                  <Button className="bg-sandbeige-800 text-white hover:bg-sandbeige-900">
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-sandbeige-600" />
                ) : (
                  <Menu className="h-6 w-6 text-sandbeige-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-2 text-sandbeige-600 hover:text-sandbeige-900"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-sandbeige-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-sandbeige-900 mb-4">About Us</h3>
              <p className="text-sandbeige-600">
                iYo-bwabaga is your premier destination for luxury footwear.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-sandbeige-900 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sandbeige-600 hover:text-sandbeige-900"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-sandbeige-900 mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-sandbeige-600 hover:text-sandbeige-900">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-sandbeige-600 hover:text-sandbeige-900">
                    Shipping Information
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-sandbeige-600 hover:text-sandbeige-900">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sandbeige-600 hover:text-sandbeige-900">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-sandbeige-900 mb-4">Newsletter</h3>
              <p className="text-sandbeige-600 mb-4">
                Subscribe to get special offers and updates.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-sandbeige-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sandbeige-200"
                />
                <Button className="bg-sandbeige-800 text-white hover:bg-sandbeige-900 rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-sandbeige-200 mt-8 pt-8 text-center text-sandbeige-600">
            <p>&copy; {new Date().getFullYear()} iYo-bwabaga. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
