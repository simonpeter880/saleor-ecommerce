"use client";

import { Users, Gift, TrendingUp, Crown } from "lucide-react";
import Link from "next/link";
import { ReferralProgram } from "./ReferralProgram";

export function ReferralPage({ channel }: { channel: string }) {
	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
			{/* Hero Section */}
			<div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<div className="flex items-center justify-center gap-3 mb-4">
						<Users size={40} className="animate-bounce" />
						<h1 className="text-4xl font-black">Refer & Earn</h1>
					</div>
					<p className="text-purple-100 text-lg max-w-xl mx-auto">
						Share TechHub with friends and family. You both earn rewards when they make their first purchase!
					</p>
				</div>
			</div>

			{/* Benefits Bar */}
			<div className="bg-white shadow-md border-b">
				<div className="max-w-4xl mx-auto px-4 py-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
								<Gift className="text-green-600" size={24} />
							</div>
							<div>
								<p className="font-bold text-gray-800">Earn UGX 5,000</p>
								<p className="text-sm text-gray-500">Per successful referral</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
								<TrendingUp className="text-purple-600" size={24} />
							</div>
							<div>
								<p className="font-bold text-gray-800">Unlimited Referrals</p>
								<p className="text-sm text-gray-500">No cap on earnings</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
								<Crown className="text-yellow-600" size={24} />
							</div>
							<div>
								<p className="font-bold text-gray-800">VIP Status</p>
								<p className="text-sm text-gray-500">10+ referrals = VIP perks</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-4xl mx-auto px-4 py-12">
				<ReferralProgram channel={channel} />

				{/* FAQ Section */}
				<div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
					<h2 className="text-2xl font-black text-gray-800 mb-6">Frequently Asked Questions</h2>

					<div className="space-y-6">
						<div>
							<h3 className="font-bold text-gray-800 mb-2">How do I earn referral rewards?</h3>
							<p className="text-gray-600">
								Share your unique referral code or link with friends. When they sign up and make their first purchase of UGX 20,000 or more, you'll receive UGX 5,000 in credits.
							</p>
						</div>

						<div>
							<h3 className="font-bold text-gray-800 mb-2">When do I get my rewards?</h3>
							<p className="text-gray-600">
								Rewards are credited to your account within 24 hours after your friend's first order is confirmed and shipped.
							</p>
						</div>

						<div>
							<h3 className="font-bold text-gray-800 mb-2">Is there a limit to how many friends I can refer?</h3>
							<p className="text-gray-600">
								No! You can refer as many friends as you want. The more friends you refer, the more you earn.
							</p>
						</div>

						<div>
							<h3 className="font-bold text-gray-800 mb-2">What does my friend get?</h3>
							<p className="text-gray-600">
								Your friend receives UGX 2,500 off their first order when they sign up using your referral code.
							</p>
						</div>

						<div>
							<h3 className="font-bold text-gray-800 mb-2">How do I use my referral credits?</h3>
							<p className="text-gray-600">
								Referral credits are automatically applied to your account balance and can be used towards any purchase on TechHub.
							</p>
						</div>
					</div>
				</div>

				{/* CTA */}
				<div className="mt-12 text-center">
					<Link
						href={`/${channel}/games`}
						className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
					>
						Explore More Ways to Earn
					</Link>
				</div>
			</div>
		</div>
	);
}
