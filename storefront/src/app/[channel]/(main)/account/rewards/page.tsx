import { Gift, Star, Trophy, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { requireAuth } from "@/lib/auth-utils";

export const metadata = {
	title: "Rewards & Points - TechHub Electronics",
	description: "View your rewards points and redeem them for discounts",
};

export default async function RewardsPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	// Require authentication
	const user = await requireAuth(params.channel, "/account/rewards");

	return (
		<div className="bg-gray-50 min-h-screen py-8">
			<div className="max-w-3xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6">
					<Link href={`/${params.channel}/account`} className="text-temu-500 hover:underline text-sm">
						&larr; Back to Account
					</Link>
					<h1 className="text-3xl font-black text-gray-900 mt-2">Rewards Program</h1>
				</div>

				{/* Coming Soon Banner */}
				<div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-8 text-white mb-6">
					<div className="flex items-center gap-3 mb-4">
						<Sparkles size={32} />
						<span className="text-lg font-medium">Coming Soon!</span>
					</div>
					<div className="text-3xl font-black mb-2">Loyalty Rewards Program</div>
					<p className="text-white/90">Earn points and unlock exclusive benefits</p>
				</div>

				{/* Planned Rewards Tiers */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
					<h3 className="font-bold text-gray-900 mb-4">Planned Membership Tiers</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="border-2 border-gray-200 rounded-xl p-4 text-center">
							<div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
								<Trophy className="text-gray-400" size={24} />
							</div>
							<p className="font-bold text-gray-900">Bronze</p>
							<p className="text-sm text-gray-500">0-499 points</p>
						</div>
						<div className="border-2 border-gray-300 rounded-xl p-4 text-center bg-gray-50">
							<div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
								<Trophy className="text-gray-500" size={24} />
							</div>
							<p className="font-bold text-gray-900">Silver</p>
							<p className="text-sm text-gray-500">500-999 points</p>
						</div>
						<div className="border-2 border-yellow-300 rounded-xl p-4 text-center bg-yellow-50">
							<div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-3">
								<Trophy className="text-yellow-600" size={24} />
							</div>
							<p className="font-bold text-gray-900">Gold</p>
							<p className="text-sm text-gray-500">1000+ points</p>
						</div>
					</div>
				</div>

				{/* How to Earn */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
					<h3 className="font-bold text-gray-900 mb-4">Planned Ways to Earn Points</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="flex items-start gap-3">
							<Lock className="flex-shrink-0 text-gray-400 mt-1" size={20} />
							<div>
								<p className="font-medium text-gray-900">Shop & Earn</p>
								<p className="text-sm text-gray-500">Earn 1 point per UGX 1,000 spent</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<Lock className="flex-shrink-0 text-gray-400 mt-1" size={20} />
							<div>
								<p className="font-medium text-gray-900">Write Reviews</p>
								<p className="text-sm text-gray-500">Earn 50 points per product review</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<Lock className="flex-shrink-0 text-gray-400 mt-1" size={20} />
							<div>
								<p className="font-medium text-gray-900">Refer Friends</p>
								<p className="text-sm text-gray-500">Get 500 points per successful referral</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<Lock className="flex-shrink-0 text-gray-400 mt-1" size={20} />
							<div>
								<p className="font-medium text-gray-900">Daily Check-in</p>
								<p className="text-sm text-gray-500">Earn 10 points every day you visit</p>
							</div>
						</div>
					</div>
				</div>

				{/* Info Note */}
				<div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
					<p className="text-blue-900 text-sm">
						<strong>Note:</strong> The rewards program is currently in development.
						This feature will allow you to earn points through purchases, reviews, and referrals,
						then redeem them for discounts and exclusive benefits.
					</p>
				</div>
			</div>
		</div>
	);
}
