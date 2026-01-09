"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	Package,
	Search,
	Filter,
	ChevronRight,
	Truck,
	Clock,
	CheckCircle,
	XCircle,
	RotateCcw,
	ShoppingBag,
	Star,
} from "lucide-react";

interface OrderLine {
	id: string;
	productName: string;
	variantName?: string;
	quantity: number;
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

interface Order {
	id: string;
	number: string;
	created: string;
	status: string;
	statusDisplay: string;
	total: {
		gross: {
			amount: number;
			currency: string;
		};
	};
	lines: OrderLine[];
	trackingNumber?: string;
	shippingAddress?: {
		firstName: string;
		lastName: string;
		streetAddress1: string;
		city: string;
		countryArea: string;
	};
}

interface TemuOrdersPageProps {
	channel: string;
	orders: Order[];
}

const ORDER_STATUS_FILTERS = [
	{ key: "all", label: "All Orders", icon: ShoppingBag },
	{ key: "UNFULFILLED", label: "Processing", icon: Clock },
	{ key: "PARTIALLY_FULFILLED", label: "Shipped", icon: Truck },
	{ key: "FULFILLED", label: "Delivered", icon: CheckCircle },
	{ key: "CANCELED", label: "Cancelled", icon: XCircle },
];

export function TemuOrdersPage({ channel, orders }: TemuOrdersPageProps) {
	const [activeFilter, setActiveFilter] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");

	// Filter orders based on active filter and search query
	const filteredOrders = orders.filter((order) => {
		const matchesFilter = activeFilter === "all" || order.status === activeFilter;
		const matchesSearch =
			searchQuery === "" ||
			order.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
			order.lines.some((line) =>
				line.productName.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		return matchesFilter && matchesSearch;
	});

	// Get status badge styling
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

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "FULFILLED":
				return <CheckCircle size={16} />;
			case "PARTIALLY_FULFILLED":
				return <Truck size={16} />;
			case "UNFULFILLED":
				return <Clock size={16} />;
			case "CANCELED":
				return <XCircle size={16} />;
			default:
				return <Package size={16} />;
		}
	};

