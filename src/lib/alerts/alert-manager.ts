/**
 * Alert Manager
 *
 * Core alert management functionality:
 * - Create and manage alerts
 * - Check trigger conditions
 * - Send notifications
 * - Track alert performance
 */

import {
  Alert,
  AlertType,
  AlertStatus,
  AlertPreferences,
  AlertChannel,
  AlertNotification,
  BackInStockAlert,
  PriceDropAlert,
  AlertTriggerEvent,
} from './alert-types';

/**
 * Create a new alert
 */
export function createAlert(params: {
  userId: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  type: AlertType;
  preferences: AlertPreferences;
  priceTarget?: number;
  originalPrice?: number;
  currentPrice?: number;
}): Alert {
  const alert: Alert = {
    id: generateAlertId(),
    userId: params.userId,
    productId: params.productId,
    productName: params.productName,
    productSlug: params.productSlug,
    productImage: params.productImage,
    type: params.type,
    status: 'active',
    createdAt: new Date().toISOString(),
    expiresAt: getExpiryDate(params.type),
    notificationsSent: [],
    preferences: params.preferences,
  };

  // Add type-specific fields
  if (params.type === 'price-drop' && params.originalPrice && params.currentPrice) {
    (alert as PriceDropAlert).originalPrice = params.originalPrice;
    (alert as PriceDropAlert).currentPrice = params.currentPrice;
    if (params.priceTarget) {
      (alert as PriceDropAlert).targetPrice = params.priceTarget;
    }
  }

  return alert;
}

/**
 * Check if alert should be triggered
 */
export function shouldTriggerAlert(
  alert: Alert,
  currentData: {
    stock?: number;
    price?: number;
    inStock?: boolean;
  }
): boolean {
  if (alert.status !== 'active') return false;
  if (alert.expiresAt && new Date(alert.expiresAt) < new Date()) return false;

  switch (alert.type) {
    case 'back-in-stock':
      return currentData.inStock === true || (currentData.stock || 0) > 0;

    case 'price-drop': {
      const priceAlert = alert as PriceDropAlert;
      if (!currentData.price) return false;

      // Check if price dropped below target
      if (priceAlert.targetPrice && currentData.price <= priceAlert.targetPrice) {
        return true;
      }

      // Check if price dropped by threshold percentage
      if (alert.preferences.priceDropThreshold) {
        const dropPercentage =
          ((priceAlert.currentPrice - currentData.price) / priceAlert.currentPrice) * 100;
        return dropPercentage >= alert.preferences.priceDropThreshold;
      }

      return false;
    }

    case 'low-stock':
      return (
        currentData.stock !== undefined &&
        currentData.stock > 0 &&
        currentData.stock <= 5
      );

    case 'price-target': {
      const targetAlert = alert as any;
      return currentData.price !== undefined && currentData.price <= targetAlert.targetPrice;
    }

    default:
      return false;
  }
}

/**
 * Trigger alert and send notifications
 */
export async function triggerAlert(
  alert: Alert,
  currentData: {
    stock?: number;
    price?: number;
    inStock?: boolean;
  }
): Promise<AlertTriggerEvent> {
  const event: AlertTriggerEvent = {
    alertId: alert.id,
    productId: alert.productId,
    type: alert.type,
    timestamp: new Date().toISOString(),
    newValue: currentData.price || currentData.stock || currentData.inStock || 0,
  };

  // Send notifications through preferred channels
  for (const channel of alert.preferences.channels) {
    await sendAlertNotification(alert, channel, currentData);
  }

  return event;
}

/**
 * Send alert notification through specified channel
 */
