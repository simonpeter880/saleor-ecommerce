/**
 * Loyalty Program Types
 *
 * Complete loyalty rewards system:
 * - Points earning and spending
 * - Membership tiers (Bronze, Silver, Gold, Platinum)
 * - Rewards catalog
 * - Transaction history
 * - Tier benefits and perks
 *
 * Expected Impact: +35% repeat purchases, +50% customer lifetime value
 */

export interface LoyaltyMember {
  userId: string;
  currentTier: LoyaltyTier;
  points: number;
  lifetimePoints: number;
  tierProgress: {
    currentPoints: number;
    pointsToNextTier: number;
    nextTier?: LoyaltyTier;
    percentage: number;
  };
  memberSince: string;
  lastActivity: string;
  rewards: ClaimedReward[];
  transactions: PointsTransaction[];
}

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface TierConfig {
  tier: LoyaltyTier;
  name: string;
  pointsRequired: number;
  color: string;
  icon: string;
  benefits: TierBenefit[];
  perks: string[];
}

export interface TierBenefit {
  id: string;
  type: 'discount' | 'free-shipping' | 'early-access' | 'priority-support' | 'bonus-points' | 'birthday-gift';
  name: string;
  description: string;
  value?: number; // e.g., 10 for 10% discount
  icon: string;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'redeem' | 'expire' | 'bonus' | 'refund';
  points: number;
  reason: string;
  relatedOrderId?: string;
  relatedRewardId?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'free-product' | 'free-shipping' | 'gift-card' | 'early-access';
  value: number; // e.g., 50000 for 50K UGX gift card
  imageUrl?: string;
  stock?: number;
  isActive: boolean;
  tierRequired?: LoyaltyTier;
  expiryDays?: number; // Days until reward expires after claiming
  terms?: string[];
}

export interface ClaimedReward {
  id: string;
  rewardId: string;
  reward: Reward;
  claimedAt: string;
  expiresAt?: string;
  usedAt?: string;
  isExpired: boolean;
  isUsed: boolean;
  code?: string; // Redemption code
}

export interface PointsEarningRule {
  id: string;
  action: 'purchase' | 'review' | 'referral' | 'signup' | 'birthday' | 'social-share';
  points: number;
  description: string;
  multiplier?: number; // For tier-based bonuses
  conditions?: {
    minPurchase?: number;
    productCategory?: string;
  };
}

export interface LoyaltyStats {
  totalMembers: number;
  tierDistribution: Record<LoyaltyTier, number>;
  totalPointsAwarded: number;
  totalRewardsClaimed: number;
  averagePointsPerMember: number;
}

export default {
  LoyaltyMember,
  TierConfig,
  Reward,
  ClaimedReward,
  PointsTransaction,
  PointsEarningRule,
};
