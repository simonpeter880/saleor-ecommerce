/**
 * Loyalty Program Configuration
 *
 * Tier definitions, earning rules, and program settings
 */

import { TierConfig, PointsEarningRule, LoyaltyTier } from './loyalty-types';

/**
 * Tier configurations
 */
export const TIER_CONFIGS: Record<LoyaltyTier, TierConfig> = {
  bronze: {
    tier: 'bronze',
    name: 'Bronze',
    pointsRequired: 0,
    color: '#CD7F32',
    icon: '🥉',
    benefits: [
      {
        id: 'bronze-points',
        type: 'bonus-points',
        name: '1x Points',
        description: 'Earn 1 point for every 1,000 UGX spent',
        value: 1,
        icon: '⭐',
      },
    ],
    perks: [
      'Earn points on purchases',
      'Birthday rewards',
      'Exclusive member deals',
    ],
  },
  silver: {
    tier: 'silver',
    name: 'Silver',
    pointsRequired: 1000,
    color: '#C0C0C0',
    icon: '🥈',
    benefits: [
      {
        id: 'silver-points',
        type: 'bonus-points',
        name: '1.25x Points',
        description: 'Earn 25% more points on purchases',
        value: 1.25,
        icon: '⭐',
      },
      {
        id: 'silver-discount',
        type: 'discount',
        name: '5% Discount',
        description: 'Get 5% off all purchases',
        value: 5,
        icon: '💰',
      },
    ],
    perks: [
      'All Bronze perks',
      '25% bonus points',
      '5% discount on all purchases',
      'Early access to sales',
    ],
  },
  gold: {
    tier: 'gold',
    name: 'Gold',
    pointsRequired: 5000,
    color: '#FFD700',
    icon: '🥇',
    benefits: [
      {
        id: 'gold-points',
        type: 'bonus-points',
        name: '1.5x Points',
        description: 'Earn 50% more points on purchases',
        value: 1.5,
        icon: '⭐',
      },
      {
        id: 'gold-discount',
        type: 'discount',
        name: '10% Discount',
        description: 'Get 10% off all purchases',
        value: 10,
        icon: '💰',
      },
      {
        id: 'gold-shipping',
        type: 'free-shipping',
        name: 'Free Shipping',
        description: 'Free standard shipping on all orders',
        icon: '🚚',
      },
    ],
    perks: [
      'All Silver perks',
      '50% bonus points',
      '10% discount on all purchases',
      'Free standard shipping',
      'Priority customer support',
    ],
  },
  platinum: {
    tier: 'platinum',
    name: 'Platinum',
    pointsRequired: 15000,
    color: '#E5E4E2',
    icon: '💎',
    benefits: [
      {
        id: 'platinum-points',
        type: 'bonus-points',
        name: '2x Points',
        description: 'Earn double points on purchases',
        value: 2,
        icon: '⭐',
      },
      {
        id: 'platinum-discount',
        type: 'discount',
        name: '15% Discount',
        description: 'Get 15% off all purchases',
        value: 15,
        icon: '💰',
      },
      {
        id: 'platinum-shipping',
        type: 'free-shipping',
        name: 'Free Express Shipping',
        description: 'Free express shipping on all orders',
        icon: '🚚',
      },
      {
        id: 'platinum-early-access',
        type: 'early-access',
        name: 'VIP Early Access',
        description: 'Get first access to new products and exclusive deals',
        icon: '🎯',
      },
      {
        id: 'platinum-birthday',
        type: 'birthday-gift',
        name: 'Birthday Gift',
        description: 'Special birthday gift worth 50,000 UGX',
        value: 50000,
        icon: '🎁',
      },
    ],
    perks: [
      'All Gold perks',
      'Double points on all purchases',
      '15% discount on all purchases',
      'Free express shipping',
      'VIP early access to new products',
      'Dedicated account manager',
      'Birthday gift (50K UGX value)',
    ],
  },
};

/**
 * Points earning rules
 */
export const EARNING_RULES: PointsEarningRule[] = [
  {
    id: 'purchase',
    action: 'purchase',
    points: 1, // 1 point per 1,000 UGX
    description: 'Earn 1 point for every 1,000 UGX spent',
  },
  {
    id: 'review',
    action: 'review',
    points: 50,
    description: 'Write a product review (with photo: +25 bonus)',
  },
  {
    id: 'review-photo',
    action: 'review',
    points: 25,
    description: 'Bonus points for review with photo',
  },
  {
    id: 'referral',
    action: 'referral',
    points: 500,
    description: 'Refer a friend who makes their first purchase',
  },
  {
    id: 'signup',
    action: 'signup',
    points: 100,
    description: 'Welcome bonus for joining the program',
  },
  {
    id: 'birthday',
    action: 'birthday',
    points: 200,
    description: 'Birthday bonus points',
  },
  {
    id: 'social-share',
    action: 'social-share',
    points: 25,
    description: 'Share a product on social media',
  },
];

