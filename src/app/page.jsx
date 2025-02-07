import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Navigation from '@/components/layout/Navigation';
import ProductGrid from '@/components/products/ProductGrid';
import { supabase } from '@/lib/supabase/client';

async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .limit(8);

  if (error) throw error;
  return data;
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="min-h-screen">
      <Header />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-sandbeige-100">
        <div className="absolute inset-0 bg-gradient-to-r from-sandbeige-900/50 to-transparent">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Step into Luxury with iYo-bwabaga
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Discover our premium collection of handcrafted shoes that blend comfort with style
              </p>
              <button className="bg-sandbeige-800 text-white px-8 py-3 rounded-full hover:bg-sandbeige-900 transition">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-sandbeige-900 mb-8">
            Featured Products
          </h2>
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductGrid products={featuredProducts} />
          </Suspense>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-sandbeige-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-sandbeige-900 mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Casual', 'Formal', 'Sport'].map((category) => (
              <div
                key={category}
                className="relative h-64 rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={`/api/placeholder/400/300`}
                  alt={category}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {category}
                    </h3>
                    <p className="text-white/90">Explore Collection →</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Free Shipping',
                description: 'On orders over $100',
                icon: '🚚',
              },
              {
                title: 'Secure Payment',
                description: '100% secure payment',
                icon: '🔒',
              },
              {
                title: '24/7 Support',
                description: 'Dedicated support',
                icon: '💬',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-lg border border-sandbeige-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-sandbeige-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sandbeige-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
