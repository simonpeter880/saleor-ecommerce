/**
 * Alert System Types
 *
 * Stock and price alerts for products:
 * - Back-in-stock notifications
 * - Price drop alerts
 * - Low stock warnings
 * - Alert preferences and delivery channels
 *
 * Expected Impact: +30% conversion on out-of-stock products, +20% price-sensitive purchases
 */

export interface Alert {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  type: AlertType;
  status: AlertStatus;
  createdAt: string;
  triggeredAt?: string;
  expiresAt?: string;
  notificationsSent: AlertNotification[];
  preferences: AlertPreferences;
}

export type AlertType = 'back-in-stock' | 'price-drop' | 'low-stock' | 'price-target';

export type AlertStatus = 'active' | 'triggered' | 'expired' | 'cancelled';

export interface AlertPreferences {
  channels: AlertChannel[];
  frequency?: 'immediate' | 'daily-digest' | 'weekly-digest';
  priceDropThreshold?: number; // Percentage or absolute amount
  priceTarget?: number; // Target price in UGX
  timezone?: string;
}

export type AlertChannel = 'email' | 'sms' | 'push' | 'whatsapp';

export interface AlertNotification {
  id: string;
  alertId: string;
  channel: AlertChannel;
  sentAt: string;
  delivered: boolean;
  deliveredAt?: string;
  opened?: boolean;
  openedAt?: string;
  clicked?: boolean;
  clickedAt?: string;
  error?: string;
}

export interface BackInStockAlert extends Alert {
  type: 'back-in-stock';
  currentStock?: number;
  notifyWhenStock: number; // Notify when stock reaches this level
}

export interface PriceDropAlert extends Alert {
  type: 'price-drop';
  originalPrice: number;
  currentPrice: number;
  dropAmount?: number;
  dropPercentage?: number;
  targetPrice?: number; // Optional: specific price target
}

export interface LowStockAlert extends Alert {
  type: 'low-stock';
  currentStock: number;
  threshold: number; // Trigger when stock falls below this
}

export interface PriceTargetAlert extends Alert {
  type: 'price-target';
  targetPrice: number;
  currentPrice: number;
  originalPrice: number;
}

export interface AlertStats {
  totalAlerts: number;
  activeAlerts: number;
  triggeredAlerts: number;
  expiredAlerts: number;
  byType: Record<AlertType, number>;
  conversionRate: number; // % of triggered alerts that led to purchase
  averageResponseTime: number; // Average time from trigger to purchase (hours)
}

export interface AlertTriggerEvent {
  alertId: string;
  productId: string;
  type: AlertType;
  previousValue?: number | boolean;
  newValue: number | boolean;
  timestamp: string;
}

export default {
  Alert,
  BackInStockAlert,
  PriceDropAlert,
  LowStockAlert,
  PriceTargetAlert,
  AlertStats,
  AlertTriggerEvent,
};