async function sendAlertNotification(
  alert: Alert,
  channel: AlertChannel,
  currentData: {
    stock?: number;
    price?: number;
    inStock?: boolean;
  }
): Promise<AlertNotification> {
  const notification: AlertNotification = {
    id: generateNotificationId(),
    alertId: alert.id,
    channel,
    sentAt: new Date().toISOString(),
    delivered: false,
  };

  try {
    switch (channel) {
      case 'email':
        await sendEmailNotification(alert, currentData);
        break;
      case 'sms':
        await sendSMSNotification(alert, currentData);
        break;
      case 'push':
        await sendPushNotification(alert, currentData);
        break;
      case 'whatsapp':
        await sendWhatsAppNotification(alert, currentData);
        break;
    }

    notification.delivered = true;
    notification.deliveredAt = new Date().toISOString();
  } catch (error) {
    notification.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return notification;
}

/**
 * Generate email notification content
 */
export function generateAlertEmail(
  alert: Alert,
  currentData: {
    stock?: number;
    price?: number;
    inStock?: boolean;
  }
): {
  subject: string;
  body: string;
  cta: { text: string; url: string };
} {
  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/products/${alert.productSlug}`;

  switch (alert.type) {
    case 'back-in-stock':
      return {
        subject: `🎉 ${alert.productName} is back in stock!`,
        body: generateBackInStockEmailBody(alert, productUrl),
        cta: { text: 'Shop Now', url: productUrl },
      };

    case 'price-drop': {
      const priceAlert = alert as PriceDropAlert;
      const savings = priceAlert.currentPrice - (currentData.price || 0);
      const savingsPercent = (savings / priceAlert.currentPrice) * 100;

      return {
        subject: `💰 Price Drop Alert: ${alert.productName} - Save ${savingsPercent.toFixed(0)}%!`,
        body: generatePriceDropEmailBody(alert, currentData, savings, savingsPercent, productUrl),
        cta: { text: 'Get This Deal', url: productUrl },
      };
    }

    case 'low-stock':
      return {
        subject: `⚠️ Low Stock Alert: ${alert.productName} - Only ${currentData.stock} left!`,
        body: generateLowStockEmailBody(alert, currentData, productUrl),
        cta: { text: 'Buy Before It\'s Gone', url: productUrl },
      };

    case 'price-target':
      return {
        subject: `🎯 Price Target Reached: ${alert.productName}`,
        body: generatePriceTargetEmailBody(alert, currentData, productUrl),
        cta: { text: 'Buy Now', url: productUrl },
      };

    default:
      return {
        subject: `Alert: ${alert.productName}`,
        body: '',
        cta: { text: 'View Product', url: productUrl },
      };
  }
}

/**
 * Email body templates
 */
function generateBackInStockEmailBody(alert: Alert, productUrl: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px;">🎉 Great News!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px;">Your watched item is back!</p>
      </div>

      ${alert.productImage ? `
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${alert.productImage}" alt="${alert.productName}" style="max-width: 300px; border-radius: 12px;" />
        </div>
      ` : ''}

      <h2 style="color: #1f2937; margin-bottom: 10px;">${alert.productName}</h2>
      <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
        The product you've been waiting for is now available. Don't miss out - stock may be limited!
      </p>

      <div style="margin: 30px 0; padding: 20px; background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 8px;">
        <div style="color: #065f46; font-weight: bold; margin-bottom: 5px;">✓ Back in Stock</div>
        <div style="color: #047857; font-size: 14px;">Order now to secure your item</div>
      </div>

      <a href="${productUrl}" style="display: block; width: 100%; padding: 18px; background: #10b981; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; text-align: center; margin: 30px 0;">
        Shop Now →
      </a>

      <p style="text-align: center; color: #ef4444; font-size: 14px; font-weight: bold;">
        ⏰ Stock may run out quickly!
      </p>
    </div>
  `;
}

function generatePriceDropEmailBody(
  alert: Alert,
  currentData: { price?: number },
  savings: number,
  savingsPercent: number,
  productUrl: string
): string {
  const priceAlert = alert as PriceDropAlert;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px;">💰 Price Drop Alert!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px;">Save ${savingsPercent.toFixed(0)}% on your watched item</p>
      </div>

      <h2 style="color: #1f2937; margin-bottom: 10px;">${alert.productName}</h2>

      <div style="margin: 30px 0; padding: 25px; background: #fef2f2; border: 2px solid #ef4444; border-radius: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div>
            <div style="color: #991b1b; font-size: 14px; text-decoration: line-through;">
              Was: ${priceAlert.currentPrice.toLocaleString()} UGX
            </div>
            <div style="color: #ef4444; font-size: 32px; font-weight: bold; margin-top: 5px;">
              Now: ${currentData.price?.toLocaleString()} UGX
            </div>
          </div>
          <div style="text-align: center; padding: 20px; background: #ef4444; color: white; border-radius: 12px;">
            <div style="font-size: 14px;">You Save</div>
            <div style="font-size: 28px; font-weight: bold;">${savingsPercent.toFixed(0)}%</div>
            <div style="font-size: 12px; margin-top: 5px;">${savings.toLocaleString()} UGX</div>
          </div>
        </div>
      </div>

      <a href="${productUrl}" style="display: block; width: 100%; padding: 18px; background: #ef4444; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; text-align: center; margin: 30px 0;">
        Get This Deal Now →
      </a>

      <p style="text-align: center; color: #dc2626; font-size: 14px; font-weight: bold;">
        ⚡ Limited time offer - Price may go back up!
      </p>
    </div>
  `;
}

function generateLowStockEmailBody(
  alert: Alert,
  currentData: { stock?: number },
  productUrl: string
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px;">⚠️ Low Stock Alert!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px;">Only ${currentData.stock} left in stock</p>
      </div>

      <h2 style="color: #1f2937; margin-bottom: 10px;">${alert.productName}</h2>
      <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
        This product is running low on stock. Order now before it's gone!
      </p>

      <div style="margin: 30px 0; padding: 20px; background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px;">
        <div style="color: #92400e; font-weight: bold; margin-bottom: 5px;">
          ⚠️ Only ${currentData.stock} ${currentData.stock === 1 ? 'item' : 'items'} remaining
        </div>
        <div style="color: #b45309; font-size: 14px;">Don't wait - this item may sell out soon</div>
      </div>

      <a href="${productUrl}" style="display: block; width: 100%; padding: 18px; background: #f59e0b; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; text-align: center; margin: 30px 0;">
        Buy Before It's Gone →
      </a>
    </div>
  `;
}

function generatePriceTargetEmailBody(
  alert: Alert,
  currentData: { price?: number },
  productUrl: string
): string {
  const targetAlert = alert as any;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px;">🎯 Price Target Reached!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px;">Your target price has been met</p>
      </div>

      <h2 style="color: #1f2937; margin-bottom: 10px;">${alert.productName}</h2>

      <div style="margin: 30px 0; padding: 20px; background: #eff6ff; border: 2px solid #3b82f6; border-radius: 12px;">
        <div style="color: #1e40af; font-size: 14px; margin-bottom: 5px;">Your target price:</div>
        <div style="color: #3b82f6; font-size: 28px; font-weight: bold;">${targetAlert.targetPrice.toLocaleString()} UGX</div>
        <div style="color: #1e3a8a; font-size: 14px; margin-top: 10px;">
          ✓ Current price: ${currentData.price?.toLocaleString()} UGX
        </div>
      </div>

      <a href="${productUrl}" style="display: block; width: 100%; padding: 18px; background: #3b82f6; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; text-align: center; margin: 30px 0;">
        Buy Now at Your Target Price →
      </a>
    </div>
  `;
}

/**
 * Placeholder notification functions (implement with actual services)
 */
async function sendEmailNotification(alert: Alert, currentData: any): Promise<void> {
  // TODO: Implement with actual email service (SendGrid, AWS SES, etc.)
  console.log('Sending email notification for alert:', alert.id);
}

async function sendSMSNotification(alert: Alert, currentData: any): Promise<void> {
  // TODO: Implement with SMS service (Twilio, Africa's Talking, etc.)
  console.log('Sending SMS notification for alert:', alert.id);
}

async function sendPushNotification(alert: Alert, currentData: any): Promise<void> {
  // TODO: Implement with push service (Firebase Cloud Messaging, OneSignal, etc.)
  console.log('Sending push notification for alert:', alert.id);
}

async function sendWhatsAppNotification(alert: Alert, currentData: any): Promise<void> {
  // TODO: Implement with WhatsApp Business API
  console.log('Sending WhatsApp notification for alert:', alert.id);
}

/**
 * Helper functions
 */
function generateAlertId(): string {
  return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateNotificationId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getExpiryDate(type: AlertType): string {
  const now = new Date();
  // Alerts expire after 90 days
  now.setDate(now.getDate() + 90);
  return now.toISOString();
}

export default {
  createAlert,
  shouldTriggerAlert,
  triggerAlert,
  generateAlertEmail,
};
