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
	Mail,
	ChevronRight,
	TrendingUp,
	ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/app/auth-actions";
import Image from "next/image";

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

export function AccountPage({
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
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please sign in</h2>
					<Link
						href={`/${channel}/login`}
						className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg"
					>
						Sign In
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Welcome Banner */}
				<div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-2xl p-8 mb-8 text-white shadow-lg">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold mb-2">
								Welcome back, {user.firstName}!
							</h1>
							<p className="text-primary-100">
								Manage your account and track your orders
							</p>
						</div>
						<div className="hidden md:flex items-center gap-6">
							<div className="text-center">
								<div className="text-3xl font-bold">{orderCount}</div>
								<div className="text-sm text-primary-100">Orders</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold">{wishlistCount}</div>
								<div className="text-sm text-primary-100">Wishlist</div>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Sidebar Navigation */}
					<div className="lg:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
							<nav className="p-2">
								<button
									onClick={() => setActiveTab("overview")}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
										activeTab === "overview"
											? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold"
											: "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
									}`}
								>
									<User size={20} />
									<span>Overview</span>
								</button>
								<Link
									href={`/${channel}/account/orders`}
									className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
								>
									<Package size={20} />
									<span>Orders</span>
									{orderCount > 0 && (
										<span className="ml-auto bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
											{orderCount}
										</span>
									)}
								</Link>
								<Link
									href={`/${channel}/wishlist`}
									className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
								>
									<Heart size={20} />
									<span>Wishlist</span>
									{wishlistCount > 0 && (
										<span className="ml-auto bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold px-2 py-0.5 rounded-full">
											{wishlistCount}
										</span>
									)}
								</Link>
								<Link
									href={`/${channel}/account/addresses`}
									className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
								>
									<MapPin size={20} />
									<span>Addresses</span>
								</Link>
								<Link
									href={`/${channel}/account/profile`}
									className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
								>
									<Settings size={20} />
									<span>Settings</span>
								</Link>
								<hr className="my-2 border-gray-200 dark:border-gray-700" />
								<button
									onClick={handleLogout}
									className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
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
									<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
										<div className="flex items-start gap-3">
											<Mail className="text-yellow-600 dark:text-yellow-400 mt-0.5" size={20} />
											<div className="flex-1">
												<h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
													Verify your email address
												</h3>
												<p className="text-sm text-yellow-800 dark:text-yellow-300 mb-3">
													Please verify your email to unlock all features and secure your account.
												</p>
												<button className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
													Resend Verification Email
												</button>
											</div>
										</div>
									</div>
								)}

								{/* Quick Stats */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
										<div className="flex items-center gap-4">
											<div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
												<ShoppingBag className="text-blue-600 dark:text-blue-400" size={24} />
											</div>
											<div>
												<p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
												<p className="text-2xl font-bold text-gray-900 dark:text-white">{orderCount}</p>
											</div>
										</div>
									</div>
									<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
										<div className="flex items-center gap-4">
											<div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
												<TrendingUp className="text-green-600 dark:text-green-400" size={24} />
											</div>
											<div>
												<p className="text-sm text-gray-600 dark:text-gray-400">Wishlist Items</p>
												<p className="text-2xl font-bold text-gray-900 dark:text-white">{wishlistCount}</p>
											</div>
										</div>
									</div>
									<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
										<div className="flex items-center gap-4">
											<div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
												<ShieldCheck className="text-purple-600 dark:text-purple-400" size={24} />
											</div>
											<div>
												<p className="text-sm text-gray-600 dark:text-gray-400">Account Status</p>
												<p className="text-lg font-bold text-gray-900 dark:text-white">Active</p>
											</div>
										</div>
									</div>
								</div>

								{/* Recent Orders */}
								<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
									<div className="p-6 border-b border-gray-200 dark:border-gray-700">
										<div className="flex items-center justify-between">
											<h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h2>
											<Link
												href={`/${channel}/account/orders`}
												className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm flex items-center gap-1"
											>
												View all
												<ChevronRight size={16} />
											</Link>
										</div>
									</div>
									<div className="p-6">
										{recentOrders.length === 0 ? (
											<div className="text-center py-8">
												<div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
													<Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
												</div>
												<p className="text-gray-600 dark:text-gray-400 mb-4">No orders yet</p>
												<Link
													href={`/${channel}/products`}
													className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
												>
													Start Shopping
													<ChevronRight size={16} />
												</Link>
											</div>
										) : (
											<div className="space-y-4">
												{recentOrders.map((order) => (
													<Link
														key={order.id}
														href={`/${channel}/account/orders/${order.id}`}
														className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
													>
														<div className="flex items-center justify-between mb-2">
															<span className="font-semibold text-gray-900 dark:text-white">
																Order #{order.number}
															</span>
															<span className="text-sm text-gray-600 dark:text-gray-400">
																{new Date(order.date).toLocaleDateString()}
															</span>
														</div>
														<div className="flex items-center justify-between">
															<span className="text-sm text-gray-600 dark:text-gray-400">
																{order.items} item{order.items !== 1 ? "s" : ""}
															</span>
															<span className="font-bold text-gray-900 dark:text-white">
																{new Intl.NumberFormat("en-US", {
																	style: "currency",
																	currency: order.currency,
																}).format(order.total)}
															</span>
														</div>
													</Link>
												))}
											</div>
										)}
									</div>
								</div>

								{/* Wishlist Preview */}
								<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
									<div className="p-6 border-b border-gray-200 dark:border-gray-700">
										<div className="flex items-center justify-between">
											<h2 className="text-lg font-bold text-gray-900 dark:text-white">Wishlist</h2>
											<Link
												href={`/${channel}/wishlist`}
												className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm flex items-center gap-1"
											>
												View all
												<ChevronRight size={16} />
											</Link>
										</div>
									</div>
									<div className="p-6">
										{wishlist.length === 0 ? (
											<div className="text-center py-8">
												<div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
													<Heart className="w-8 h-8 text-gray-400 dark:text-gray-500" />
												</div>
												<p className="text-gray-600 dark:text-gray-400 mb-4">Your wishlist is empty</p>
												<Link
													href={`/${channel}/products`}
													className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
												>
													Browse Products
													<ChevronRight size={16} />
												</Link>
											</div>
										) : (
											<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
												{wishlist.slice(0, 4).map((item) => (
													<Link
														key={item.id}
														href={`/${channel}/products/${item.slug}`}
														className="group"
													>
														<div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-2 overflow-hidden relative">
															{item.thumbnail ? (
																<Image
																	src={item.thumbnail}
																	alt={item.name}
																	fill
																	className="object-cover group-hover:scale-105 transition-transform"
																/>
															) : (
																<div className="w-full h-full flex items-center justify-center">
																	<Package className="w-12 h-12 text-gray-400 dark:text-gray-500" />
																</div>
															)}
														</div>
														<h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
															{item.name}
														</h3>
														<p className="text-sm font-bold text-primary-600 dark:text-primary-400">
															{new Intl.NumberFormat("en-US", {
																style: "currency",
																currency: item.currency,
															}).format(item.price)}
														</p>
													</Link>
												))}
											</div>
										)}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
