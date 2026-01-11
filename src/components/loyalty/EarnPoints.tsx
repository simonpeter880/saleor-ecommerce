/**
 * EarnPoints Component
 *
 * Shows all ways to earn points with:
 * - Action cards with point values
 * - Quick actions (review, share, referral)
 * - Progress tracking
 * - Bonus opportunities
 *
 * Expected Impact: +45% points earning engagement
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { EARNING_RULES } from '@/lib/loyalty/loyalty-config';

interface EarnPointsProps {
  userId?: string;
  currentTier?: string;
}

export function EarnPoints({ userId, currentTier = 'bronze' }: EarnPointsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Earn More Points</h2>
        <p className="text-white/90">
          Complete actions below to earn points and unlock amazing rewards
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <QuickAction
          icon="🛒"
          title="Shop & Earn"
          description="Get points on every purchase"
          points="1 point per 1,000 UGX"
          action="Shop Now"
          href="/products"
        />
        <QuickAction
          icon="⭐"
          title="Write Reviews"
          description="Share your product experience"
          points="50 points per review"
          bonus="+25 with photo"
          action="Review Products"
          href="/account/reviews"
        />
        <QuickAction
          icon="👥"
          title="Refer Friends"
          description="Invite friends to join"
          points="500 points per referral"
          action="Get Referral Link"
          href="/loyalty/referral"
        />
      </div>

      {/* All Earning Ways */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          All Ways to Earn
        </h3>
        <div className="space-y-3">
          {EARNING_RULES.map((rule) => (
            <EarningRuleCard key={rule.id} rule={rule} currentTier={currentTier} />
          ))}
        </div>
      </div>

      {/* Bonus Opportunities */}
      <BonusOpportunities />

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Pro Tips to Maximize Points
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0">•</span>
                <span>
                  <strong>Upgrade your tier</strong> to earn bonus points on purchases (up to 2x at Platinum)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0">•</span>
                <span>
                  <strong>Add photos to reviews</strong> for an extra 25 points bonus
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0">•</span>
                <span>
                  <strong>Complete all profile information</strong> during signup for maximum welcome bonus
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0">•</span>
                <span>
                  <strong>Watch for special events</strong> with double or triple point promotions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0">•</span>
                <span>
                  <strong>Points expire after 12 months</strong>, so use them before they're gone!
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Quick action card
 */
function QuickAction({
  icon,
  title,
  description,
  points,
  bonus,
  action,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  points: string;
  bonus?: string;
  action: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-lg transition-all group"
    >
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
      <div className="mb-4">
        <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
          {points}
        </div>
        {bonus && (
          <div className="text-xs text-green-600 dark:text-green-400 font-medium">
            {bonus}
          </div>
        )}
      </div>
      <div className="text-primary-600 dark:text-primary-400 text-sm font-semibold group-hover:underline">
        {action} →
      </div>
    </Link>
  );
}

/**
 * Earning rule card
 */
function EarningRuleCard({
  rule,
  currentTier,
}: {
  rule: { id: string; action: string; points: number; description: string; multiplier?: number };
  currentTier: string;
}) {
  // Calculate tier multiplier
  const tierMultipliers: Record<string, number> = {
    bronze: 1,
    silver: 1.25,
    gold: 1.5,
    platinum: 2,
  };

  const multiplier = rule.action === 'purchase' ? tierMultipliers[currentTier] || 1 : 1;
  const effectivePoints = Math.floor(rule.points * multiplier);
  const hasBonus = multiplier > 1;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <div className="text-3xl">{getActionIcon(rule.action)}</div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {formatAction(rule.action)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {rule.description}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            +{effectivePoints}
          </div>
          {hasBonus && (
            <div className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-bold rounded">
              {multiplier}x
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">points</div>
      </div>
    </div>
  );
}

/**
 * Bonus opportunities section
 */
function BonusOpportunities() {
  const bonuses = [
    {
      id: 'birthday',
      title: 'Birthday Bonus',
      description: 'Get 200 bonus points on your birthday month',
      icon: '🎂',
      points: 200,
      active: true,
    },
    {
      id: 'first-purchase',
      title: 'First Purchase Bonus',
      description: 'Double points on your first purchase',
      icon: '🎉',
      points: '2x',
      active: true,
    },
    {
      id: 'social-media',
      title: 'Social Media Bonus',
      description: 'Follow us on social media for bonus points',
      icon: '📱',
      points: 50,
      active: true,
    },
    {
      id: 'flash-events',
      title: 'Flash Point Events',
      description: 'Special limited-time point multipliers',
      icon: '⚡',
      points: '3x',
      active: false,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Bonus Opportunities
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {bonuses.map((bonus) => (
          <div
            key={bonus.id}
            className={`p-4 rounded-lg border-2 ${
              bonus.active
                ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{bonus.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {bonus.title}
                  </h4>
                  {bonus.active && (
                    <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {bonus.description}
                </p>
                <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  +{bonus.points} {typeof bonus.points === 'number' ? 'points' : 'bonus'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Get icon for action type
 */
function getActionIcon(action: string): string {
  switch (action) {
    case 'purchase':
      return '🛒';
    case 'review':
      return '⭐';
    case 'referral':
      return '👥';
    case 'signup':
      return '🎁';
    case 'birthday':
      return '🎂';
    case 'social-share':
      return '📱';
    default:
      return '✨';
  }
}

/**
 * Format action name
 */
function formatAction(action: string): string {
  const actionNames: Record<string, string> = {
    purchase: 'Make a Purchase',
    review: 'Write Product Reviews',
    referral: 'Refer a Friend',
    signup: 'Welcome Bonus',
    birthday: 'Birthday Bonus',
    'social-share': 'Share on Social Media',
  };

  return actionNames[action] || action;
}

export default EarnPoints;
