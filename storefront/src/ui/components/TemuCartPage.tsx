"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	ShoppingBag,
	Trash2,
	Plus,
	Minus,
	Tag,
	TrendingUp,
	Shield,
	Truck,
	ArrowRight,
	Heart,
	X,
} from "lucide-react";
import { formatMoney } from "@/lib/utils";

interface CartLine {
	id: string;
	quantity: number;
	totalPrice: {
		gross: {
			amount: number;
			currency: string;
		};
	};
	variant: {
		id: string;
		name: string;
		product: {
			id: string;
			name: string;
			slug: string;
			thumbnail?: {
				url: string;
				alt?: string;
			};
			category?: {
				name: string;
			};
		};
		pricing?: {
			price?: {
				gross: {
					amount: number;
					currency: string;
				};
			};
		};
	};
}

interface TemuCartPageProps {
	channel: string;
	checkoutId: string;
	lines: CartLine[];
	totalPrice: {
		gross: {
			amount: number;
			currency: string;
		};
	};
	onUpdateQuantity: (lineId: string, quantity: number) => void;
	onRemoveItem: (lineId: string) => void;
}

export function TemuCartPage({
	channel,
	checkoutId,
	lines,
	totalPrice,
	onUpdateQuantity,
	onRemoveItem,
}: TemuCartPageProps) {
	const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
	const [couponCode, setCouponCode] = useState("");

	const handleQuantityChange = async (lineId: string, newQuantity: number) => {
		if (newQuantity < 1) return;
		setUpdatingItems((prev) => new Set(prev).add(lineId));
		await onUpdateQuantity(lineId, newQuantity);
		setUpdatingItems((prev) => {
			const newSet = new Set(prev);
			newSet.delete(lineId);
			return newSet;
		});
	};

	const handleRemove = async (lineId: string) => {
		setUpdatingItems((prev) => new Set(prev).add(lineId));
		await onRemoveItem(lineId);
	};

	// Calculate savings (simulated)
	const subtotal = totalPrice.gross.amount;
	const shipping = subtotal > 50000 ? 0 : 5000; // Free shipping over UGX 50,000
	const savings = Math.floor(subtotal * 0.15); // Simulate 15% savings
	const total = subtotal + shipping;

	return (
		<div className="min-h-screen bg-gray-50 py-8 pb-24 md:pb-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-black text-gray-900 mb-2">Shopping Cart</h1>
					<p className="text-gray-600">
						{lines.length} {lines.length === 1 ? "item" : "items"} in your cart
					</p>
				</div>

				{/* Promotional Banner */}
				<div className="mb-6 bg-gradient-to-r from-temu-500 to-temu-600 rounded-xl p-4 text-white">
					<div className="flex items-center gap-3">
						<Tag size={24} />
						<div className="flex-1">
							<p className="font-bold">You're saving UGX {savings.toLocaleString()} on this order!</p>
							<p className="text-sm text-temu-100">
								{shipping === 0
									? "Plus FREE shipping!"
									: `Add UGX ${(50000 - subtotal).toLocaleString()} more for FREE shipping`}
							</p>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Cart Items */}
					<div className="lg:col-span-2 space-y-4">
						{lines.map((item) => {
							const isUpdating = updatingItems.has(item.id);
							const unitPrice = item.totalPrice.gross.amount / item.quantity;

							return (
								<div
									key={item.id}
									className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-opacity ${
										isUpdating ? "opacity-50" : ""
									}`}
								>
									<div className="flex gap-4">
										{/* Product Image */}
										<div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
											<div className="w-full h-full rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
												{item.variant.product.thumbnail?.url && (
													<Image
														src={item.variant.product.thumbnail.url}
														alt={item.variant.product.thumbnail.alt || item.variant.product.name}
														width={128}
														height={128}
														className="w-full h-full object-cover"
													/>
												)}
											</div>
											{/* Discount Badge */}
											<div className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
												-15%
											</div>
										</div>

										{/* Product Details */}
										<div className="flex-1 min-w-0">
											<div className="flex justify-between gap-4">
												<div className="flex-1">
													<Link
														href={`/${channel}/products/${item.variant.product.slug}`}
														className="font-semibold text-gray-900 hover:text-temu-600 line-clamp-2"
													>
														{item.variant.product.name}
													</Link>
													{item.variant.product.category?.name && (
														<p className="text-sm text-gray-500 mt-1">
															{item.variant.product.category.name}
														</p>
													)}
													{item.variant.name && item.variant.name !== item.variant.id && (
														<p className="text-sm text-gray-600 mt-1">
															<span className="font-medium">Variant:</span> {item.variant.name}
														</p>
													)}
													{/* Free Shipping Badge */}
													<div className="mt-2 inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded">
														<Truck size={12} />
														Free Shipping
													</div>
												</div>

												{/* Price */}
												<div className="text-right">
													<div className="text-lg font-bold text-secondary-500">
														UGX {item.totalPrice.gross.amount.toLocaleString()}
													</div>
													<div className="text-sm text-gray-400 line-through">
														UGX {Math.floor(item.totalPrice.gross.amount * 1.15).toLocaleString()}
													</div>
													<div className="text-xs text-gray-600 mt-1">
														UGX {unitPrice.toLocaleString()} each
													</div>
												</div>
											</div>

											{/* Quantity Controls & Actions */}
											<div className="flex items-center justify-between mt-4">
												{/* Quantity Controls */}
												<div className="flex items-center gap-2">
													<button
														onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
														disabled={isUpdating || item.quantity <= 1}
														className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-temu-500 hover:bg-temu-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
													>
														<Minus size={16} />
													</button>
													<div className="w-12 h-8 flex items-center justify-center font-bold text-gray-900">
														{item.quantity}
													</div>
													<button
														onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
														disabled={isUpdating}
														className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-temu-500 hover:bg-temu-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
													>
														<Plus size={16} />
													</button>
												</div>

												{/* Action Buttons */}
												<div className="flex items-center gap-3">
													<button className="flex items-center gap-1 text-gray-600 hover:text-temu-600 text-sm font-medium transition-colors">
														<Heart size={16} />
														<span className="hidden sm:inline">Save</span>
													</button>
													<button
														onClick={() => handleRemove(item.id)}
														disabled={isUpdating}
														className="flex items-center gap-1 text-gray-600 hover:text-red-600 text-sm font-medium transition-colors disabled:opacity-50"
													>
														<Trash2 size={16} />
														<span className="hidden sm:inline">Remove</span>
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						})}

						{/* Continue Shopping */}
						<Link
							href={`/${channel}/`}
							className="flex items-center justify-center gap-2 text-temu-600 hover:text-temu-700 font-semibold py-4 transition-colors"
						>
							← Continue Shopping
						</Link>
					</div>

					{/* Order Summary Sidebar */}
					<div className="lg:col-span-1">
						<div className="sticky top-24 space-y-4">
							{/* Coupon Code */}
							<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
								<h3 className="font-bold text-gray-900 mb-3">Promo Code</h3>
								<div className="flex gap-2">
									<input
										type="text"
										value={couponCode}
										onChange={(e) => setCouponCode(e.target.value)}
										placeholder="Enter code"
										className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-temu-500 focus:ring-2 focus:ring-temu-200 focus:outline-none text-sm"
									/>
									<button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold text-sm transition-colors">
										Apply
									</button>
								</div>
							</div>

							{/* Order Summary */}
							<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
								<h3 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h3>

								<div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
									<div className="flex justify-between text-gray-700">
										<span>Subtotal ({lines.length} items)</span>
										<span>UGX {subtotal.toLocaleString()}</span>
									</div>
									<div className="flex justify-between text-gray-700">
										<span>Shipping</span>
										<span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
											{shipping === 0 ? "FREE" : `UGX ${shipping.toLocaleString()}`}
										</span>
									</div>
									<div className="flex justify-between text-green-600 font-semibold">
										<span>Savings</span>
										<span>-UGX {savings.toLocaleString()}</span>
									</div>
								</div>

								<div className="flex justify-between items-center mb-6">
									<span className="text-lg font-bold text-gray-900">Total</span>
									<div className="text-right">
										<div className="text-2xl font-black text-secondary-500">
											UGX {total.toLocaleString()}
										</div>
										<div className="text-xs text-gray-500">Including VAT</div>
									</div>
								</div>

								<Link
									href={`/${channel}/checkout/${checkoutId}`}
									className="block w-full bg-gradient-to-r from-temu-500 to-temu-600 text-white font-bold py-4 px-6 rounded-lg hover:from-temu-600 hover:to-temu-700 transition-all shadow-lg hover:shadow-xl text-center mb-3"
								>
									<span className="flex items-center justify-center gap-2">
										Proceed to Checkout
										<ArrowRight size={20} />
									</span>
								</Link>

								{/* Trust Badges */}
								<div className="space-y-2 text-sm text-gray-600">
									<div className="flex items-center gap-2">
										<Shield size={16} className="text-green-600" />
										<span>Secure checkout guaranteed</span>
									</div>
									<div className="flex items-center gap-2">
										<Truck size={16} className="text-blue-600" />
										<span>Free shipping on orders over UGX 50,000</span>
									</div>
									<div className="flex items-center gap-2">
										<TrendingUp size={16} className="text-temu-600" />
										<span>Save up to 15% on every order</span>
									</div>
								</div>
							</div>

							{/* Payment Methods */}
							<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
								<h4 className="text-sm font-semibold text-gray-700 mb-3">We Accept</h4>
								<div className="flex flex-wrap gap-2">
									<div className="px-3 py-2 bg-gray-100 rounded text-xs font-medium text-gray-700">
										VISA
									</div>
									<div className="px-3 py-2 bg-gray-100 rounded text-xs font-medium text-gray-700">
										Mastercard
									</div>
									<div className="px-3 py-2 bg-gray-100 rounded text-xs font-medium text-gray-700">
										Mobile Money
									</div>
									<div className="px-3 py-2 bg-gray-100 rounded text-xs font-medium text-gray-700">
										Bank Transfer
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* You May Also Like */}
				<div className="mt-12">
					<h2 className="text-2xl font-black text-gray-900 mb-6">You May Also Like</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{/* This would be populated with recommended products */}
						<div className="text-center text-gray-500 col-span-full py-8">
							Recommended products will appear here
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function TemuEmptyCart({ channel }: { channel: string }) {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
			<div className="max-w-md w-full text-center">
				<div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
					<div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
						<ShoppingBag className="text-gray-400" size={48} />
					</div>
					<h2 className="text-2xl font-black text-gray-900 mb-3">Your Cart is Empty</h2>
					<p className="text-gray-600 mb-8">
						Looks like you haven't added any items to your cart yet. Start shopping and discover amazing deals!
					</p>
					<Link
						href={`/${channel}/`}
						className="inline-block bg-gradient-to-r from-temu-500 to-temu-600 text-white font-bold py-4 px-8 rounded-lg hover:from-temu-600 hover:to-temu-700 transition-all shadow-lg hover:shadow-xl"
					>
						Start Shopping
					</Link>
				</div>

				{/* Benefits */}
				<div className="mt-8 grid grid-cols-3 gap-4 text-center">
					<div>
						<div className="text-temu-600 font-bold text-2xl">15%</div>
						<div className="text-xs text-gray-600 mt-1">Average Savings</div>
					</div>
					<div>
						<div className="text-temu-600 font-bold text-2xl">FREE</div>
						<div className="text-xs text-gray-600 mt-1">Shipping</div>
					</div>
					<div>
						<div className="text-temu-600 font-bold text-2xl">24/7</div>
						<div className="text-xs text-gray-600 mt-1">Support</div>
					</div>
				</div>
			</div>
		</div>
	);
}
