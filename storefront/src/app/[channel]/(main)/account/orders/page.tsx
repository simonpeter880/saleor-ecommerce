import { redirect } from "next/navigation";
import { executeGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";
import { getUserOrders } from "@/app/account-queries";
import Link from "next/link";
import { formatMoney } from "@/lib/utils";
import { Package, ChevronRight, ShoppingBag, Clock, CheckCircle, Truck, XCircle } from "lucide-react";

export const metadata = {
	title: "Order History - TechHub Electronics",
	description: "View your order history and track your purchases",
};

function getStatusIcon(status: string) {
	switch (status.toLowerCase()) {
		case "unfulfilled":
		case "unconfirmed":
			return <Clock className="w-4 h-4" />;
		case "fulfilled":
		case "delivered":
			return <CheckCircle className="w-4 h-4" />;
		case "partially_fulfilled":
			return <Truck className="w-4 h-4" />;
		case "canceled":
		case "cancelled":
			return <XCircle className="w-4 h-4" />;
		default:
			return <Package className="w-4 h-4" />;
	}
}

function getStatusColor(status: string) {
	switch (status.toLowerCase()) {
		case "unfulfilled":
		case "unconfirmed":
			return "bg-yellow-100 text-yellow-800";
		case "fulfilled":
		case "delivered":
			return "bg-green-100 text-green-800";
		case "partially_fulfilled":
			return "bg-blue-100 text-blue-800";
		case "canceled":
		case "cancelled":
			return "bg-red-100 text-red-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}

function getPaymentStatusColor(status: string) {
	switch (status.toLowerCase()) {
		case "fully_charged":
		case "paid":
			return "bg-green-100 text-green-800";
		case "pending":
		case "not_charged":
			return "bg-yellow-100 text-yellow-800";
		case "refunded":
		case "partially_refunded":
			return "bg-blue-100 text-blue-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}

export default async function OrderHistoryPage(props: {
	params: Promise<{ channel: string }>;
}) {
	const params = await props.params;
	const { channel } = params;

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
		redirect(`/${channel}/login?next=/${channel}/account/orders`);
	}

	const orders = await getUserOrders(channel);

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4 max-w-4xl">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Order History</h1>
						<p className="text-gray-600 mt-1">Track and manage your orders</p>
					</div>
					<Link
						href={`/${channel}/account`}
						className="text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
					>
						Back to Account
						<ChevronRight className="w-4 h-4" />
					</Link>
				</div>

				{orders.length === 0 ? (
					<div className="bg-white rounded-2xl shadow-sm p-12 text-center">
						<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<ShoppingBag className="w-10 h-10 text-gray-400" />
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
						<p className="text-gray-600 mb-8">
							When you place an order, it will appear here for you to track.
						</p>
						<Link
							href={`/${channel}/products`}
							className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
						>
							Start Shopping
							<ChevronRight className="w-4 h-4" />
						</Link>
					</div>
				) : (
					<div className="space-y-4">
						{orders.map((order: any) => (
							<div
								key={order.id}
								className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
							>
								{/* Order Header */}
								<div className="p-6 border-b border-gray-100">
									<div className="flex flex-wrap items-center justify-between gap-4">
										<div>
											<div className="flex items-center gap-3 mb-2">
												<span className="font-semibold text-gray-900">
													Order #{order.number}
												</span>
												<span
													className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
												>
													{getStatusIcon(order.status)}
													{order.statusDisplay || order.status}
												</span>
											</div>
											<p className="text-sm text-gray-500">
												Placed on {new Date(order.created).toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</p>
										</div>
										<div className="text-right">
											<p className="text-lg font-bold text-gray-900">
												{formatMoney(order.total.gross.amount, order.total.gross.currency)}
											</p>
											<span
												className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}
											>
												{order.paymentStatusDisplay || order.paymentStatus}
											</span>
										</div>
									</div>
								</div>

								{/* Order Items Preview */}
								<div className="p-6">
									<div className="flex flex-wrap gap-4 mb-4">
										{order.lines.slice(0, 4).map((line: any) => (
											<div key={line.id} className="flex items-center gap-3">
												{line.thumbnail?.url ? (
													<img
														src={line.thumbnail.url}
														alt={line.productName}
														className="w-12 h-12 object-cover rounded-lg bg-gray-100"
													/>
												) : (
													<div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
														<Package className="w-6 h-6 text-gray-400" />
													</div>
												)}
												<div className="hidden sm:block">
													<p className="text-sm font-medium text-gray-900 line-clamp-1">
														{line.productName}
													</p>
													<p className="text-xs text-gray-500">Qty: {line.quantity}</p>
												</div>
											</div>
										))}
										{order.lines.length > 4 && (
											<div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
												<span className="text-sm font-medium text-gray-600">
													+{order.lines.length - 4}
												</span>
											</div>
										)}
									</div>

									{/* Shipping Address */}
									{order.shippingAddress && (
										<div className="text-sm text-gray-600 mb-4">
											<span className="font-medium">Ship to: </span>
											{order.shippingAddress.firstName} {order.shippingAddress.lastName},{" "}
											{order.shippingAddress.city}
										</div>
									)}

									{/* Actions */}
									<div className="flex flex-wrap gap-3">
										<Link
											href={`/${channel}/account/orders/${order.id}`}
											className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-900 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors"
										>
											View Details
											<ChevronRight className="w-4 h-4" />
										</Link>
										{order.trackingClientId && (
											<button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-colors">
												<Truck className="w-4 h-4" />
												Track Order
											</button>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
