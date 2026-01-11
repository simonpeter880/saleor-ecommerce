/**
 * Analytics Dashboard Component
 *
 * Internal dashboard for monitoring key business metrics:
 * - Revenue and conversion tracking
 * - Customer behavior analysis
 * - Product performance
 * - Real-time insights
 *
 * Expected Impact: Data-driven decision making, identify optimization opportunities
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  AnalyticsMetrics,
  ConversionFunnel,
  TimeSeriesData,
  ProductMetric,
  ChannelMetric,
} from '@/lib/analytics/metrics';

interface AnalyticsDashboardProps {
  dateRange?: {
    start: string;
    end: string;
  };
  onRefresh?: () => void;
}

export function AnalyticsDashboard({ dateRange, onRefresh }: AnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [funnel, setFunnel] = useState<ConversionFunnel | null>(null);
  const [revenueData, setRevenueData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, selectedPeriod]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/analytics/dashboard?period=${selectedPeriod}&start=${dateRange?.start || ''}&end=${dateRange?.end || ''}`
      );
      const data = await response.json();
      setMetrics(data.metrics);
      setFunnel(data.funnel);
      setRevenueData(data.revenueData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time business performance insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={() => {
              fetchAnalytics();
              onRefresh?.();
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={`${metrics.totalRevenue.toLocaleString()} UGX`}
          change={metrics.revenueGrowth}
          icon="💰"
          trend={metrics.revenueGrowth > 0 ? 'up' : 'down'}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate.toFixed(2)}%`}
          icon="🎯"
          subtitle={`${metrics.totalVisitors.toLocaleString()} visitors`}
        />
        <MetricCard
          title="Average Order Value"
          value={`${metrics.averageOrderValue.toLocaleString()} UGX`}
          icon="🛒"
        />
        <MetricCard
          title="Customer Lifetime Value"
          value={`${metrics.lifetimeValue.toLocaleString()} UGX`}
          icon="👥"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Cart Abandonment"
          value={`${metrics.cartAbandonmentRate.toFixed(1)}%`}
          icon="🛒"
          subtitle="Opportunity for recovery"
          trend={metrics.cartAbandonmentRate > 70 ? 'down' : 'neutral'}
        />
        <MetricCard
          title="Checkout Completion"
          value={`${metrics.checkoutCompletionRate.toFixed(1)}%`}
          icon="✅"
          subtitle="Users completing purchase"
        />
        <MetricCard
          title="Repeat Purchase Rate"
          value={`${metrics.repeatPurchaseRate.toFixed(1)}%`}
          icon="🔄"
          subtitle={`${metrics.returningCustomers} returning customers`}
        />
      </div>

      {/* Conversion Funnel */}
      {funnel && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Conversion Funnel
          </h2>
          <div className="space-y-4">
            {funnel.stages.map((stage, index) => (
              <FunnelStage
                key={stage.name}
                stage={stage}
                isFirst={index === 0}
                isLast={index === funnel.stages.length - 1}
                isDropOffPoint={funnel.dropOffPoints.includes(stage.name)}
              />
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                  Overall Conversion Rate
                </div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                  {funnel.overallConversionRate.toFixed(2)}%
                </div>
              </div>
              {funnel.dropOffPoints.length > 0 && (
                <div className="text-right">
                  <div className="text-sm text-orange-800 dark:text-orange-300 font-medium">
                    Critical Drop-Off Points
                  </div>
                  <div className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                    {funnel.dropOffPoints.join(', ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Products */}
      {metrics.topProducts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Top Performing Products
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Views
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Add to Cart
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Purchases
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Conversion
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {metrics.topProducts.slice(0, 10).map((product) => (
                  <tr
                    key={product.productId}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      {product.productName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 text-right">
                      {product.views.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 text-right">
                      {product.addToCarts.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 text-right">
                      {product.purchases.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.conversionRate > 5
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : product.conversionRate > 2
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}
                      >
                        {product.conversionRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100 text-right font-medium">
                      {product.revenue.toLocaleString()} UGX
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Channel Performance */}
      {metrics.channelBreakdown.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Channel Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.channelBreakdown.map((channel) => (
              <ChannelCard key={channel.channel} channel={channel} />
            ))}
          </div>
        </div>
      )}

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Reviews Submitted"
          value={metrics.reviewsSubmitted.toString()}
          icon="⭐"
          subtitle={`Avg rating: ${metrics.averageRating.toFixed(1)}`}
        />
        <MetricCard
          title="Wishlist Additions"
          value={metrics.wishlistAdditions.toString()}
          icon="❤️"
          subtitle="Product saves"
        />
        <MetricCard
          title="Social Shares"
          value={metrics.socialShares.toString()}
          icon="🔗"
          subtitle="Product shares"
        />
        <MetricCard
          title="Avg Session Duration"
          value={`${Math.floor(metrics.averageSessionDuration / 60)}m ${metrics.averageSessionDuration % 60}s`}
          icon="⏱️"
          subtitle="Time on site"
        />
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

function MetricCard({ title, value, icon, change, trend, subtitle }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</div>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
      <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {value}
      </div>
      <div className="flex items-center gap-2">
        {change !== undefined && (
          <span
            className={`text-sm font-medium ${
              trend === 'up'
                ? 'text-green-600 dark:text-green-400'
                : trend === 'down'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {change > 0 ? '+' : ''}
            {change.toFixed(1)}%
          </span>
        )}
        {subtitle && (
          <span className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</span>
        )}
      </div>
    </div>
  );
}

interface FunnelStageProps {
  stage: {
    name: string;
    users: number;
    dropOffRate: number;
    conversionRate: number;
  };
  isFirst: boolean;
  isLast: boolean;
  isDropOffPoint: boolean;
}

function FunnelStage({ stage, isFirst, isLast, isDropOffPoint }: FunnelStageProps) {
  return (
    <div className="relative">
      <div
        className={`flex items-center justify-between p-4 rounded-lg border-2 ${
          isDropOffPoint
            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'
        }`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {stage.name}
            </div>
            {isDropOffPoint && (
              <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded">
                High Drop-off
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {stage.users.toLocaleString()}
              </span>{' '}
              users
            </div>
            {!isFirst && (
              <>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Drop-off:{' '}
                  <span
                    className={`font-medium ${
                      stage.dropOffRate > 40
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {stage.dropOffRate.toFixed(1)}%
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Conversion:{' '}
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {stage.conversionRate.toFixed(1)}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="hidden md:block w-32">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                isDropOffPoint
                  ? 'bg-orange-500'
                  : 'bg-gradient-to-r from-primary-500 to-blue-500'
              }`}
              style={{ width: `${isFirst ? 100 : stage.conversionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Arrow to next stage */}
      {!isLast && (
        <div className="flex justify-center my-2">
          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

function ChannelCard({ channel }: { channel: ChannelMetric }) {
  const channelIcons: Record<string, string> = {
    organic: '🔍',
    direct: '🔗',
    social: '📱',
    email: '📧',
    paid: '💳',
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl">{channelIcons[channel.channel] || '📊'}</div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
          {channel.channel}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Visitors</span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {channel.visitors.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {channel.revenue.toLocaleString()} UGX
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Conv. Rate</span>
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            {channel.conversionRate.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">AOV</span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {channel.averageOrderValue.toLocaleString()} UGX
          </span>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
