"use client";

import Link from "next/link";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";
import { Star, ShoppingCart, Heart, Eye, X, Check, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useWishlistContext } from "@/context/WishlistContext";
import { useCart } from "@/contexts/CartContext";

interface TemuProductCardProps {
	product: {
		id: string;
		name: string;
		slug: string;
		isAvailable?: boolean | null;
		thumbnail?: {
			url?: string;
			alt?: string;
		};
		pricing?: {
			priceRange?: {
				start?: {
					gross: {
						amount: number;
						currency: string;
					};
				};
			};
		};
		category?: {
			name: string;
			slug?: string;
		};
		variants?: Array<{
			id: string;
			quantityAvailable?: number | null;
		}> | null;
	};
	channel: string;
}

export function TemuProductCard({ product, channel }: TemuProductCardProps) {
	const { isInWishlist, toggleWishlist } = useWishlistContext();
	const { addItem, isInCart } = useCart();
	const [showQuickView, setShowQuickView] = useState(false);
	const [showAddedToast, setShowAddedToast] = useState(false);
	const [quickViewQuantity, setQuickViewQuantity] = useState(1);
	const isWishlisted = isInWishlist(product.id);
	const inCart = isInCart(product.id);

	const price = product.pricing?.priceRange?.start?.gross.amount ?? 0;
	const originalPrice = price * 1.4; // Simulate original price for discount display
	const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
	const currency = product.pricing?.priceRange?.start?.gross.currency ?? "USD";

	// Random ratings for demo (in production, these would come from actual data)
	const rating = (4.0 + Math.random()).toFixed(1);
	const reviews = Math.floor(Math.random() * 10000) + 100;
	const soldCount = Math.floor(Math.random() * 50000) + 1000;

	// Stock availability calculation
	const totalStock = product.variants?.reduce((sum, v) => sum + (v.quantityAvailable ?? 0), 0) ?? 0;
	const isInStock = product.isAvailable !== false && totalStock > 0;
	const isLowStock = isInStock && totalStock > 0 && totalStock <= 10;

	const handleAddToCart = (quantity: number = 1) => {
		addItem({
			id: product.id,
			productId: product.id,
			name: product.name,
			price: price,
			image: product.thumbnail?.url,
			slug: product.slug,
			category: product.category?.name,
			quantity: quantity,
		});
		setShowAddedToast(true);
		setTimeout(() => setShowAddedToast(false), 2000);
	};

	return (
		<Link
			href={`/${channel}/products/${product.slug}`}
			className="group block bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
		>
			{/* Image Container */}
			<div className="relative aspect-square overflow-hidden bg-gray-50">
				<ProductImageWrapper
					src={product.thumbnail?.url || "/placeholder.svg"}
					alt={product.thumbnail?.alt || product.name}
					width={400}
					height={400}
					className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
				/>

				{/* Discount Badge */}
				{discountPercent > 0 && (
					<div className="absolute top-2 left-2 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded">
						-{discountPercent}%
					</div>
				)}

				{/* Wishlist and Quick View Buttons - Always visible on mobile */}
				<div className="absolute top-2 right-2 flex flex-col gap-2">
					<button
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							toggleWishlist(product.id);
						}}
						className={`bg-white p-1.5 sm:p-2 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow-lg ${
							isWishlisted ? "text-red-500" : "text-gray-700 hover:text-red-500"
						}`}
						title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
					>
						<Heart size={16} className="sm:w-[18px] sm:h-[18px]" fill={isWishlisted ? "currentColor" : "none"} />
					</button>
					<button
						onClick={(e) => {
							e.preventDefault();
							setShowQuickView(true);
						}}
						className="hidden sm:block bg-white text-gray-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-temu-500 hover:text-white"
						title="Quick View"
					>
						<Eye size={18} />
					</button>
				</div>

				{/* Stock Indicator Badge */}
				{!isInStock ? (
					<div className="absolute bottom-2 left-2 bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">
						Out of Stock
					</div>
				) : isLowStock ? (
					<div className="absolute bottom-2 left-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded">
						Only {totalStock} left!
					</div>
				) : null}

				{/* Quick Add to Cart Button - Always visible on mobile */}
				<button
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						if (isInStock) handleAddToCart(1);
					}}
					className={`absolute bottom-2 right-2 p-1.5 sm:p-2 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow-lg ${
						!isInStock
							? "bg-gray-300 text-gray-500 cursor-not-allowed"
							: inCart
								? "bg-green-500 text-white"
								: "bg-white text-gray-700 hover:bg-temu-500 hover:text-white"
					}`}
					title={!isInStock ? "Out of stock" : inCart ? "In cart" : "Add to cart"}
					disabled={!isInStock}
				>
					{inCart ? <Check size={16} className="sm:w-[18px] sm:h-[18px]" /> : <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />}
				</button>

				{/* Added to Cart Toast */}
				{showAddedToast && (
					<div className="absolute bottom-14 right-2 bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg animate-bounce">
						Added to cart!
					</div>
				)}
			</div>

			{/* Product Info */}
			<div className="p-2 sm:p-3">
				{/* Product Name */}
				<h3 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] mb-1 sm:mb-2">
					{product.name}
				</h3>

				{/* Rating */}
				<div className="flex items-center gap-1 mb-1 sm:mb-2">
					<div className="flex items-center">
						<Star size={10} className="sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
						<span className="text-[10px] sm:text-xs font-medium ml-0.5 sm:ml-1">{rating}</span>
					</div>
					<span className="text-[10px] sm:text-xs text-gray-400">({reviews.toLocaleString()})</span>
				</div>

				{/* Sold Count - Hidden on very small screens */}
				<div className="hidden xs:block text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
					{soldCount.toLocaleString()}+ sold
				</div>

				{/* Price Section */}
				<div className="flex flex-wrap items-baseline gap-1 sm:gap-2 mb-1 sm:mb-2">
					<span className="text-base sm:text-xl font-bold text-secondary-500">
						UGX {price.toLocaleString('en-UG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
					</span>
					<span className="text-[10px] sm:text-sm text-gray-400 line-through">
						UGX {originalPrice.toLocaleString('en-UG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
					</span>
				</div>

				{/* Extra Discount Info - Smaller on mobile */}
				<div className="bg-orange-50 border border-orange-200 rounded px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs text-orange-700 font-medium">
					💰 Extra 5% off
				</div>
			</div>

			{/* Quick View Modal */}
			{showQuickView && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setShowQuickView(false);
					}}
				>
					<div
						className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Modal Header */}
						<div className="flex items-center justify-between p-4 border-b">
							<h2 className="text-lg font-bold">Quick View</h2>
							<button
								onClick={(e) => {
									e.preventDefault();
									setShowQuickView(false);
								}}
								className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							>
								<X size={20} />
							</button>
						</div>

						{/* Modal Content */}
						<div className="grid md:grid-cols-2 gap-6 p-6">
							{/* Product Image */}
							<div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
								<ProductImageWrapper
									src={product.thumbnail?.url || "/placeholder.svg"}
									alt={product.thumbnail?.alt || product.name}
									width={400}
									height={400}
									className="object-cover w-full h-full"
								/>
							</div>

							{/* Product Details */}
							<div className="flex flex-col">
								<h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>

								{/* Rating */}
								<div className="flex items-center gap-2 mb-4">
									<div className="flex items-center">
										<Star size={16} className="fill-yellow-400 text-yellow-400" />
										<span className="text-sm font-medium ml-1">{rating}</span>
									</div>
									<span className="text-sm text-gray-400">({reviews.toLocaleString()} reviews)</span>
								</div>

								{/* Category */}
								{product.category && (
									<div className="text-sm text-gray-500 mb-2">
										Category: <span className="font-medium">{product.category.name}</span>
									</div>
								)}

								{/* Stock Status */}
								<div className={`text-sm font-medium mb-4 ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
									{!isInStock ? (
										"Out of Stock"
									) : isLowStock ? (
										<span className="text-yellow-600">Only {totalStock} left in stock!</span>
									) : (
										"In Stock"
									)}
								</div>

								{/* Price */}
								<div className="mb-6">
									<div className="flex items-baseline gap-2">
										<span className="text-3xl font-bold text-secondary-500">
											UGX {price.toLocaleString('en-UG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
										</span>
										<span className="text-lg text-gray-400 line-through">
											UGX {originalPrice.toLocaleString('en-UG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
										</span>
									</div>
									<div className="text-sm text-green-600 font-medium mt-1">
										You save UGX {(originalPrice - price).toLocaleString('en-UG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ({discountPercent}% off)
									</div>
								</div>

								{/* Quantity Selector */}
								<div className="flex items-center gap-4 mb-6">
									<span className="text-sm font-medium">Quantity:</span>
									<div className="flex items-center border rounded-lg">
										<button
											onClick={() => setQuickViewQuantity(Math.max(1, quickViewQuantity - 1))}
											className="p-2 hover:bg-gray-100 transition-colors"
										>
											<Minus size={16} />
										</button>
										<span className="px-4 py-2 font-medium">{quickViewQuantity}</span>
										<button
											onClick={() => setQuickViewQuantity(quickViewQuantity + 1)}
											className="p-2 hover:bg-gray-100 transition-colors"
										>
											<Plus size={16} />
										</button>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex flex-col gap-3 mt-auto">
									<button
										onClick={(e) => {
											e.preventDefault();
											if (isInStock) {
												handleAddToCart(quickViewQuantity);
												setShowQuickView(false);
												setQuickViewQuantity(1);
											}
										}}
										disabled={!isInStock}
										className={`w-full py-3 rounded-full font-bold transition-colors flex items-center justify-center gap-2 ${
											isInStock
												? "bg-temu-500 text-white hover:bg-temu-600"
												: "bg-gray-300 text-gray-500 cursor-not-allowed"
										}`}
									>
										<ShoppingCart size={20} />
										{isInStock ? "Add to Cart" : "Out of Stock"}
									</button>
									<button
										onClick={(e) => {
											e.preventDefault();
											toggleWishlist(product.id);
										}}
										className={`w-full py-3 rounded-full font-bold transition-colors flex items-center justify-center gap-2 ${
											isWishlisted
												? "bg-red-50 text-red-500 border border-red-200"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200"
										}`}
									>
										<Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
										{isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
									</button>
									<Link
										href={`/${channel}/products/${product.slug}`}
										className="w-full bg-gray-900 text-white py-3 rounded-full font-bold hover:bg-gray-800 transition-colors text-center"
										onClick={() => setShowQuickView(false)}
									>
										View Full Details
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</Link>
	);
}
