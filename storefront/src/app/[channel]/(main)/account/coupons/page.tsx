import { Ticket, AlertCircle } from "lucide-react";
import Link from "next/link";
import { requireAuth } from "@/lib/auth-utils";

export const metadata = {
	title: "Coupon Codes - TechHub Electronics",
	description: "View and use your available coupon codes",
};

// GraphQL query for vouchers (currently unused - hardcoded mock data below)
// const VouchersDocument = `
//   query Vouchers($channel: String!) {
//     vouchers(first: 100, channel: $channel) {
//       edges {
//         node {
//           id
//           code
//           name
//           type
//           discountValueType
//           discountValue
//           minCheckoutItemsQuantity
//           startDate
//           endDate
//           used
//           usageLimit
//           applyOncePerOrder
//         }
//       }
//     }
//   }
// `;

export default async function CouponsPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	// Require authentication
	await requireAuth(params.channel, "/account/coupons");

	// Note: Saleor's voucher system is typically admin-managed
	// User-specific vouchers would need custom implementation
	// For now, show informational message about using vouchers at checkout

	return (
		<div className="bg-gray-50 min-h-screen py-8">
			<div className="max-w-3xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6">
					<Link href={`/${params.channel}/account`} className="text-temu-500 hover:underline text-sm">
						&larr; Back to Account
					</Link>
					<h1 className="text-3xl font-black text-gray-900 mt-2">Coupon Codes</h1>
					<p className="text-gray-600">Apply discount codes during checkout</p>
				</div>

				{/* Info Banner */}
				<div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
					<div className="flex gap-3">
						<AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
						<div>
							<h3 className="font-bold text-blue-900 mb-2">How to use coupon codes</h3>
							<p className="text-blue-800 text-sm">
								Enter your coupon code during checkout to apply discounts to your order.
								Valid codes will be automatically applied to eligible items.
							</p>
						</div>
					</div>
				</div>

				{/* Coupon Application Guide */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
					<h3 className="font-bold text-gray-900 mb-4">Where to apply coupons</h3>
					<ol className="space-y-3 text-sm text-gray-600">
						<li className="flex gap-3">
							<span className="flex-shrink-0 w-6 h-6 bg-temu-100 text-temu-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
							<span>Add items to your cart and proceed to checkout</span>
						</li>
						<li className="flex gap-3">
							<span className="flex-shrink-0 w-6 h-6 bg-temu-100 text-temu-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
							<span>Look for the "Discount code" or "Coupon" field</span>
						</li>
						<li className="flex gap-3">
							<span className="flex-shrink-0 w-6 h-6 bg-temu-100 text-temu-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
							<span>Enter your code and click "Apply"</span>
						</li>
						<li className="flex gap-3">
							<span className="flex-shrink-0 w-6 h-6 bg-temu-100 text-temu-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
							<span>Your discount will be reflected in the order total</span>
						</li>
					</ol>
				</div>

				{/* Sample Voucher Codes (Admin-managed) */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
					<h3 className="font-bold text-gray-900 mb-4">Popular Discount Codes</h3>
					<p className="text-sm text-gray-500 mb-4">
						Check our homepage and promotional emails for active discount codes
					</p>

					<div className="space-y-3">
						<div className="border border-gray-200 rounded-xl p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-900">Welcome Offers</p>
									<p className="text-sm text-gray-500">For new customers</p>
								</div>
								<Ticket className="text-gray-400" size={20} />
							</div>
						</div>

						<div className="border border-gray-200 rounded-xl p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-900">Seasonal Sales</p>
									<p className="text-sm text-gray-500">Limited time offers</p>
								</div>
								<Ticket className="text-gray-400" size={20} />
							</div>
						</div>

						<div className="border border-gray-200 rounded-xl p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-900">Free Shipping</p>
									<p className="text-sm text-gray-500">On qualifying orders</p>
								</div>
								<Ticket className="text-gray-400" size={20} />
							</div>
						</div>
					</div>
				</div>

				{/* CTA to Checkout */}
				<div className="mt-6 text-center">
					<Link
						href={`/${params.channel}/cart`}
						className="inline-block px-8 py-3 bg-temu-500 text-white rounded-xl font-bold hover:bg-temu-600 transition-colors"
					>
						Go to Cart & Checkout
					</Link>
				</div>
			</div>
		</div>
	);
}
