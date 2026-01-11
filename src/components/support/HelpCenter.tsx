/**
 * Help Center Component
 *
 * Self-service support hub with:
 * - FAQ sections by category
 * - Search functionality
 * - Popular articles
 * - Helpful voting
 * - Contact options
 *
 * Expected Impact: +40% self-service resolution, -30% support tickets
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FAQCategory, FAQItem } from '@/lib/support/support-types';

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'orders',
    name: 'Orders & Delivery',
    icon: '📦',
    description: 'Track orders, delivery times, and shipping options',
    order: 1,
    articleCount: 12,
  },
  {
    id: 'payments',
    name: 'Payments',
    icon: '💳',
    description: 'MTN MoMo, Airtel Money, and payment issues',
    order: 2,
    articleCount: 8,
  },
  {
    id: 'products',
    name: 'Products',
    icon: '📱',
    description: 'Product information, specs, and compatibility',
    order: 3,
    articleCount: 15,
  },
  {
    id: 'returns',
    name: 'Returns & Refunds',
    icon: '🔄',
    description: 'Return policy, refund process, and exchanges',
    order: 4,
    articleCount: 10,
  },
  {
    id: 'account',
    name: 'Account',
    icon: '👤',
    description: 'Account settings, loyalty points, and security',
    order: 5,
    articleCount: 7,
  },
  {
    id: 'technical',
    name: 'Technical Support',
    icon: '🔧',
    description: 'Website issues, login problems, and troubleshooting',
    order: 6,
    articleCount: 9,
  },
];

const POPULAR_FAQS: FAQItem[] = [
  {
    id: '1',
    category: 'orders',
    question: 'How long does delivery take in Kampala?',
    answer:
      'Delivery in Kampala typically takes 1-2 business days. Orders placed before 2 PM are usually dispatched the same day. For areas outside Kampala, delivery may take 2-4 business days depending on location.',
    order: 1,
    helpful: 245,
    notHelpful: 12,
    tags: ['delivery', 'kampala', 'shipping'],
    updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: '2',
    category: 'payments',
    question: 'How do I pay with MTN Mobile Money?',
    answer:
      'Select MTN Mobile Money at checkout, enter your MTN phone number (077/078/076), and approve the payment request on your phone. You will receive a prompt to enter your PIN. Payment is processed instantly.',
    order: 2,
    helpful: 312,
    notHelpful: 8,
    tags: ['mtn', 'mobile-money', 'payment'],
    updatedAt: '2026-01-08T00:00:00Z',
  },
  {
    id: '3',
    category: 'returns',
    question: 'What is your return policy?',
    answer:
      'We accept returns within 14 days of delivery for unused products in original packaging. Items must be in resellable condition. Refunds are processed within 5-7 business days. Contact support to initiate a return.',
    order: 3,
    helpful: 189,
    notHelpful: 15,
    tags: ['returns', 'refunds', 'policy'],
    updatedAt: '2026-01-05T00:00:00Z',
  },
  {
    id: '4',
    category: 'products',
    question: 'How do I check product compatibility?',
    answer:
      'Each product page includes detailed specifications and compatibility information. You can also use our product comparison tool to compare up to 4 products side-by-side. For specific questions, contact our support team.',
    order: 4,
    helpful: 167,
    notHelpful: 22,
    tags: ['compatibility', 'specs', 'comparison'],
    updatedAt: '2026-01-12T00:00:00Z',
  },
  {
    id: '5',
    category: 'account',
    question: 'How do loyalty points work?',
    answer:
      'Earn 1 point for every 1000 UGX spent. Redeem points for discounts and rewards. Points never expire. Track your points in your account dashboard. Higher tiers (Silver, Gold, Platinum) earn bonus points on every purchase.',
    order: 5,
    helpful: 201,
    notHelpful: 9,
    tags: ['loyalty', 'points', 'rewards'],
    updatedAt: '2026-01-11T00:00:00Z',
  },
  {
    id: '6',
    category: 'payments',
    question: 'Why was my Airtel Money payment declined?',
    answer:
      'Common reasons: insufficient balance, incorrect PIN, transaction limit exceeded, or network issues. Ensure you have enough balance including transaction fees. If problem persists, contact Airtel customer care or try MTN Mobile Money.',
    order: 6,
    helpful: 143,
    notHelpful: 31,
    tags: ['airtel', 'payment-failed', 'troubleshooting'],
    updatedAt: '2026-01-09T00:00:00Z',
  },
];

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = POPULAR_FAQS.filter((faq) => {
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleVote = async (faqId: string, helpful: boolean) => {
    try {
      await fetch(`/api/support/faq/${faqId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helpful }),
      });
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          How can we help you?
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Find answers to common questions or contact our support team
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help..."
            className="w-full px-6 py-4 pl-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FAQ_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setSelectedCategory(selectedCategory === category.id ? null : category.id)
              }
              className={`p-6 text-left border-2 rounded-xl transition-all hover:shadow-lg ${
                selectedCategory === category.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-3xl mb-3">{category.icon}</div>
              <div className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1">
                {category.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {category.description}
              </div>
              <div className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                {category.articleCount} articles
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {selectedCategory
              ? FAQ_CATEGORIES.find((c) => c.id === selectedCategory)?.name
              : 'Popular Questions'}
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No articles found matching your search.
              </p>
              <Link
                href="/support/contact"
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                Contact support instead
              </Link>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {faq.question}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        {faq.helpful + faq.notHelpful} votes • {faq.helpful > 0 ? ((faq.helpful / (faq.helpful + faq.notHelpful)) * 100).toFixed(0) : 0}% helpful
                      </span>
                    </div>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform ${
                      expandedFAQ === faq.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="pt-6 text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      {faq.answer}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {faq.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Helpful Voting */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Was this helpful?
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVote(faq.id, true)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          Yes
                        </button>
                        <button
                          onClick={() => handleVote(faq.id, false)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                          </svg>
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Contact Support CTA */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
        <p className="text-primary-100 mb-6">
          Can't find the answer you're looking for? Our support team is here to help.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            href="/support/contact"
            className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Create Support Ticket
          </Link>
          <a
            href="mailto:support@techhub.ug"
            className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
          >
            Email Support
          </a>
        </div>
        <div className="mt-6 text-primary-100 text-sm">
          Average response time: 4 hours • Support available 7 days a week
        </div>
      </div>
    </div>
  );
}

export default HelpCenter;
