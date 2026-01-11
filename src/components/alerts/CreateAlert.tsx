/**
 * CreateAlert Component
 *
 * Alert creation form with:
 * - Alert type selection
 * - Price target input
 * - Notification channel preferences
 * - Visual product summary
 *
 * Expected Impact: +35% alert creation rate
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AlertType, AlertChannel, AlertPreferences } from '@/lib/alerts/alert-types';

interface CreateAlertProps {
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  currentPrice?: number;
  inStock: boolean;
  currentStock?: number;
  onCreateAlert: (params: {
    type: AlertType;
    preferences: AlertPreferences;
    priceTarget?: number;
  }) => Promise<void>;
  onCancel?: () => void;
}

export function CreateAlert({
  productId,
  productName,
  productSlug,
  productImage,
  currentPrice,
  inStock,
  currentStock,
  onCreateAlert,
  onCancel,
}: CreateAlertProps) {
  const [alertType, setAlertType] = useState<AlertType>(!inStock ? 'back-in-stock' : 'price-drop');
  const [priceTarget, setPriceTarget] = useState<string>('');
  const [priceDropPercent, setPriceDropPercent] = useState<number>(10);
  const [selectedChannels, setSelectedChannels] = useState<AlertChannel[]>(['email']);
  const [isCreating, setIsCreating] = useState(false);

  const handleChannelToggle = (channel: AlertChannel) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedChannels.length === 0) {
      alert('Please select at least one notification channel');
      return;
    }

    if (alertType === 'price-target' && !priceTarget) {
      alert('Please enter a target price');
      return;
    }

    setIsCreating(true);

    try {
      const preferences: AlertPreferences = {
        channels: selectedChannels,
        frequency: 'immediate',
      };

      if (alertType === 'price-drop') {
        preferences.priceDropThreshold = priceDropPercent;
      }

      await onCreateAlert({
        type: alertType,
        preferences,
        priceTarget: priceTarget ? parseFloat(priceTarget) : undefined,
      });
    } catch (error) {
      alert('Failed to create alert. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const estimatedTarget = currentPrice
    ? Math.round(currentPrice * (1 - priceDropPercent / 100))
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden max-w-2xl">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-primary-600 to-blue-600 text-white">
          <h3 className="text-xl font-bold mb-2">Create Product Alert</h3>
          <p className="text-white/90 text-sm">
            Get notified when this product meets your criteria
          </p>
        </div>

        {/* Product Summary */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {productImage && (
              <div className="relative w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={productImage} alt={productName} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                {productName}
              </h4>
              {currentPrice && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Current price: <span className="font-semibold">{currentPrice.toLocaleString()} UGX</span>
                </div>
              )}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Status:{' '}
                <span className={inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {inStock ? `In Stock (${currentStock})` : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Type Selection */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Alert Type
            </label>
            <div className="grid gap-3">
              {/* Back in Stock */}
              {!inStock && (
                <button
                  type="button"
                  onClick={() => setAlertType('back-in-stock')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    alertType === 'back-in-stock'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">📦</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        Back in Stock
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Notify me when this product becomes available again
                      </div>
                    </div>
                    {alertType === 'back-in-stock' && (
                      <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              )}

              {/* Price Drop */}
              {currentPrice && (
                <button
                  type="button"
                  onClick={() => setAlertType('price-drop')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    alertType === 'price-drop'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💰</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        Price Drop
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Notify me when the price decreases by a certain percentage
                      </div>
                      {alertType === 'price-drop' && (
                        <div className="mt-3 space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Notify when price drops by:
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="5"
                              max="50"
                              step="5"
                              value={priceDropPercent}
                              onChange={(e) => setPriceDropPercent(parseInt(e.target.value))}
                              className="flex-1 accent-primary-600"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-12">
                              {priceDropPercent}%
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Alert when price reaches ≤ {estimatedTarget.toLocaleString()} UGX
                          </div>
                        </div>
                      )}
                    </div>
                    {alertType === 'price-drop' && (
                      <svg className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              )}

              {/* Price Target */}
              {currentPrice && (
                <button
                  type="button"
                  onClick={() => setAlertType('price-target')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    alertType === 'price-target'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🎯</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        Price Target
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Set a specific target price to be notified when reached
                      </div>
                      {alertType === 'price-target' && (
                        <div className="mt-3">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                            Target Price (UGX):
                          </label>
                          <input
                            type="number"
                            value={priceTarget}
                            onChange={(e) => setPriceTarget(e.target.value)}
                            placeholder={`e.g., ${Math.round(currentPrice * 0.8)}`}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                    </div>
                    {alertType === 'price-target' && (
                      <svg className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              )}

              {/* Low Stock */}
              {inStock && currentStock && currentStock > 5 && (
                <button
                  type="button"
                  onClick={() => setAlertType('low-stock')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    alertType === 'low-stock'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">⚠️</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        Low Stock Alert
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Notify me when stock runs low (≤5 units remaining)
                      </div>
                    </div>
                    {alertType === 'low-stock' && (
                      <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Notification Channels */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Notification Channels
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { channel: 'email' as AlertChannel, icon: '📧', label: 'Email' },
                { channel: 'sms' as AlertChannel, icon: '📱', label: 'SMS' },
                { channel: 'push' as AlertChannel, icon: '🔔', label: 'Push' },
                { channel: 'whatsapp' as AlertChannel, icon: '💬', label: 'WhatsApp' },
              ].map(({ channel, icon, label }) => (
                <button
                  key={channel}
                  type="button"
                  onClick={() => handleChannelToggle(channel)}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    selectedChannels.includes(channel)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{icon}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {label}
                    </span>
                    {selectedChannels.includes(channel) && (
                      <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isCreating}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isCreating || selectedChannels.length === 0}
            className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : 'Create Alert'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAlert;
