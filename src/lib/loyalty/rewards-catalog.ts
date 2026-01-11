/**
 * Rewards Catalog
 *
 * Available rewards for redemption
 */

import { Reward } from './loyalty-types';

export const REWARDS_CATALOG: Reward[] = [
  // Discount Vouchers
  {
    id: 'voucher-10k',
    name: '10,000 UGX Discount Voucher',
    description: 'Get 10,000 UGX off your next purchase (minimum 50,000 UGX)',
    pointsCost: 100,
    type: 'discount',
    value: 10000,
    isActive: true,
    expiryDays: 30,
    terms: [
      'Minimum purchase of 50,000 UGX required',
      'Valid for 30 days from redemption',
      'Cannot be combined with other offers',
      'One voucher per order',
    ],
  },
  {
    id: 'voucher-25k',
    name: '25,000 UGX Discount Voucher',
    description: 'Get 25,000 UGX off your next purchase (minimum 100,000 UGX)',
    pointsCost: 250,
    type: 'discount',
    value: 25000,
    isActive: true,
    expiryDays: 30,
    terms: [
      'Minimum purchase of 100,000 UGX required',
      'Valid for 30 days from redemption',
      'Cannot be combined with other offers',
      'One voucher per order',
    ],
  },
  {
    id: 'voucher-50k',
    name: '50,000 UGX Discount Voucher',
    description: 'Get 50,000 UGX off your next purchase (minimum 200,000 UGX)',
    pointsCost: 500,
    type: 'discount',
    value: 50000,
    isActive: true,
    tierRequired: 'silver',
    expiryDays: 60,
    terms: [
      'Minimum purchase of 200,000 UGX required',
      'Valid for 60 days from redemption',
      'Cannot be combined with other offers',
      'One voucher per order',
      'Silver tier or higher required',
    ],
  },
  {
    id: 'voucher-100k',
    name: '100,000 UGX Discount Voucher',
    description: 'Get 100,000 UGX off your next purchase (minimum 500,000 UGX)',
    pointsCost: 1000,
    type: 'discount',
    value: 100000,
    isActive: true,
    tierRequired: 'gold',
    expiryDays: 90,
    terms: [
      'Minimum purchase of 500,000 UGX required',
      'Valid for 90 days from redemption',
      'Cannot be combined with other offers',
      'One voucher per order',
      'Gold tier or higher required',
    ],
  },

  // Free Shipping
  {
    id: 'free-shipping-standard',
    name: 'Free Standard Shipping',
    description: 'Get free standard shipping on your next order',
    pointsCost: 50,
    type: 'free-shipping',
    value: 5000,
    isActive: true,
    expiryDays: 30,
    terms: [
      'Valid for one order',
      'Valid for 30 days from redemption',
      'Standard shipping only (2-5 business days)',
    ],
  },
  {
    id: 'free-shipping-express',
    name: 'Free Express Shipping',
    description: 'Get free express shipping on your next order (next day delivery)',
    pointsCost: 100,
    type: 'free-shipping',
    value: 15000,
    isActive: true,
    tierRequired: 'silver',
    expiryDays: 30,
    terms: [
      'Valid for one order',
      'Valid for 30 days from redemption',
      'Express shipping (next day delivery in Kampala)',
      'Silver tier or higher required',
    ],
  },

  // Gift Cards
  {
    id: 'gift-card-50k',
    name: '50,000 UGX Gift Card',
    description: 'Redeemable gift card worth 50,000 UGX',
    pointsCost: 500,
    type: 'gift-card',
    value: 50000,
    isActive: true,
    expiryDays: 180,
    terms: [
      'Can be used like cash on our store',
      'Valid for 180 days from redemption',
      'No minimum purchase required',
      'Can be combined with sales',
    ],
  },
  {
    id: 'gift-card-100k',
    name: '100,000 UGX Gift Card',
    description: 'Redeemable gift card worth 100,000 UGX',
    pointsCost: 1000,
    type: 'gift-card',
    value: 100000,
    isActive: true,
    tierRequired: 'silver',
    expiryDays: 180,
    terms: [
      'Can be used like cash on our store',
      'Valid for 180 days from redemption',
      'No minimum purchase required',
      'Can be combined with sales',
      'Silver tier or higher required',
    ],
  },
  {
    id: 'gift-card-250k',
    name: '250,000 UGX Gift Card',
    description: 'Redeemable gift card worth 250,000 UGX',
    pointsCost: 2500,
    type: 'gift-card',
    value: 250000,
    isActive: true,
    tierRequired: 'gold',
    expiryDays: 365,
    terms: [
      'Can be used like cash on our store',
      'Valid for 1 year from redemption',
      'No minimum purchase required',
      'Can be combined with sales',
      'Gold tier or higher required',
    ],
  },

  // Early Access
  {
    id: 'early-access-24h',
    name: '24-Hour Early Access',
    description: 'Get 24-hour early access to our next major sale',
    pointsCost: 200,
    type: 'early-access',
    value: 0,
    isActive: true,
    tierRequired: 'silver',
    terms: [
      'Access to exclusive pre-sale',
      '24 hours before public sale starts',
      'Limited quantities available',
      'Silver tier or higher required',
    ],
  },
  {
    id: 'early-access-new-products',
    name: 'New Product Early Access',
    description: 'Get first access to the next 3 new product launches',
    pointsCost: 300,
    type: 'early-access',
    value: 0,
    isActive: true,
    tierRequired: 'gold',
    expiryDays: 90,
    terms: [
      'Access to new products before public launch',
      'Valid for next 3 product launches',
      'Valid for 90 days from redemption',
      'Gold tier or higher required',
    ],
  },

  // Free Products
  {
    id: 'free-phone-case',
    name: 'Free Premium Phone Case',
    description: 'Get a free premium phone case (worth 30,000 UGX)',
    pointsCost: 300,
    type: 'free-product',
    value: 30000,
    isActive: true,
    stock: 50,
    terms: [
      'Choose from available models',
      'Subject to availability',
      'Free shipping included',
    ],
  },
  {
    id: 'free-earbuds',
    name: 'Free Wireless Earbuds',
    description: 'Get free wireless earbuds (worth 80,000 UGX)',
    pointsCost: 800,
    type: 'free-product',
    value: 80000,
    isActive: true,
    tierRequired: 'silver',
    stock: 25,
    terms: [
      'Premium wireless earbuds',
      'Subject to availability',
      'Free shipping included',
      'Silver tier or higher required',
    ],
  },
  {
    id: 'free-smartwatch',
    name: 'Free Smartwatch',
    description: 'Get a free smartwatch (worth 200,000 UGX)',
    pointsCost: 2000,
    type: 'free-product',
    value: 200000,
    isActive: true,
    tierRequired: 'gold',
    stock: 10,
    terms: [
      'Premium smartwatch with fitness tracking',
      'Subject to availability',
      'Free shipping included',
      'Gold tier or higher required',
    ],
  },
];