	// Count orders by status
	const orderCounts = {
		all: orders.length,
		UNFULFILLED: orders.filter((o) => o.status === "UNFULFILLED").length,
		PARTIALLY_FULFILLED: orders.filter((o) => o.status === "PARTIALLY_FULFILLED").length,
		FULFILLED: orders.filter((o) => o.status === "FULFILLED").length,
		CANCELED: orders.filter((o) => o.status === "CANCELED").length,
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-black text-gray-900 mb-2">My Orders</h1>
					<p className="text-gray-600">Track, manage, and review your orders</p>
				</div>

				{/* Search Bar */}
				<div className="mb-6">
					<div className="relative">
						<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search orders by number or product name..."
							className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-temu-500 focus:ring-2 focus:ring-temu-200 focus:outline-none transition-all"
						/>
					</div>
				</div>

				{/* Status Filter Tabs */}
				<div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-2">
					<div className="flex overflow-x-auto gap-2">
						{ORDER_STATUS_FILTERS.map((filter) => {
							const Icon = filter.icon;
							const count = orderCounts[filter.key as keyof typeof orderCounts];
							const isActive = activeFilter === filter.key;

							return (
								<button
									key={filter.key}
									onClick={() => setActiveFilter(filter.key)}
									className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
										isActive
											? "bg-gradient-to-r from-temu-500 to-temu-600 text-white shadow-md"
											: "bg-white text-gray-700 hover:bg-gray-50"
									}`}
								>
									<Icon size={18} />
									<span>{filter.label}</span>
									{count > 0 && (
										<span
											className={`text-xs font-bold px-2 py-0.5 rounded-full ${
												isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
											}`}
										>
											{count}
										</span>
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* Orders List */}
				{filteredOrders.length === 0 ? (
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
						<Package className="mx-auto text-gray-300 mb-4" size={64} />
						<h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
						<p className="text-gray-600 mb-6">
							{searchQuery
								? "Try adjusting your search or filters"
								: "You haven't placed any orders yet"}
						</p>
						<Link
							href={`/${channel}/`}
							className="inline-block bg-gradient-to-r from-temu-500 to-temu-600 text-white font-bold py-3 px-6 rounded-lg hover:from-temu-600 hover:to-temu-700 transition-all shadow-lg"
						>
							Start Shopping
						</Link>
					</div>
				) : (
					<div className="space-y-4">
						{filteredOrders.map((order) => (
							<div
								key={order.id}
								className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
							>
								{/* Order Header */}
								<div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
									<div className="flex flex-wrap items-center justify-between gap-4">
										<div className="flex items-center gap-4">
											<div>
												<div className="text-sm text-gray-600">Order Number</div>
												<div className="font-bold text-gray-900">#{order.number}</div>
											</div>
											<div className="h-8 w-px bg-gray-200" />
											<div>
												<div className="text-sm text-gray-600">Order Date</div>
												<div className="font-semibold text-gray-900">
													{new Date(order.created).toLocaleDateString("en-UG", {
														year: "numeric",
														month: "short",
														day: "numeric",
													})}
												</div>
											</div>
											<div className="h-8 w-px bg-gray-200" />
											<div>
												<div className="text-sm text-gray-600">Total Amount</div>
												<div className="font-bold text-temu-600">
													UGX {order.total.gross.amount.toLocaleString()}
												</div>
											</div>
										</div>
										<div className="flex items-center gap-3">
											<span
												className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusBadge(order.status)}`}
											>
												{getStatusIcon(order.status)}
												{order.statusDisplay}
											</span>
										</div>
									</div>
								</div>

								{/* Order Items */}
								<div className="p-6">
									<div className="space-y-4">
										{order.lines.slice(0, 3).map((item) => (
											<div key={item.id} className="flex items-center gap-4">
												{/* Product Image */}
												<div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
													{item.thumbnail?.url && (
														<Image
															src={item.thumbnail.url}
															alt={item.thumbnail.alt || item.productName}
															width={80}
															height={80}
															className="w-full h-full object-cover"
														/>
													)}
												</div>

												{/* Product Details */}
												<div className="flex-1 min-w-0">
													<h4 className="font-semibold text-gray-900 line-clamp-1">
														{item.productName}
													</h4>
													{item.variantName && (
														<p className="text-sm text-gray-600">Variant: {item.variantName}</p>
													)}
													<p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
												</div>

												{/* Price */}
												<div className="text-right">
													<div className="font-bold text-gray-900">
														UGX {item.totalPrice.gross.amount.toLocaleString()}
													</div>
												</div>
											</div>
										))}

										{order.lines.length > 3 && (
											<div className="text-sm text-gray-600 text-center pt-2">
												+ {order.lines.length - 3} more item(s)
											</div>
										)}
									</div>

									{/* Order Actions */}
									<div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
										{order.status === "FULFILLED" && (
											<button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold text-sm transition-colors">
												<Star size={16} />
												Write Review
											</button>
										)}
										{order.status === "FULFILLED" && (
											<button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold text-sm transition-colors">
												<RotateCcw size={16} />
												Buy Again
											</button>
										)}
										{(order.status === "UNFULFILLED" || order.status === "PARTIALLY_FULFILLED") && (
											<button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-semibold text-sm transition-colors">
												<Truck size={16} />
												Track Order
											</button>
										)}
										<Link
											href={`/${channel}/orders/${order.id}`}
											className="ml-auto flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-temu-500 to-temu-600 text-white rounded-lg hover:from-temu-600 hover:to-temu-700 font-semibold text-sm transition-all shadow-md"
										>
											View Details
											<ChevronRight size={16} />
										</Link>
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
