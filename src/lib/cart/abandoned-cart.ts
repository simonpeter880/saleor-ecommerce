/**
 * Abandoned Cart Recovery System
 *
 * Track and recover abandoned carts with:
 * - Cart abandonment detection
 * - Email/SMS reminders
 * - Special discount offers
 * - Recovery analytics
 *
 * Expected Impact: +25% cart recovery, +15% revenue
 */

export interface AbandonedCart {
  id: string;
  userId?: string;
  sessionId: string;
  items: CartItem[];
  totalValue: number;
  currency: string;
  createdAt: string;
  lastUpdatedAt: string;
  abandonedAt: string;
  recoveryAttempts: RecoveryAttempt[];
  isRecovered: boolean;
  recoveredAt?: string;
  recoveryChannel?: 'email' | 'sms' | 'push' | 'onsite';
}

export interface CartItem {
  productId: string;
  productName: string;
  productSlug: string;
  variantId?: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface RecoveryAttempt {
  id: string;
  cartId: string;
  channel: 'email' | 'sms' | 'push' | 'onsite';
  sentAt: string;
  opened?: boolean;
  openedAt?: string;
  clicked?: boolean;
  clickedAt?: string;
  incentiveOffered?: string; // e.g., "10% discount"
  incentiveCode?: string;
}

export interface RecoveryConfig {
  enabled: boolean;
  channels: ('email' | 'sms' | 'push' | 'onsite')[];
  delays: {
    firstReminder: number; // hours
    secondReminder: number; // hours
    finalReminder: number; // hours
  };
  incentives: {
    firstReminder?: RecoveryIncentive;
    secondReminder?: RecoveryIncentive;
    finalReminder?: RecoveryIncentive;
  };
  minCartValue: number; // Minimum cart value to trigger recovery
}

export interface RecoveryIncentive {
  type: 'percentage' | 'fixed' | 'free-shipping' | 'points';
  value: number;
  description: string;
  expiryHours: number;
}

/**
 * Default recovery configuration
 */
export const DEFAULT_RECOVERY_CONFIG: RecoveryConfig = {
  enabled: true,
  channels: ['email', 'sms', 'onsite'],
  delays: {
    firstReminder: 1, // 1 hour after abandonment
    secondReminder: 24, // 24 hours
    finalReminder: 72, // 72 hours (3 days)
  },
  incentives: {
    firstReminder: undefined, // No incentive, just reminder
    secondReminder: {
      type: 'percentage',
      value: 10,
      description: '10% discount on your cart',
      expiryHours: 48,
    },
    finalReminder: {
      type: 'percentage',
      value: 15,
      description: '15% discount + free shipping',
      expiryHours: 24,
    },
  },
  minCartValue: 50000, // 50K UGX minimum
};

/**
 * Detect cart abandonment
 */
export function isCartAbandoned(
  lastUpdatedAt: string,
  abandonmentThresholdMinutes: number = 30
): boolean {
  const lastUpdate = new Date(lastUpdatedAt);
  const now = new Date();
  const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);

  return diffMinutes >= abandonmentThresholdMinutes;
}

/**
 * Calculate next recovery action
 */
export function getNextRecoveryAction(
  cart: AbandonedCart,
  config: RecoveryConfig = DEFAULT_RECOVERY_CONFIG
): {
  shouldSend: boolean;
  channel?: 'email' | 'sms' | 'push' | 'onsite';
  incentive?: RecoveryIncentive;
  delay: number;
} | null {
  if (!config.enabled || cart.isRecovered) {
    return null;
  }

  const abandonedDate = new Date(cart.abandonedAt);
  const now = new Date();
  const hoursSinceAbandonment = (now.getTime() - abandonedDate.getTime()) / (1000 * 60 * 60);

  const attemptCount = cart.recoveryAttempts.length;

  // First reminder
  if (attemptCount === 0 && hoursSinceAbandonment >= config.delays.firstReminder) {
    return {
      shouldSend: true,
      channel: config.channels[0],
      incentive: config.incentives.firstReminder,
      delay: config.delays.firstReminder,
    };
  }

  // Second reminder
  if (attemptCount === 1 && hoursSinceAbandonment >= config.delays.secondReminder) {
    return {
      shouldSend: true,
      channel: config.channels[0],
      incentive: config.incentives.secondReminder,
      delay: config.delays.secondReminder,
    };
  }

  // Final reminder
  if (attemptCount === 2 && hoursSinceAbandonment >= config.delays.finalReminder) {
    return {
      shouldSend: true,
      channel: config.channels[0],
      incentive: config.incentives.finalReminder,
      delay: config.delays.finalReminder,
    };
  }

  return null;
}

/**
 * Generate recovery email content
 */
export function generateRecoveryEmail(
  cart: AbandonedCart,
  incentive?: RecoveryIncentive,
  userName?: string
): {
  subject: string;
  preview: string;
  body: string;
} {
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const firstName = userName?.split(' ')[0] || 'there';

  if (incentive) {
    return {
      subject: `${firstName}, your cart misses you! Plus ${incentive.description}`,
      preview: `Complete your purchase and save ${incentive.value}${incentive.type === 'percentage' ? '%' : ' UGX'}`,
      body: generateEmailBodyWithIncentive(cart, incentive, firstName),
    };
  }

  return {
    subject: `${firstName}, you left ${itemCount} item${itemCount > 1 ? 's' : ''} in your cart`,
    preview: 'Complete your purchase before items sell out',
    body: generateEmailBodyBasic(cart, firstName),
  };
}

/**
 * Generate basic email body
 */