/**
 * Get available rewards for a tier
 */
export function getAvailableRewards(tier: string): Reward[] {
  const tierHierarchy = ['bronze', 'silver', 'gold', 'platinum'];
  const tierIndex = tierHierarchy.indexOf(tier);

  return REWARDS_CATALOG.filter((reward) => {
    if (!reward.isActive) return false;
    if (!reward.tierRequired) return true;

    const requiredIndex = tierHierarchy.indexOf(reward.tierRequired);
    return tierIndex >= requiredIndex;
  });
}

/**
 * Get reward by ID
 */
export function getRewardById(id: string): Reward | undefined {
  return REWARDS_CATALOG.find((reward) => reward.id === id);
}

/**
 * Check if user can claim reward
 */
export function canClaimReward(
  reward: Reward,
  userPoints: number,
  userTier: string
): { canClaim: boolean; reason?: string } {
  if (!reward.isActive) {
    return { canClaim: false, reason: 'This reward is no longer available' };
  }

  if (reward.stock !== undefined && reward.stock <= 0) {
    return { canClaim: false, reason: 'Out of stock' };
  }

  if (userPoints < reward.pointsCost) {
    return {
      canClaim: false,
      reason: `You need ${reward.pointsCost - userPoints} more points`,
    };
  }

  if (reward.tierRequired) {
    const tierHierarchy = ['bronze', 'silver', 'gold', 'platinum'];
    const userTierIndex = tierHierarchy.indexOf(userTier);
    const requiredTierIndex = tierHierarchy.indexOf(reward.tierRequired);

    if (userTierIndex < requiredTierIndex) {
      return {
        canClaim: false,
        reason: `${reward.tierRequired.charAt(0).toUpperCase() + reward.tierRequired.slice(1)} tier required`,
      };
    }
  }

  return { canClaim: true };
}

export default {
  REWARDS_CATALOG,
  getAvailableRewards,
  getRewardById,
  canClaimReward,
};
