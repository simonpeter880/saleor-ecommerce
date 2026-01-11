/**
 * Homepage - TechHub Electronics Storefront
 *
 * Features:
 * - Hero section with value proposition
 * - Trust badges (warranty, shipping, returns)
 * - Featured products
 * - Shop by category
 * - Structured data for SEO
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TechHub Electronics - Premium Tech & Electronics',
  description: 'Shop the latest smartphones, laptops, tablets, and tech accessories with 1-year warranty, free shipping, and 30-day returns.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Premium Electronics for Tech Enthusiasts
            </h1>
            <p className="text-xl mb-8">
              Discover the latest smartphones, laptops, and accessories with trusted quality and unbeatable service.
            </p>
            <div className="flex gap-4">
              <a
                href="/products"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Shop Now
              </a>
              <a
                href="/deals"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                View Deals
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">1-Year Warranty</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All products covered by manufacturer warranty
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600 dark:text-gray-400">
                On orders over $50
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">↩️</div>
              <h3 className="text-xl font-semibold mb-2">30-Day Returns</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Hassle-free returns and exchanges
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Smartphones', icon: '📱', link: '/categories/smartphones' },
              { name: 'Laptops', icon: '💻', link: '/categories/laptops' },
              { name: 'Tablets', icon: '📲', link: '/categories/tablets' },
              { name: 'Accessories', icon: '🎧', link: '/categories/accessories' },
            ].map((category) => (
              <a
                key={category.name}
                href={category.link}
                className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow hover:shadow-lg transition text-center"
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Placeholder */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Product cards will be populated from GraphQL */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <h3 className="font-semibold mb-2">Product loading...</h3>
              <p className="text-gray-600 dark:text-gray-400">Coming soon</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
