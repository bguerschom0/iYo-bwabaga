import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const navigation = {
    shop: [
      { name: 'All Products', href: '/products' },
      { name: 'New Arrivals', href: '/products/new' },
      { name: 'Best Sellers', href: '/products/best-sellers' },
      { name: 'Special Offers', href: '/products/offers' },
    ],
    support: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/faq' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Terms & Conditions', href: '/terms' },
    ],
    social: [
      { name: 'Facebook', icon: Facebook, href: '#' },
      { name: 'Twitter', icon: Twitter, href: '#' },
      { name: 'Instagram', icon: Instagram, href: '#' },
    ],
  };

  return (
    <footer className="bg-white border-t border-sandbeige-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12 border-b border-sandbeige-200">
          <div>
            <h3 className="text-xl font-bold text-sandbeige-900">Stay Updated</h3>
            <p className="mt-2 text-sandbeige-600">
              Subscribe to our newsletter for exclusive offers and updates
            </p>
          </div>
          <form className="flex space-x-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg border border-sandbeige-200 px-4 focus:outline-none focus:ring-2 focus:ring-sandbeige-200"
            />
            <Button className="bg-sandbeige-800 hover:bg-sandbeige-900 text-white">
              <Mail className="h-5 w-5 mr-2" />
              Subscribe
            </Button>
          </form>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Company Info */}
          <div>
            <Link href="/" className="text-2xl font-bold text-sandbeige-900">
              iYo-bwabaga
            </Link>
            <p className="mt-4 text-sandbeige-600">
              Your premier destination for luxury footwear. Quality and style combined.
            </p>
            <div className="flex space-x-4 mt-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sandbeige-400 hover:text-sandbeige-900"
                >
                  <item.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold text-sandbeige-900 tracking-wider uppercase">
              Shop
            </h3>
            <ul className="mt-4 space-y-4">
              {navigation.shop.map((item) => (
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

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-sandbeige-900 tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-4">
              {navigation.support.map((item) => (
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

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-sandbeige-900 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-4">
              {navigation.company.map((item) => (
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
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-sandbeige-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sandbeige-600">
              © {new Date().getFullYear()} Bigshom. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-sandbeige-600 hover:text-sandbeige-900"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sandbeige-600 hover:text-sandbeige-900"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-sandbeige-600 hover:text-sandbeige-900"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
