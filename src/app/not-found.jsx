import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sandbeige-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-sandbeige-200">404</div>
            <h1 className="text-2xl font-bold text-sandbeige-900 mt-4">
              Page Not Found
            </h1>
            <p className="text-sandbeige-600 mt-2">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search our store..."
                className="w-full pl-10 pr-4 py-2 border border-sandbeige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sandbeige-200"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-sandbeige-400" />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link href="/">
              <Button
                className="w-full bg-sandbeige-800 hover:bg-sandbeige-900 text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </Link>

            <div className="text-sm text-sandbeige-600">
              Need help? <Link href="/contact" className="text-sandbeige-800 hover:underline">Contact Support</Link>
            </div>
          </div>

          {/* Popular Links */}
          <div className="mt-8 pt-8 border-t border-sandbeige-200">
            <h2 className="text-sm font-medium text-sandbeige-900 mb-4">
              Popular Pages
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { name: 'New Arrivals', href: '/products/new' },
                { name: 'Best Sellers', href: '/products/best-sellers' },
                { name: 'Sale', href: '/products/sale' },
                { name: 'About Us', href: '/about' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-sandbeige-600 hover:text-sandbeige-800"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
