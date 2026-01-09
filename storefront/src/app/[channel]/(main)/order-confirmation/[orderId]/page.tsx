import { executeGraphQL } from "@/lib/graphql";
import { OrderByIdDocument } from "@/gql/graphql";
import Link from "next/link";
import { formatMoney } from "@/lib/utils";
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react";

export const metadata = {
	title: "Order Confirmed - TechHub Electronics",
	description: "Your order has been placed successfully",
};

export default async function OrderConfirmationPage(props: {
	params: Promise<{ channel: string; orderId: string }>;
}) {
	const params = await props.params;
	const { channel, orderId } = params;

	let order = null;
	try {
		const { order: orderData } = await executeGraphQL(OrderByIdDocument, {
			variables: { id: orderId },
			cache: "no-store",
		});
		order = orderData;
	} catch (error) {
		console.error("Failed to fetch order:", error);
	}

	if (!order) {
		return (
			<div className="container mx-auto px-4 py-16 text-center">
				<h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
				<p className="text-gray-600 mb-8">We couldn't find the order you're looking for.</p>
				<Link
					href={`/${channel}`}
					className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
				>
					Continue Shopping
					<ArrowRight className="w-4 h-4" />
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4 max-w-3xl">
				{/* Success Header */}
				<div className="bg-white rounded-2xl shadow-sm p-8 text-center mb-6">
					<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<CheckCircle className="w-10 h-10 text-green-600" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
					<p className="text-gray-600 mb-4">
						Thank you for your purchase. Your order has been placed successfully.
					</p>
					<div className="bg-gray-100 rounded-lg px-4 py-2 inline-block">
						<span className="text-sm text-gray-500">Order Number:</span>
						<span className="text-lg font-semibold text-gray-900 ml-2">#{order.number}</span>
					</div>
				</div>

				{/* Order Status */}
				<div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
							<Package className="w-4 h-4" />
							<span className="text-sm font-medium">{order.status}</span>
						</div>
						{order.isPaid && (
							<div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
								<CheckCircle className="w-4 h-4" />
								<span className="text-sm font-medium">Payment Received</span>
							</div>
						)}
					</div>
				</div>

				{/* Order Items */}
				<div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
					<div className="divide-y divide-gray-100">
						{order.lines.map((line) => (
							<div key={line.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
								{line.thumbnail?.url && (
									<img
										src={line.thumbnail.url}
										alt={line.productName}
										className="w-16 h-16 object-cover rounded-lg bg-gray-100"
									/>
								)}
								<div className="flex-1">
									<h3 className="font-medium text-gray-900">{line.productName}</h3>
									<p className="text-sm text-gray-500">{line.variantName}</p>
									<p className="text-sm text-gray-500">Qty: {line.quantity}</p>
								</div>
								<div className="text-right">
									<p className="font-medium text-gray-900">
										{formatMoney(line.totalPrice.gross.amount, line.totalPrice.gross.currency)}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Order Summary */}
				<div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
					<div className="space-y-2">
						<div className="flex justify-between text-gray-600">
							<span>Subtotal</span>
							<span>
								{formatMoney(order.subtotal.gross.amount, order.subtotal.gross.currency)}
							</span>
						</div>
						{order.shippingPrice && (
							<div className="flex justify-between text-gray-600">
								<span>Shipping</span>
								<span>
									{formatMoney(
										order.shippingPrice.gross.amount,
										order.shippingPrice.gross.currency
									)}
								</span>
							</div>
						)}
						<div className="border-t border-gray-200 pt-2 mt-2">
							<div className="flex justify-between text-lg font-semibold text-gray-900">
								<span>Total</span>
								<span>{formatMoney(order.total.gross.amount, order.total.gross.currency)}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Shipping Address */}
				{order.shippingAddress && (
					<div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
						<div className="flex items-center gap-2 mb-4">
							<Truck className="w-5 h-5 text-gray-500" />
							<h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
						</div>
						<div className="text-gray-600">
							<p className="font-medium text-gray-900">
								{order.shippingAddress.firstName} {order.shippingAddress.lastName}
							</p>
							<p>{order.shippingAddress.streetAddress1}</p>
							{order.shippingAddress.streetAddress2 && (
								<p>{order.shippingAddress.streetAddress2}</p>
							)}
							<p>
								{order.shippingAddress.city}, {order.shippingAddress.countryArea}{" "}
								{order.shippingAddress.postalCode}
							</p>
							<p>{order.shippingAddress.country.country}</p>
							{order.shippingAddress.phone && <p className="mt-2">Phone: {order.shippingAddress.phone}</p>}
						</div>
					</div>
				)}

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-4">
					<Link
						href={`/${channel}`}
						className="flex-1 bg-red-500 text-white text-center py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
					>
						Continue Shopping
					</Link>
					<Link
						href={`/${channel}/account/orders`}
						className="flex-1 bg-gray-100 text-gray-900 text-center py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
					>
						View Order History
					</Link>
				</div>
			</div>
		</div>
	);
}