/**
 * Program settings
 */
export const LOYALTY_SETTINGS = {
  pointsPerUGX: 0.001, // 1 point per 1,000 UGX
  pointsExpiryMonths: 12, // Points expire after 12 months
  minimumRedemption: 100, // Minimum 100 points to redeem
  pointsValue: 100, // 1 point = 100 UGX
};

/**
 * Get tier configuration
 */
export function getTierConfig(tier: LoyaltyTier): TierConfig {
  return TIER_CONFIGS[tier];
}

/**
 * Get all tiers in order
 */
export function getAllTiers(): TierConfig[] {
  return [
    TIER_CONFIGS.bronze,
    TIER_CONFIGS.silver,
    TIER_CONFIGS.gold,
    TIER_CONFIGS.platinum,
  ];
}

/**
 * Determine tier based on lifetime points
 */
export function calculateTier(lifetimePoints: number): LoyaltyTier {
  if (lifetimePoints >= TIER_CONFIGS.platinum.pointsRequired) {
    return 'platinum';
  } else if (lifetimePoints >= TIER_CONFIGS.gold.pointsRequired) {
    return 'gold';
  } else if (lifetimePoints >= TIER_CONFIGS.silver.pointsRequired) {
    return 'silver';
  }
  return 'bronze';
}

/**
 * Calculate tier progress
 */
export function calculateTierProgress(lifetimePoints: number): {
  currentTier: LoyaltyTier;
  nextTier?: LoyaltyTier;
  currentPoints: number;
  pointsToNextTier: number;
  percentage: number;
} {
  const currentTier = calculateTier(lifetimePoints);
  const allTiers = getAllTiers();
  const currentTierIndex = allTiers.findIndex((t) => t.tier === currentTier);
  const nextTierConfig = allTiers[currentTierIndex + 1];

  if (!nextTierConfig) {
    // Already at max tier
    return {
      currentTier,
      currentPoints: lifetimePoints,
      pointsToNextTier: 0,
      percentage: 100,
    };
  }

  const currentTierPoints = TIER_CONFIGS[currentTier].pointsRequired;
  const nextTierPoints = nextTierConfig.pointsRequired;
  const pointsInCurrentTier = lifetimePoints - currentTierPoints;
  const pointsNeededForNextTier = nextTierPoints - currentTierPoints;
  const percentage = (pointsInCurrentTier / pointsNeededForNextTier) * 100;

  return {
    currentTier,
    nextTier: nextTierConfig.tier,
    currentPoints: pointsInCurrentTier,
    pointsToNextTier: nextTierPoints - lifetimePoints,
    percentage: Math.min(100, Math.max(0, percentage)),
  };
}

/**
 * Calculate points for purchase
 */
export function calculatePurchasePoints(
  amount: number,
  tier: LoyaltyTier
): number {
  const basePoints = Math.floor(amount * LOYALTY_SETTINGS.pointsPerUGX);
  const tierConfig = getTierConfig(tier);
  const multiplier = tierConfig.benefits.find((b) => b.type === 'bonus-points')?.value || 1;

  return Math.floor(basePoints * multiplier);
}

/**
 * Get tier discount percentage
 */
export function getTierDiscount(tier: LoyaltyTier): number {
  const tierConfig = getTierConfig(tier);
  const discountBenefit = tierConfig.benefits.find((b) => b.type === 'discount');
  return discountBenefit?.value || 0;
}

/**
 * Check if tier has free shipping
 */
export function hasFreeShipping(tier: LoyaltyTier): boolean {
  const tierConfig = getTierConfig(tier);
  return tierConfig.benefits.some((b) => b.type === 'free-shipping');
}

/**
 * Convert points to UGX value
 */
export function pointsToUGX(points: number): number {
  return points * LOYALTY_SETTINGS.pointsValue;
}

/**
 * Convert UGX to points required
 */
export function ugxToPoints(ugx: number): number {
  return Math.ceil(ugx / LOYALTY_SETTINGS.pointsValue);
}

export default {
  TIER_CONFIGS,
  EARNING_RULES,
  LOYALTY_SETTINGS,
  getTierConfig,
  getAllTiers,
  calculateTier,
  calculateTierProgress,
  calculatePurchasePoints,
  getTierDiscount,
  hasFreeShipping,
  pointsToUGX,
  ugxToPoints,
};
