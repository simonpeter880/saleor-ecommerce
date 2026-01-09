"use client";

import { useState } from "react";
import {
	User,
	Package,
	MapPin,
	CreditCard,
	Settings,
	Heart,
	LogOut,
	ShoppingBag,
	Clock,
	Shield,
	Bell,
	Mail,
	ChevronRight,
	Edit,
} from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/app/auth-actions";

interface UserData {
	email: string;
	firstName: string;
	lastName: string;
	isEmailVerified: boolean;
}

interface Order {
	id: string;
	number: string;
	date: string;
	status: string;
	total: number;
	currency: string;
	items: number;
	products?: any[];
}

interface WishlistItem {
	id: string;
	name: string;
	slug: string;
	thumbnail?: string;
	price: number;
	currency: string;
}

interface AddressData {
	addresses: any[];
	defaultBilling: string | null;
	defaultShipping: string | null;
}

export function TemuAccountPage({
	channel,
	user,
	orders = [],
	wishlist = [],
	addresses,
}: {
	channel: string;
	user: UserData | null;
	orders?: Order[];
	wishlist?: WishlistItem[];
	addresses?: AddressData;
}) {
	const [activeTab, setActiveTab] = useState("overview");

	const orderCount = orders.length;
	const wishlistCount = wishlist.length;
	const recentOrders = orders.slice(0, 5);

	const handleLogout = async () => {
		await logoutAction();
	};

	if (!user) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
					<Link
						href={`/${channel}/login`}
						className="bg-gradient-to-r from-temu-500 to-temu-600 text-white font-bold py-3 px-6 rounded-lg hover:from-temu-600 hover:to-temu-700 transition-all shadow-lg"
					>
						Sign In
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Welcome Banner */}
				<div className="bg-gradient-to-r from-temu-500 to-temu-600 rounded-2xl p-8 mb-8 text-white">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-black mb-2">
								Welcome back, {user.firstName}!
							</h1>
							<p className="text-temu-100">
								Manage your account and track your orders
							</p>
						</div>
						<div className="hidden md:flex items-center gap-6">
							<div className="text-center">
								<div className="text-3xl font-black">{orderCount}</div>
								<div className="text-sm text-temu-100">Orders</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-black">{wishlistCount}</div>
								<div className="text-sm text-temu-100">Wishlist</div>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Sidebar Navigation */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
							<nav className="p-2">
								<button
									onClick={() => setActiveTab("overview")}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
										activeTab === "overview"
											? "bg-temu-50 text-temu-600 font-semibold"
											: "text-gray-700 hover:bg-gray-50"
									}`}
								>
									<User size={20} />
									<span>Overview</span>
								</button>
								<button
									onClick={() => setActiveTab("orders")}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
										activeTab === "orders"
											? "bg-temu-50 text-temu-600 font-semibold"
											: "text-gray-700 hover:bg-gray-50"
									}`}
								>
									<Package size={20} />
									<span>Orders</span>
									{orderCount > 0 && (
										<span className="ml-auto bg-temu-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
											{orderCount}
										</span>
									)}
								</button>
								<button
									onClick={() => setActiveTab("wishlist")}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
										activeTab === "wishlist"
											? "bg-temu-50 text-temu-600 font-semibold"
											: "text-gray-700 hover:bg-gray-50"
									}`}
								>
									<Heart size={20} />
									<span>Wishlist</span>
									{wishlistCount > 0 && (
										<span className="ml-auto bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">
											{wishlistCount}
										</span>
									)}
								</button>
								<button
									onClick={() => setActiveTab("addresses")}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
										activeTab === "addresses"
											? "bg-temu-50 text-temu-600 font-semibold"
											: "text-gray-700 hover:bg-gray-50"
									}`}
								>
									<MapPin size={20} />
									<span>Addresses</span>
								</button>
								<button
									onClick={() => setActiveTab("payment")}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
										activeTab === "payment"
											? "bg-temu-50 text-temu-600 font-semibold"
											: "text-gray-700 hover:bg-gray-50"
									}`}
								>
									<CreditCard size={20} />
									<span>Payment Methods</span>
								</button>
								<button
									onClick={() => setActiveTab("settings")}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
										activeTab === "settings"
											? "bg-temu-50 text-temu-600 font-semibold"
											: "text-gray-700 hover:bg-gray-50"
									}`}
								>
									<Settings size={20} />
									<span>Settings</span>
								</button>
								<hr className="my-2 border-gray-100" />
								<button
									onClick={handleLogout}
									className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
								>
									<LogOut size={20} />
									<span>Sign Out</span>
								</button>
							</nav>
						</div>
					</div>

					{/* Main Content Area */}
					<div className="lg:col-span-3">
						{activeTab === "overview" && (
							<div className="space-y-6">
								{/* Email Verification Alert */}
								{!user.isEmailVerified && (
									<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
										<div className="flex items-start gap-3">
											<Mail className="text-yellow-600 mt-0.5" size={20} />
											<div className="flex-1">
												<h3 className="font-semibold text-yellow-900 mb-1">
													Verify your email address
												</h3>
												<p className="text-sm text-yellow-800 mb-3">
													Please verify your email to unlock all features and secure your account.
												</p>
												<button className="bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
													Resend Verification Email
												</button>
											</div>
										</div>
									</div>
								)}

								{/* Quick Stats */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
										<div className="flex items-center gap-4">
											<div className="bg-blue-100 p-3 rounded-lg">
												<ShoppingBag className="text-blue-600" size={24} />
											</div>
											<div>
												<div className="text-2xl font-bold text-gray-900">{orderCount}</div>
												<div className="text-sm text-gray-600">Total Orders</div>
											</div>
										</div>
									</div>
									<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
										<div className="flex items-center gap-4">
											<div className="bg-red-100 p-3 rounded-lg">
												<Heart className="text-red-600" size={24} />
											</div>
											<div>
												<div className="text-2xl font-bold text-gray-900">{wishlistCount}</div>
												<div className="text-sm text-gray-600">Wishlist Items</div>
											</div>
										</div>
									</div>
									<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
										<div className="flex items-center gap-4">
											<div className="bg-green-100 p-3 rounded-lg">
												<Clock className="text-green-600" size={24} />
											</div>
											<div>
												<div className="text-2xl font-bold text-gray-900">1</div>
												<div className="text-sm text-gray-600">Pending Orders</div>
											</div>
										</div>
									</div>
								</div>

								{/* Account Info Card */}
								<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
									<div className="flex items-center justify-between mb-4">
										<h2 className="text-xl font-bold text-gray-900">Account Information</h2>
										<button className="flex items-center gap-2 text-temu-600 hover:text-temu-700 font-semibold text-sm">
											<Edit size={16} />
											Edit
										</button>
									</div>
									<div className="space-y-4">
										<div className="flex items-center gap-3 pb-4 border-b border-gray-100">
											<User className="text-gray-400" size={20} />
											<div>
												<div className="text-sm text-gray-600">Name</div>
												<div className="font-semibold text-gray-900">
													{user.firstName} {user.lastName}
												</div>
											</div>
										</div>
										<div className="flex items-center gap-3 pb-4 border-b border-gray-100">
											<Mail className="text-gray-400" size={20} />
											<div className="flex-1">
												<div className="text-sm text-gray-600">Email</div>
												<div className="font-semibold text-gray-900">{user.email}</div>
											</div>
											{user.isEmailVerified && (
												<span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
													Verified
												</span>
											)}
										</div>
										<div className="flex items-center gap-3">
											<Shield className="text-gray-400" size={20} />
											<div className="flex-1">
												<div className="text-sm text-gray-600">Security</div>
												<div className="font-semibold text-gray-900">Two-factor authentication</div>
											</div>
											<span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
												Not enabled
											</span>
										</div>
									</div>
								</div>

								{/* Recent Orders */}
								<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
									<div className="flex items-center justify-between mb-4">
										<h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
										<button
											onClick={() => setActiveTab("orders")}
											className="flex items-center gap-1 text-temu-600 hover:text-temu-700 font-semibold text-sm"
										>
											View All
											<ChevronRight size={16} />
										</button>
									</div>
									{recentOrders.length === 0 ? (
										<div className="text-center py-8">
											<Package className="mx-auto text-gray-300 mb-3" size={48} />
											<p className="text-gray-600 text-sm">No orders yet</p>
										</div>
									) : (
										<div className="space-y-4">
											{recentOrders.map((order) => (
												<Link
													key={order.id}
													href={`/${channel}/orders/${order.id}`}
													className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-temu-500 transition-all cursor-pointer"
												>
													<div className="flex items-center gap-4">
														<div className="bg-temu-100 p-3 rounded-lg">
															<Package className="text-temu-600" size={20} />
														</div>
														<div>
															<div className="font-semibold text-gray-900">
																Order #{order.number}
															</div>
															<div className="text-sm text-gray-600">
																{new Date(order.created).toLocaleDateString("en-UG", {
																	year: "numeric",
																	month: "short",
																	day: "numeric",
																})} • {order.lines.length} items
															</div>
														</div>
													</div>
													<div className="text-right">
														<div className="font-bold text-gray-900">
															UGX {order.total.gross.amount.toLocaleString()}
														</div>
														<div
															className={`text-sm font-semibold ${
																order.status === "FULFILLED"
																	? "text-green-600"
																	: order.status === "CANCELED"
																	? "text-red-600"
																	: "text-blue-600"
															}`}
														>
															{order.statusDisplay}
														</div>
													</div>
												</Link>
											))}
										</div>
									)}
								</div>
							</div>
						)}

						{activeTab === "orders" && (
							<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
									<Link
										href={`/${channel}/orders`}
										className="text-temu-600 hover:text-temu-700 font-semibold text-sm"
									>
										View All Orders →
									</Link>
								</div>
								{orders.length === 0 ? (
									<div className="text-center py-12">
										<Package className="mx-auto text-gray-300 mb-4" size={64} />
										<p className="text-gray-600 mb-4">No orders yet</p>
										<Link
											href={`/${channel}/`}
											className="inline-block bg-temu-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-temu-600 transition-colors"
										>
											Start Shopping
										</Link>
									</div>
								) : (
									<div className="space-y-4">
										{recentOrders.map((order) => (
											<div
												key={order.id}
												className="p-6 border border-gray-200 rounded-lg hover:border-temu-500 transition-all"
											>
												<div className="flex items-start justify-between mb-4">
													<div>
														<h3 className="font-bold text-lg text-gray-900">
															Order #{order.number}
														</h3>
														<p className="text-sm text-gray-600">
															{new Date(order.created).toLocaleDateString("en-UG", {
																year: "numeric",
																month: "short",
																day: "numeric",
															})}
														</p>
													</div>
													<span
														className={`px-3 py-1 rounded-full text-sm font-semibold ${
															order.status === "FULFILLED"
																? "bg-green-100 text-green-700"
																: order.status === "PARTIALLY_FULFILLED"
																? "bg-blue-100 text-blue-700"
																: order.status === "CANCELED"
																? "bg-red-100 text-red-700"
																: "bg-yellow-100 text-yellow-700"
														}`}
													>
														{order.statusDisplay}
													</span>
												</div>
												<div className="flex items-center justify-between pt-4 border-t border-gray-100">
													<div className="text-sm text-gray-600">{order.lines.length} items</div>
													<div className="flex items-center gap-4">
														<div className="font-bold text-gray-900">
															UGX {order.total.gross.amount.toLocaleString()}
														</div>
														<Link
															href={`/${channel}/orders/${order.id}`}
															className="bg-temu-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-temu-600 transition-colors"
														>
															View Details
														</Link>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						)}

						{activeTab === "wishlist" && (
							<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
								<h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
								<div className="text-center py-12">
									<Heart className="mx-auto text-gray-300 mb-4" size={64} />
									<p className="text-gray-600 mb-4">Your wishlist is empty</p>
									<Link
										href={`/${channel}/products`}
										className="bg-temu-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-temu-600 transition-colors inline-block"
									>
										Browse Products
									</Link>
								</div>
							</div>
						)}

						{activeTab === "addresses" && (
							<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
									<button className="bg-temu-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-temu-600 transition-colors">
										Add New Address
									</button>
								</div>
								<div className="text-center py-12">
									<MapPin className="mx-auto text-gray-300 mb-4" size={64} />
									<p className="text-gray-600">No saved addresses yet</p>
								</div>
							</div>
						)}

						{activeTab === "payment" && (
							<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
									<button className="bg-temu-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-temu-600 transition-colors">
										Add Payment Method
									</button>
								</div>
								<div className="text-center py-12">
									<CreditCard className="mx-auto text-gray-300 mb-4" size={64} />
									<p className="text-gray-600">No payment methods saved</p>
								</div>
							</div>
						)}

						{activeTab === "settings" && (
							<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
								<h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
								<div className="space-y-4">
									<button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-temu-500 transition-all">
										<div className="flex items-center gap-3">
											<Bell className="text-gray-600" size={20} />
											<div className="text-left">
												<div className="font-semibold text-gray-900">Notifications</div>
												<div className="text-sm text-gray-600">Manage email and push notifications</div>
											</div>
										</div>
										<ChevronRight className="text-gray-400" size={20} />
									</button>
									<button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-temu-500 transition-all">
										<div className="flex items-center gap-3">
											<Shield className="text-gray-600" size={20} />
											<div className="text-left">
												<div className="font-semibold text-gray-900">Security</div>
												<div className="text-sm text-gray-600">Password and two-factor authentication</div>
											</div>
										</div>
										<ChevronRight className="text-gray-400" size={20} />
									</button>
									<Link
										href={`/${channel}/account/delete`}
										className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:border-red-500 transition-all text-red-600"
									>
										<div className="flex items-center gap-3">
											<User className="text-red-600" size={20} />
											<div className="text-left">
												<div className="font-semibold">Delete Account</div>
												<div className="text-sm">Permanently delete your account and data</div>
											</div>
										</div>
										<ChevronRight size={20} />
									</Link>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
