"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	Package,
	Truck,
	CheckCircle,
	XCircle,
	MapPin,
	CreditCard,
	ChevronLeft,
	Download,
	Phone,
	Mail,
	Calendar,
	Clock,
	Star,
	RotateCcw,
	AlertCircle,
	Copy,
	Check,
} from "lucide-react";

interface OrderLine {
	id: string;
	productName: string;
	productSlug?: string;
	variantName?: string;
	quantity: number;
	unitPrice: {
		gross: {
			amount: number;
			currency: string;
		};
	};
	totalPrice: {
		gross: {
			amount: number;
			currency: string;
		};
	};
	thumbnail?: {
		url: string;
		alt?: string;
	};
}

interface ShippingAddress {
	firstName: string;
	lastName: string;
	streetAddress1: string;
	streetAddress2?: string;
	city: string;
	countryArea: string;
	postalCode?: string;
	phone?: string;
}

interface Order {
	id: string;
	number: string;
	created: string;
	status: string;
	statusDisplay: string;
	subtotal: {
		gross: {
			amount: number;
			currency: string;
		};
	};
	shippingPrice: {
		gross: {
			amount: number;
			currency: string;
		};
	};
	total: {
		gross: {
			amount: number;
			currency: string;
		};
	};
	lines: OrderLine[];
	shippingAddress?: ShippingAddress;
	billingAddress?: ShippingAddress;
	trackingClientId?: string;
	paymentStatus?: string;
	paymentStatusDisplay?: string;
}

interface TemuOrderDetailsPageProps {
	channel: string;
	order: Order | null;
}

interface TrackingEvent {
	status: string;
	label: string;
	date?: string;
	description: string;
	completed: boolean;
}

