import { redirect } from "next/navigation";
import { executeGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";
import { getOrderDetails } from "@/app/account-queries";
import Link from "next/link";
import { formatMoney } from "@/lib/utils";
import {
	Package,
	ChevronLeft,
	MapPin,
	CreditCard,
	Truck,
	Clock,
	CheckCircle,
	XCircle,
	Download,
	RefreshCw,
} from "lucide-react";

export const metadata = {
	title: "Order Details - TechHub Electronics",
	description: "View your order details",
};

function getStatusIcon(status: string) {
	switch (status.toLowerCase()) {
		case "unfulfilled":
		case "unconfirmed":
			return <Clock className="w-5 h-5" />;
		case "fulfilled":
		case "delivered":
			return <CheckCircle className="w-5 h-5" />;
		case "partially_fulfilled":
			return <Truck className="w-5 h-5" />;
		case "canceled":
		case "cancelled":
			return <XCircle className="w-5 h-5" />;
		default:
			return <Package className="w-5 h-5" />;
	}
}

function getStatusColor(status: string) {
	switch (status.toLowerCase()) {
		case "unfulfilled":
		case "unconfirmed":
			return "bg-yellow-100 text-yellow-800 border-yellow-200";
		case "fulfilled":
		case "delivered":
			return "bg-green-100 text-green-800 border-green-200";
		case "partially_fulfilled":
			return "bg-blue-100 text-blue-800 border-blue-200";
		case "canceled":
		case "cancelled":
			return "bg-red-100 text-red-800 border-red-200";
		default:
			return "bg-gray-100 text-gray-800 border-gray-200";
	}
}

export default async function OrderDetailsPage(props: {
	params: Promise<{ channel: string; orderId: string }>;
}) {
	const params = await props.params;
	const { channel, orderId } = params;

	// Check if user is logged in
	let user = null;
	try {
		const { me } = await executeGraphQL(CurrentUserDocument, {
			cache: "no-store",
		});
		user = me;
	} catch {
		// User not logged in
	}

	if (!user) {
		redirect(`/${channel}/login?next=/${channel}/account/orders/${orderId}`);
	}

	const order = await getOrderDetails(orderId);

	if (!order) {
		return (
			<div className="min-h-screen bg-gray-50 py-8">
				<div className="container mx-auto px-4 max-w-4xl">
					<div className="bg-white rounded-2xl shadow-sm p-12 text-center">
						<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<Package className="w-10 h-10 text-gray-400" />
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">Order not found</h2>
						<p className="text-gray-600 mb-8">
							We couldn't find this order. It may have been removed or you may not have permission to view it.
						</p>
						<Link
							href={`/${channel}/account/orders`}
							className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
						>
							<ChevronLeft className="w-4 h-4" />
							Back to Orders
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4 max-w-4xl">
				{/* Header */}
				<div className="mb-8">
					<Link
						href={`/${channel}/account/orders`}
						className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4"
					>
						<ChevronLeft className="w-4 h-4" />
						Back to Orders
					</Link>
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">Order #{order.number}</h1>
							<p className="text-gray-600 mt-1">
								Placed on{" "}
								{new Date(order.created).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</p>
						</div>
						<div
							className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${getStatusColor(order.status)}`}
						>
							{getStatusIcon(order.status)}
							<span className="font-medium">{order.statusDisplay || order.status}</span>
						</div>
					</div>
				</div>

				<div className="grid lg:grid-cols-3 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Order Items */}
						<div className="bg-white rounded-2xl shadow-sm overflow-hidden">
							<div className="p-6 border-b border-gray-100">
								<h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
							</div>
							<div className="divide-y divide-gray-100">
								{order.lines.map((line: any) => (
									<div key={line.id} className="p-6 flex gap-4">
										{line.thumbnail?.url ? (
											<img
												src={line.thumbnail.url}
												alt={line.productName}
												className="w-20 h-20 object-cover rounded-xl bg-gray-100"
											/>
										) : (
											<div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
												<Package className="w-8 h-8 text-gray-400" />
											</div>
										)}
										<div className="flex-1">
											<div className="flex justify-between">
												<div>
													{line.productSlug ? (
														<Link
															href={`/${channel}/products/${line.productSlug}`}
															className="font-medium text-gray-900 hover:text-red-500 transition-colors"
														>
															{line.productName}
														</Link>
													) : (
														<p className="font-medium text-gray-900">{line.productName}</p>
													)}
													{line.variantName && (
														<p className="text-sm text-gray-500 mt-1">{line.variantName}</p>
													)}
												</div>
												<p className="font-semibold text-gray-900">
													{formatMoney(
														line.totalPrice.gross.amount,
														line.totalPrice.gross.currency
													)}
												</p>
											</div>
											<div className="flex items-center justify-between mt-2">
												<p className="text-sm text-gray-500">
													{formatMoney(
														line.unitPrice.gross.amount,
														line.unitPrice.gross.currency
													)}{" "}
													× {line.quantity}
												</p>
												<Link
													href={`/${channel}/products/${line.productSlug || ""}`}
													className="text-sm text-red-500 hover:text-red-600 font-medium"
												>
													Buy Again
												</Link>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Shipping Address */}
						{order.shippingAddress && (
							<div className="bg-white rounded-2xl shadow-sm p-6">
								<div className="flex items-center gap-2 mb-4">
									<MapPin className="w-5 h-5 text-gray-500" />
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
									<p>{order.shippingAddress.country?.country}</p>
									{order.shippingAddress.phone && (
										<p className="mt-2">Phone: {order.shippingAddress.phone}</p>
									)}
								</div>
							</div>
						)}

						{/* Billing Address */}
						{order.billingAddress && (
							<div className="bg-white rounded-2xl shadow-sm p-6">
								<div className="flex items-center gap-2 mb-4">
									<CreditCard className="w-5 h-5 text-gray-500" />
									<h2 className="text-lg font-semibold text-gray-900">Billing Address</h2>
								</div>
								<div className="text-gray-600">
									<p className="font-medium text-gray-900">
										{order.billingAddress.firstName} {order.billingAddress.lastName}
									</p>
									<p>{order.billingAddress.streetAddress1}</p>
									{order.billingAddress.streetAddress2 && (
										<p>{order.billingAddress.streetAddress2}</p>
									)}
									<p>
										{order.billingAddress.city}, {order.billingAddress.countryArea}{" "}
										{order.billingAddress.postalCode}
									</p>
									{order.billingAddress.phone && (
										<p className="mt-2">Phone: {order.billingAddress.phone}</p>
									)}
								</div>
							</div>
						)}
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1 space-y-6">
						{/* Order Summary */}
						<div className="bg-white rounded-2xl shadow-sm p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
							<div className="space-y-3">
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
											{order.shippingPrice.gross.amount === 0
												? "Free"
												: formatMoney(
														order.shippingPrice.gross.amount,
														order.shippingPrice.gross.currency
													)}
										</span>
									</div>
								)}
								<div className="border-t border-gray-200 pt-3">
									<div className="flex justify-between text-lg font-semibold text-gray-900">
										<span>Total</span>
										<span>
											{formatMoney(order.total.gross.amount, order.total.gross.currency)}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Payment Status */}
						<div className="bg-white rounded-2xl shadow-sm p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>
							<div className="flex items-center justify-between">
								<span className="text-gray-600">Status</span>
								<span
									className={`px-3 py-1 rounded-full text-sm font-medium ${
										order.paymentStatus === "FULLY_CHARGED"
											? "bg-green-100 text-green-800"
											: "bg-yellow-100 text-yellow-800"
									}`}
								>
									{order.paymentStatusDisplay || order.paymentStatus}
								</span>
							</div>
						</div>

						{/* Actions */}
						<div className="bg-white rounded-2xl shadow-sm p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
							<div className="space-y-3">
								{order.trackingClientId && (
									<button className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors">
										<Truck className="w-4 h-4" />
										Track Shipment
									</button>
								)}
								{order.invoices && order.invoices.length > 0 && (
									<a
										href={order.invoices[0].url}
										target="_blank"
										rel="noopener noreferrer"
										className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-900 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
									>
										<Download className="w-4 h-4" />
										Download Invoice
									</a>
								)}
								<button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-900 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
									<RefreshCw className="w-4 h-4" />
									Reorder Items
								</button>
							</div>
						</div>

						{/* Need Help */}
						<div className="bg-gray-100 rounded-2xl p-6">
							<h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
							<p className="text-sm text-gray-600 mb-4">
								Have questions about your order? Our support team is here to help.
							</p>
							<Link
								href={`/${channel}/contact`}
								className="text-red-500 hover:text-red-600 font-medium text-sm"
							>
								Contact Support →
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
