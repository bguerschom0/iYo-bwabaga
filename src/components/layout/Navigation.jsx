import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronDown } from 'lucide-react';

const Navigation = () => {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState(null);

  const navigationItems = [
    {
      name: 'Categories',
      href: '#',
      dropdown: [
        { name: 'Casual', href: '/products/casual' },
        { name: 'Formal', href: '/products/formal' },
        { name: 'Sport', href: '/products/sport' },
        { name: 'Limited Edition', href: '/products/limited-edition' },
      ],
    },
    {
      name: 'Collections',
      href: '/collections',
      dropdown: [
        { name: 'Summer 2024', href: '/collections/summer-2024' },
        { name: 'Winter Essentials', href: '/collections/winter' },
        { name: 'Designer Series', href: '/collections/designer' },
        { name: 'Exclusive Lines', href: '/collections/exclusive' },
      ],
    },
    { name: 'New Arrivals', href: '/products/new' },
    { name: 'Sale', href: '/products/sale' },
    {
      name: 'Brands',
      href: '#',
      dropdown: [
        { name: 'Premium', href: '/brands/premium' },
        { name: 'Luxury', href: '/brands/luxury' },
        { name: 'Designer', href: '/brands/designer' },
        { name: 'All Brands', href: '/brands' },
      ],
    },
  ];

  const handleDropdownToggle = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const isActive = (path) => router.pathname === path;

  return (
    <nav className="bg-white border-b border-sandbeige-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-12">
          <div className="flex space-x-8">
            {navigationItems.map((item, index) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={() => handleDropdownToggle(index)}
                      className={`inline-flex items-center h-12 px-3 text-sm font-medium transition-colors ${
                        openDropdown === index
                          ? 'text-sandbeige-900'
                          : 'text-sandbeige-600 hover:text-sandbeige-900'
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>

                    {openDropdown === index && (
                      <div className="absolute z-50 left-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-2 border border-sandbeige-200">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block px-4 py-2 text-sm text-sandbeige-600 hover:bg-sandbeige-50 hover:text-sandbeige-900"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`inline-flex items-center h-12 px-3 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-sandbeige-900 border-b-2 border-sandbeige-800'
                        : 'text-sandbeige-600 hover:text-sandbeige-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