export function TemuOrderDetailsPage({ channel, order }: TemuOrderDetailsPageProps) {
	const [copiedOrderNumber, setCopiedOrderNumber] = useState(false);

	if (!order) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center max-w-md">
					<AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
					<h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
					<p className="text-gray-600 mb-6">
						We couldn't find the order you're looking for. It may have been removed or the link is incorrect.
					</p>
					<Link
						href={`/${channel}/account`}
						className="inline-block bg-gradient-to-r from-temu-500 to-temu-600 text-white font-bold py-3 px-6 rounded-lg hover:from-temu-600 hover:to-temu-700 transition-all shadow-lg"
					>
						Back to Account
					</Link>
				</div>
			</div>
		);
	}

	// Generate tracking timeline based on order status
	const getTrackingTimeline = (status: string): TrackingEvent[] => {
		const now = new Date();
		const orderDate = new Date(order.created);

		const timeline: TrackingEvent[] = [
			{
				status: "ORDERED",
				label: "Order Placed",
				date: orderDate.toLocaleDateString("en-UG", {
					year: "numeric",
					month: "short",
					day: "numeric",
					hour: "2-digit",
					minute: "2-digit",
				}),
				description: "Your order has been received and is being processed",
				completed: true,
			},
			{
				status: "PROCESSING",
				label: "Processing",
				date:
					status !== "UNFULFILLED"
						? new Date(orderDate.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString("en-UG", {
								year: "numeric",
								month: "short",
								day: "numeric",
						  })
						: undefined,
				description: "We're preparing your items for shipment",
				completed: status !== "UNFULFILLED",
			},
			{
				status: "SHIPPED",
				label: "Shipped",
				date:
					status === "PARTIALLY_FULFILLED" || status === "FULFILLED"
						? new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-UG", {
								year: "numeric",
								month: "short",
								day: "numeric",
						  })
						: undefined,
				description: "Your package is on the way",
				completed: status === "PARTIALLY_FULFILLED" || status === "FULFILLED",
			},
			{
				status: "DELIVERED",
				label: "Delivered",
				date:
					status === "FULFILLED"
						? new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-UG", {
								year: "numeric",
								month: "short",
								day: "numeric",
						  })
						: undefined,
				description: "Package has been delivered successfully",
				completed: status === "FULFILLED",
			},
		];

		// If order is cancelled, add cancelled event
		if (status === "CANCELED") {
			timeline.push({
				status: "CANCELED",
				label: "Cancelled",
				date: new Date().toLocaleDateString("en-UG", {
					year: "numeric",
					month: "short",
					day: "numeric",
				}),
				description: "This order has been cancelled",
				completed: true,
			});
		}

		return timeline;
	};

	const trackingTimeline = getTrackingTimeline(order.status);

	const copyOrderNumber = () => {
		navigator.clipboard.writeText(order.number);
		setCopiedOrderNumber(true);
		setTimeout(() => setCopiedOrderNumber(false), 2000);
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "FULFILLED":
				return "bg-green-100 text-green-700";
			case "PARTIALLY_FULFILLED":
				return "bg-blue-100 text-blue-700";
			case "UNFULFILLED":
				return "bg-yellow-100 text-yellow-700";
			case "CANCELED":
				return "bg-red-100 text-red-700";
			default:
				return "bg-gray-100 text-gray-700";
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Back Button */}
				<Link
					href={`/${channel}/account`}
					className="inline-flex items-center gap-2 text-gray-600 hover:text-temu-600 font-semibold mb-6 transition-colors"
				>
					<ChevronLeft size={20} />
					Back to Orders
				</Link>

				{/* Order Header */}
				<div className="bg-gradient-to-r from-temu-500 to-temu-600 rounded-xl p-6 mb-6 text-white">
					<div className="flex flex-wrap items-start justify-between gap-4">
						<div>
							<h1 className="text-3xl font-black mb-2">Order Details</h1>
							<div className="flex items-center gap-3">
								<span className="text-temu-100">Order #{order.number}</span>
								<button
									onClick={copyOrderNumber}
									className="flex items-center gap-1 text-temu-100 hover:text-white transition-colors"
								>
									{copiedOrderNumber ? <Check size={16} /> : <Copy size={16} />}
									<span className="text-sm">{copiedOrderNumber ? "Copied!" : "Copy"}</span>
								</button>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<span
								className={`px-4 py-2 rounded-lg font-bold ${getStatusBadge(order.status)} bg-opacity-90`}
							>
								{order.statusDisplay}
							</span>
							<button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
								<Download size={18} />
								<span className="hidden sm:inline">Invoice</span>
							</button>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Order Tracking Timeline */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
							<h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
								<Truck className="text-temu-600" />
								Order Tracking
							</h2>
							<div className="space-y-4">
								{trackingTimeline.map((event, index) => (
									<div key={event.status} className="flex gap-4">
										{/* Timeline Icon */}
										<div className="flex flex-col items-center">
											<div
												className={`w-10 h-10 rounded-full flex items-center justify-center ${
													event.completed
														? "bg-green-500 text-white"
														: "bg-gray-200 text-gray-400"
												}`}
											>
												{event.status === "ORDERED" && <Package size={20} />}
												{event.status === "PROCESSING" && <Clock size={20} />}
												{event.status === "SHIPPED" && <Truck size={20} />}
												{event.status === "DELIVERED" && <CheckCircle size={20} />}
												{event.status === "CANCELED" && <XCircle size={20} />}
											</div>
											{index < trackingTimeline.length - 1 && (
												<div
													className={`w-0.5 h-16 ${
														event.completed ? "bg-green-500" : "bg-gray-200"
													}`}
												/>
											)}
										</div>

										{/* Timeline Content */}
										<div className="flex-1 pb-8">
											<div className="flex items-center justify-between mb-1">
												<h3
													className={`font-bold ${
														event.completed ? "text-gray-900" : "text-gray-400"
													}`}
												>
													{event.label}
												</h3>
												{event.date && (
													<span className="text-sm text-gray-600">{event.date}</span>
												)}
											</div>
											<p
												className={`text-sm ${
													event.completed ? "text-gray-600" : "text-gray-400"
												}`}
											>
												{event.description}
											</p>
										</div>
									</div>
								))}
							</div>

							{order.trackingClientId && (
								<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
									<div className="flex items-start gap-3">
										<Truck className="text-blue-600 mt-0.5" size={20} />
										<div>
											<h4 className="font-semibold text-blue-900 mb-1">Tracking Number</h4>
											<p className="text-sm text-blue-800 font-mono">
												{order.trackingClientId}
											</p>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Order Items */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
							<h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
								<Package className="text-temu-600" />
								Order Items ({order.lines.length})
							</h2>
							<div className="space-y-4">
								{order.lines.map((item) => (
									<div
										key={item.id}
										className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:border-temu-500 transition-all"
									>
										{/* Product Image */}
										<div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
											{item.thumbnail?.url && (
												<Image
													src={item.thumbnail.url}
													alt={item.thumbnail.alt || item.productName}
													width={96}
													height={96}
													className="w-full h-full object-cover"
												/>
											)}
										</div>

										{/* Product Details */}
										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-gray-900 mb-1">{item.productName}</h3>
											{item.variantName && (
												<p className="text-sm text-gray-600 mb-2">
													Variant: {item.variantName}
												</p>
											)}
											<div className="flex items-center gap-4 text-sm">
												<span className="text-gray-600">
													Quantity: <span className="font-semibold">{item.quantity}</span>
												</span>
												<span className="text-gray-600">
													Unit Price:{" "}
													<span className="font-semibold">
														UGX {item.unitPrice.gross.amount.toLocaleString()}
													</span>
												</span>
											</div>
										</div>

										{/* Price */}
										<div className="text-right">
											<div className="font-bold text-gray-900 text-lg">
												UGX {item.totalPrice.gross.amount.toLocaleString()}
											</div>
											{order.status === "FULFILLED" && (
												<button className="mt-2 text-sm text-temu-600 hover:text-temu-700 font-semibold flex items-center gap-1">
													<Star size={14} />
													Review
												</button>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1 space-y-6">
						{/* Order Summary */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
							<h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
							<div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
								<div className="flex justify-between text-gray-700">
									<span>Subtotal</span>
									<span>UGX {order.subtotal.gross.amount.toLocaleString()}</span>
								</div>
								<div className="flex justify-between text-gray-700">
									<span>Shipping</span>
									<span
										className={
											order.shippingPrice.gross.amount === 0
												? "text-green-600 font-semibold"
												: ""
										}
									>
										{order.shippingPrice.gross.amount === 0
											? "FREE"
											: `UGX ${order.shippingPrice.gross.amount.toLocaleString()}`}
									</span>
								</div>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-lg font-bold text-gray-900">Total</span>
								<div className="text-right">
									<div className="text-2xl font-black text-temu-600">
										UGX {order.total.gross.amount.toLocaleString()}
									</div>
									<div className="text-xs text-gray-500">Including VAT</div>
								</div>
							</div>

							{/* Order Actions */}
							<div className="mt-6 space-y-3">
								{order.status === "FULFILLED" && (
									<button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-temu-500 to-temu-600 text-white font-bold py-3 px-4 rounded-lg hover:from-temu-600 hover:to-temu-700 transition-all shadow-md">
										<RotateCcw size={18} />
										Order Again
									</button>
								)}
								{(order.status === "UNFULFILLED" || order.status === "PARTIALLY_FULFILLED") && (
									<button className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-all">
										<XCircle size={18} />
										Cancel Order
									</button>
								)}
								<Link
									href={`/${channel}/support?order=${order.number}`}
									className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-all"
								>
									<Mail size={18} />
									Contact Support
								</Link>
							</div>
						</div>

						{/* Shipping Address */}
						{order.shippingAddress && (
							<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
								<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
									<MapPin className="text-temu-600" size={20} />
									Shipping Address
								</h3>
								<div className="text-gray-700 space-y-1">
									<p className="font-semibold">
										{order.shippingAddress.firstName} {order.shippingAddress.lastName}
									</p>
									<p>{order.shippingAddress.streetAddress1}</p>
									{order.shippingAddress.streetAddress2 && (
										<p>{order.shippingAddress.streetAddress2}</p>
									)}
									<p>
										{order.shippingAddress.city}, {order.shippingAddress.countryArea}
									</p>
									{order.shippingAddress.postalCode && <p>{order.shippingAddress.postalCode}</p>}
									{order.shippingAddress.phone && (
										<p className="flex items-center gap-2 mt-3 text-temu-600">
											<Phone size={16} />
											{order.shippingAddress.phone}
										</p>
									)}
								</div>
							</div>
						)}

						{/* Payment Method */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
							<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
								<CreditCard className="text-temu-600" size={20} />
								Payment
							</h3>
							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-gray-700">Status</span>
									<span
										className={`px-3 py-1 rounded-full text-sm font-semibold ${
											order.paymentStatus === "FULLY_CHARGED"
												? "bg-green-100 text-green-700"
												: "bg-yellow-100 text-yellow-700"
										}`}
									>
										{order.paymentStatusDisplay || "Paid"}
									</span>
								</div>
								<div className="flex justify-between items-center text-gray-700">
									<span>Method</span>
									<span className="font-semibold">Mobile Money</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