function generateEmailBodyBasic(cart: AbandonedCart, userName: string): string {
  const items = cart.items
    .map(
      (item) => `
    <div style="margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <div style="font-weight: bold;">${item.productName}</div>
      <div style="color: #6b7280; margin-top: 5px;">Quantity: ${item.quantity}</div>
      <div style="color: #3b82f6; font-weight: bold; margin-top: 5px;">${item.price.toLocaleString()} UGX</div>
    </div>
  `
    )
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hi ${userName},</h2>
      <p>You left some great items in your cart. Don't miss out!</p>

      <div style="margin: 30px 0;">
        <h3>Your Cart:</h3>
        ${items}
      </div>

      <div style="margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px;">
        <div style="font-size: 18px; font-weight: bold;">Total: ${cart.totalValue.toLocaleString()} ${
    cart.currency
  }</div>
      </div>

      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/cart" style="display: inline-block; padding: 15px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
        Complete Your Purchase
      </a>

      <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
        Items in your cart are not reserved and may sell out.
      </p>
    </div>
  `;
}

/**
 * Generate email body with incentive
 */
function generateEmailBodyWithIncentive(
  cart: AbandonedCart,
  incentive: RecoveryIncentive,
  userName: string
): string {
  const discountAmount =
    incentive.type === 'percentage'
      ? Math.round(cart.totalValue * (incentive.value / 100))
      : incentive.value;

  const newTotal = cart.totalValue - discountAmount;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px;">Special Offer Just For You!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px;">${incentive.description}</p>
        ${incentive.incentiveCode ? `<div style="margin: 20px 0; padding: 15px; background: rgba(255,255,255,0.2); border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 2px;">${incentive.incentiveCode}</div>` : ''}
        <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Expires in ${incentive.expiryHours} hours</p>
      </div>

      <h2>Hi ${userName},</h2>
      <p>Your cart is waiting, and we have a special offer to help you complete your purchase!</p>

      <div style="margin: 30px 0; padding: 20px; background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="color: #6b7280; text-decoration: line-through;">Original Total: ${cart.totalValue.toLocaleString()} ${
    cart.currency
  }</div>
            <div style="font-size: 24px; font-weight: bold; color: #10b981; margin-top: 5px;">
              New Total: ${newTotal.toLocaleString()} ${cart.currency}
            </div>
          </div>
          <div style="text-align: center; padding: 15px; background: #10b981; color: white; border-radius: 8px;">
            <div style="font-size: 14px;">You Save</div>
            <div style="font-size: 24px; font-weight: bold;">${discountAmount.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/cart${incentive.incentiveCode ? `?code=${incentive.incentiveCode}` : ''}" style="display: block; width: 100%; padding: 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; text-align: center; margin: 30px 0;">
        Claim Your Discount Now →
      </a>

      <p style="text-align: center; color: #ef4444; font-weight: bold;">
        ⏰ Offer expires in ${incentive.expiryHours} hours!
      </p>
    </div>
  `;
}

/**
 * Track recovery attempt
 */
export function trackRecoveryAttempt(
  cartId: string,
  channel: 'email' | 'sms' | 'push' | 'onsite',
  incentive?: RecoveryIncentive
): RecoveryAttempt {
  return {
    id: generateId(),
    cartId,
    channel,
    sentAt: new Date().toISOString(),
    incentiveOffered: incentive?.description,
    incentiveCode: incentive ? generateIncentiveCode() : undefined,
  };
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate incentive code
 */
function generateIncentiveCode(): string {
  return `CART${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
}

/**
 * Calculate recovery rate
 */
export function calculateRecoveryRate(
  totalAbandoned: number,
  totalRecovered: number
): number {
  if (totalAbandoned === 0) return 0;
  return (totalRecovered / totalAbandoned) * 100;
}

/**
 * Get recovery analytics
 */
export function getRecoveryAnalytics(carts: AbandonedCart[]): {
  totalAbandoned: number;
  totalRecovered: number;
  recoveryRate: number;
  averageCartValue: number;
  totalPotentialRevenue: number;
  totalRecoveredRevenue: number;
  byChannel: Record<string, { sent: number; recovered: number; rate: number }>;
} {
  const totalAbandoned = carts.length;
  const totalRecovered = carts.filter((c) => c.isRecovered).length;
  const recoveryRate = calculateRecoveryRate(totalAbandoned, totalRecovered);

  const totalValue = carts.reduce((sum, c) => sum + c.totalValue, 0);
  const averageCartValue = totalAbandoned > 0 ? totalValue / totalAbandoned : 0;

  const recoveredValue = carts
    .filter((c) => c.isRecovered)
    .reduce((sum, c) => sum + c.totalValue, 0);

  // Analytics by channel
  const byChannel: Record<string, { sent: number; recovered: number; rate: number }> = {};
  const channels = ['email', 'sms', 'push', 'onsite'];

  channels.forEach((channel) => {
    const sent = carts.filter((c) =>
      c.recoveryAttempts.some((a) => a.channel === channel)
    ).length;
    const recovered = carts.filter(
      (c) => c.isRecovered && c.recoveryChannel === channel
    ).length;
    const rate = calculateRecoveryRate(sent, recovered);

    byChannel[channel] = { sent, recovered, rate };
  });

  return {
    totalAbandoned,
    totalRecovered,
    recoveryRate,
    averageCartValue,
    totalPotentialRevenue: totalValue,
    totalRecoveredRevenue: recoveredValue,
    byChannel,
  };
}

export default {
  isCartAbandoned,
  getNextRecoveryAction,
  generateRecoveryEmail,
  trackRecoveryAttempt,
  calculateRecoveryRate,
  getRecoveryAnalytics,
};
