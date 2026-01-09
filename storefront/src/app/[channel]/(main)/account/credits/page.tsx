import { Wallet, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { requireAuth } from "@/lib/auth-utils";

export const metadata = {
	title: "Credit Balance - TechHub Electronics",
	description: "View your TechHub credit balance and transactions",
};

export default async function CreditsPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	// Require authentication
	const user = await requireAuth(params.channel, "/account/credits");

	return (
		<div className="bg-gray-50 min-h-screen py-8">
			<div className="max-w-3xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6">
					<Link href={`/${params.channel}/account`} className="text-temu-500 hover:underline text-sm">
						&larr; Back to Account
					</Link>
					<h1 className="text-3xl font-black text-gray-900 mt-2">Store Credits</h1>
				</div>

				{/* Coming Soon Banner */}
				<div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white mb-6">
					<div className="flex items-center gap-3 mb-4">
						<Sparkles size={32} />
						<span className="text-lg font-medium">Coming Soon!</span>
					</div>
					<div className="text-3xl font-black mb-2">Store Credit System</div>
					<p className="text-white/90">We're working on a store credit feature. Stay tuned!</p>
				</div>

				{/* Planned Features */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
					<h3 className="font-bold text-gray-900 mb-4">Planned Features</h3>
					<div className="space-y-3 text-sm text-gray-600">
						<div className="flex items-start gap-3">
							<Lock className="flex-shrink-0 text-gray-400 mt-1" size={16} />
							<div>
								<p className="font-medium text-gray-900">Earn credits through purchases</p>
								<p>Get store credit for every order you place</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<Lock className="flex-shrink-0 text-gray-400 mt-1" size={16} />
							<div>
								<p className="font-medium text-gray-900">Referral bonuses</p>
								<p>Invite friends and earn credits</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<Lock className="flex-shrink-0 text-gray-400 mt-1" size={16} />
							<div>
								<p className="font-medium text-gray-900">Use credits at checkout</p>
								<p>Apply your balance to reduce order totals</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<Lock className="flex-shrink-0 text-gray-400 mt-1" size={16} />
							<div>
								<p className="font-medium text-gray-900">Transaction history</p>
								<p>Track all credit earnings and spending</p>
							</div>
						</div>
					</div>
				</div>

				{/* Info Note */}
				<div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
					<p className="text-blue-900 text-sm">
						<strong>Note:</strong> The store credit system is currently in development.
						We'll notify you via email when this feature becomes available.
					</p>
				</div>
			</div>
		</div>
	);
}
