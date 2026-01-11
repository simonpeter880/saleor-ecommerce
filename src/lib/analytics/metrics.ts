/**
 * Analytics Metrics System
 *
 * Track and analyze key business metrics:
 * - Sales and revenue tracking
 * - Conversion funnel analysis
 * - Customer behavior metrics
 * - Product performance
 * - Marketing attribution
 *
 * Expected Impact: Data-driven decision making, +15% overall performance
 */

export interface AnalyticsMetrics {
  // Revenue Metrics
  totalRevenue: number;
  averageOrderValue: number;
  revenueGrowth: number; // Percentage
  lifetimeValue: number;

  // Conversion Metrics
  conversionRate: number;
  cartAbandonmentRate: number;
  checkoutCompletionRate: number;
  addToCartRate: number;

  // Traffic Metrics
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number;
  averageSessionDuration: number; // seconds

  // Customer Metrics
  newCustomers: number;
  returningCustomers: number;
  customerRetentionRate: number;
  repeatPurchaseRate: number;

  // Product Metrics
  topProducts: ProductMetric[];
  topCategories: CategoryMetric[];
  averageProductViews: number;

  // Engagement Metrics
  reviewsSubmitted: number;
  averageRating: number;
  wishlistAdditions: number;
  socialShares: number;

  // Channel Performance
  channelBreakdown: ChannelMetric[];
}

export interface ProductMetric {
  productId: string;
  productName: string;
  views: number;
  addToCarts: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
}

export interface CategoryMetric {
  categoryId: string;
  categoryName: string;
  views: number;
  revenue: number;
  products: number;
}

export interface ChannelMetric {
  channel: string; // 'organic', 'direct', 'social', 'email', 'paid'
  visitors: number;
  revenue: number;
  conversionRate: number;
  averageOrderValue: number;
}

export interface ConversionFunnel {
  stages: FunnelStage[];
  overallConversionRate: number;
  dropOffPoints: string[];
}

export interface FunnelStage {
  name: string;
  users: number;
  dropOffRate: number;
  conversionRate: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  sessionId: string;
  type: EventType;
  timestamp: string;
  properties: Record<string, any>;
  metadata?: {
    userAgent?: string;
    ip?: string;
    referrer?: string;
    utm?: {
      source?: string;
      medium?: string;
      campaign?: string;
    };
  };
}

export type EventType =
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'purchase'
  | 'search'
  | 'review_submit'
  | 'wishlist_add'
  | 'share'
  | 'comparison_add'
  | 'alert_create';

/**
 * Calculate conversion rate
 */
export function calculateConversionRate(conversions: number, totalVisitors: number): number {
  if (totalVisitors === 0) return 0;
  return (conversions / totalVisitors) * 100;
}

/**
 * Calculate average order value
 */
export function calculateAOV(totalRevenue: number, totalOrders: number): number {
  if (totalOrders === 0) return 0;
  return totalRevenue / totalOrders;
}

/**
 * Calculate growth rate
 */
export function calculateGrowthRate(currentValue: number, previousValue: number): number {
  if (previousValue === 0) return currentValue > 0 ? 100 : 0;
  return ((currentValue - previousValue) / previousValue) * 100;
}

/**
 * Calculate retention rate
 */
export function calculateRetentionRate(
  returningCustomers: number,
  totalCustomers: number
): number {
  if (totalCustomers === 0) return 0;
  return (returningCustomers / totalCustomers) * 100;
}

/**
 * Build conversion funnel
 */
export function buildConversionFunnel(events: AnalyticsEvent[]): ConversionFunnel {
  const pageViews = events.filter((e) => e.type === 'page_view').length;
  const productViews = events.filter((e) => e.type === 'product_view').length;
  const addToCarts = events.filter((e) => e.type === 'add_to_cart').length;
  const checkouts = events.filter((e) => e.type === 'begin_checkout').length;
  const purchases = events.filter((e) => e.type === 'purchase').length;

  const stages: FunnelStage[] = [
    {
      name: 'Visitors',
      users: pageViews,
      dropOffRate: 0,
      conversionRate: 100,
    },
    {
      name: 'Product Views',
      users: productViews,
      dropOffRate: pageViews > 0 ? ((pageViews - productViews) / pageViews) * 100 : 0,
      conversionRate: pageViews > 0 ? (productViews / pageViews) * 100 : 0,
    },
    {
      name: 'Add to Cart',
      users: addToCarts,
      dropOffRate: productViews > 0 ? ((productViews - addToCarts) / productViews) * 100 : 0,
      conversionRate: productViews > 0 ? (addToCarts / productViews) * 100 : 0,
    },
    {
      name: 'Checkout',
      users: checkouts,
      dropOffRate: addToCarts > 0 ? ((addToCarts - checkouts) / addToCarts) * 100 : 0,
      conversionRate: addToCarts > 0 ? (checkouts / addToCarts) * 100 : 0,
    },
    {
      name: 'Purchase',
      users: purchases,
      dropOffRate: checkouts > 0 ? ((checkouts - purchases) / checkouts) * 100 : 0,
      conversionRate: checkouts > 0 ? (purchases / checkouts) * 100 : 0,
    },
  ];

  const overallConversionRate = pageViews > 0 ? (purchases / pageViews) * 100 : 0;

  // Identify drop-off points (>40% drop)
  const dropOffPoints = stages
    .filter((stage) => stage.dropOffRate > 40)
    .map((stage) => stage.name);

  return {
    stages,
    overallConversionRate,
    dropOffPoints,
  };
}

/**
 * Aggregate metrics by time period
 */
export function aggregateByTimePeriod(
  events: AnalyticsEvent[],
  period: 'hour' | 'day' | 'week' | 'month'
): TimeSeriesData[] {
  const grouped = new Map<string, number>();

  events.forEach((event) => {
    const date = new Date(event.timestamp);
    let key: string;

    switch (period) {
      case 'hour':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
          date.getDate()
        ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
        break;
      case 'day':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
          date.getDate()
        ).padStart(2, '0')}`;
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = `${weekStart.getFullYear()}-W${String(getWeekNumber(weekStart)).padStart(2, '0')}`;
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
    }

    grouped.set(key, (grouped.get(key) || 0) + 1);
  });

  return Array.from(grouped.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get week number
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Calculate customer lifetime value
 */
export function calculateLTV(
  averageOrderValue: number,
  purchaseFrequency: number,
  customerLifespan: number
): number {
  return averageOrderValue * purchaseFrequency * customerLifespan;
}

/**
 * Track analytics event
 */
export function trackEvent(
  type: EventType,
  properties: Record<string, any>,
  userId?: string
): AnalyticsEvent {
  const sessionId = getSessionId();

  const event: AnalyticsEvent = {
    id: generateEventId(),
    userId,
    sessionId,
    type,
    timestamp: new Date().toISOString(),
    properties,
    metadata: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    },
  };

  // Send to analytics backend
  sendToAnalytics(event);

  return event;
}

/**
 * Get or create session ID
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';

  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Generate event ID
 */
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate session ID
 */
function generateSessionId(): string {
  return `ses_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Send event to analytics backend
 */
async function sendToAnalytics(event: AnalyticsEvent): Promise<void> {
  try {
    // Send to your analytics backend
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error('Failed to send analytics event:', error);
  }
}

export default {
  calculateConversionRate,
  calculateAOV,
  calculateGrowthRate,
  calculateRetentionRate,
  buildConversionFunnel,
  aggregateByTimePeriod,
  calculateLTV,
  trackEvent,
};
