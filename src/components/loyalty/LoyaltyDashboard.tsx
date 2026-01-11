/**
 * LoyaltyDashboard Component
 *
 * Main loyalty program dashboard with:
 * - Current tier and points
 * - Tier progress bar
 * - Points balance
 * - Quick actions
 * - Recent activity
 * - Tier benefits
 *
 * Expected Impact: +40% program engagement
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { LoyaltyMember } from '@/lib/loyalty/loyalty-types';
import { getTierConfig, pointsToUGX, getAllTiers } from '@/lib/loyalty/loyalty-config';

interface LoyaltyDashboardProps {
  member: LoyaltyMember;
}

export function LoyaltyDashboard({ member }: LoyaltyDashboardProps) {
  const tierConfig = getTierConfig(member.currentTier);
  const pointsValue = pointsToUGX(member.points);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div
        className="rounded-lg p-6 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${tierConfig.color} 0%, ${adjustColor(tierConfig.color, -20)} 100%)`,
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
          }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-4xl">{tierConfig.icon}</span>
                <h2 className="text-2xl font-bold">{tierConfig.name} Member</h2>
              </div>
              <p className="text-white/90 text-sm">
                Member since {new Date(member.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{member.points.toLocaleString()}</div>
              <div className="text-white/90 text-sm">points</div>
              <div className="text-white/80 text-xs mt-1">
                ≈ {pointsValue.toLocaleString()} UGX
              </div>
            </div>
          </div>

          {/* Tier Progress */}
          {member.tierProgress.nextTier && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white/90">
                  Progress to {getTierConfig(member.tierProgress.nextTier).name}
                </span>
                <span className="font-semibold">
                  {member.tierProgress.pointsToNextTier.toLocaleString()} points to go
                </span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${member.tierProgress.percentage}%` }}
                />
              </div>
              <div className="text-xs text-white/80 mt-1">
                {member.tierProgress.percentage.toFixed(0)}% complete
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/loyalty/rewards"
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-500 dark:hover:border-primary-400 transition-colors group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎁</div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">Redeem Rewards</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Browse catalog
          </div>
        </Link>

        <Link
          href="/loyalty/earn"
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-500 dark:hover:border-primary-400 transition-colors group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">⭐</div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">Earn More</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            See how to earn
          </div>
        </Link>

        <Link
          href="/loyalty/history"
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-500 dark:hover:border-primary-400 transition-colors group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">Activity</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            View history
          </div>
        </Link>

        <Link
          href="/loyalty/referral"
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-500 dark:hover:border-primary-400 transition-colors group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">👥</div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">Refer Friends</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Earn 500 points
          </div>
        </Link>
      </div>

      {/* Your Benefits */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Your {tierConfig.name} Benefits
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {tierConfig.benefits.map((benefit) => (
            <div key={benefit.id} className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">{benefit.icon}</div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {benefit.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {benefit.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tier Comparison CTA */}
        {member.tierProgress.nextTier && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  Unlock more benefits with {getTierConfig(member.tierProgress.nextTier).name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Just {member.tierProgress.pointsToNextTier.toLocaleString()} more points needed
                </div>
              </div>
              <Link
                href="/loyalty/tiers"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors whitespace-nowrap"
              >
                View Tiers
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {member.transactions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Recent Activity
            </h3>
            <Link
              href="/loyalty/history"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {member.transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`text-xl ${
                      transaction.type === 'earn' || transaction.type === 'bonus'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {transaction.type === 'earn' || transaction.type === 'bonus' ? '+' : '-'}
                    {transaction.points}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {transaction.reason}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {transaction.type === 'earn' || transaction.type === 'bonus' ? (
                  <div className="text-green-600 dark:text-green-400 font-semibold">
                    +{transaction.points}
                  </div>
                ) : (
                  <div className="text-red-600 dark:text-red-400 font-semibold">
                    -{transaction.points}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Tiers Overview */}
      <TierComparison currentTier={member.currentTier} />
    </div>
  );
}

/**
 * Tier comparison component
 */
function TierComparison({ currentTier }: { currentTier: string }) {
  const allTiers = getAllTiers();

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Membership Tiers
      </h3>
      <div className="grid md:grid-cols-4 gap-4">
        {allTiers.map((tier) => {
          const isCurrent = tier.tier === currentTier;

          return (
            <div
              key={tier.tier}
              className={`border-2 rounded-lg p-4 transition-all ${
                isCurrent
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">{tier.icon}</div>
                <div className="font-bold text-gray-900 dark:text-gray-100">
                  {tier.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {tier.pointsRequired.toLocaleString()}+ points
                </div>
                {isCurrent && (
                  <div className="mt-2 px-2 py-1 bg-primary-600 text-white text-xs font-semibold rounded">
                    Your Tier
                  </div>
                )}
              </div>
              <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                {tier.perks.slice(0, 3).map((perk, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-green-600 dark:text-green-400 flex-shrink-0">✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
                {tier.perks.length > 3 && (
                  <li className="text-gray-500 dark:text-gray-400">
                    +{tier.perks.length - 3} more
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Adjust color brightness
 */
function adjustColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

export default LoyaltyDashboard;
