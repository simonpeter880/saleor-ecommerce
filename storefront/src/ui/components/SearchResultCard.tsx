"use client";

import Link from "next/link";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";
import { Star, ShoppingCart, Heart, Check } from "lucide-react";
import { useState } from "react";
import { useWishlistContext } from "@/context/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { HighlightedTextMulti } from "./HighlightedText";

interface SearchResultCardProps {
	product: {
		id: string;
		name: string;
		slug: string;
		isAvailable?: boolean | null;
		thumbnail?: {
			url?: string;
			alt?: string | null;
		} | null;
		pricing?: {
			priceRange?: {
				start?: {
					gross: {
						amount: number;
						currency: string;
					};
				} | null;
			} | null;
		} | null;
		category?: {
			name: string;
			slug?: string;
		} | null;
		description?: string | null;
	};
	channel: string;
	searchQuery: string;
	viewMode?: "grid" | "list";
}

export function SearchResultCard({
	product,
	channel,
	searchQuery,
	viewMode = "grid",
}: SearchResultCardProps) {
	const { isInWishlist, toggleWishlist } = useWishlistContext();
	const { addItem, isInCart } = useCart();
	const [showAddedToast, setShowAddedToast] = useState(false);
	const isWishlisted = isInWishlist(product.id);
	const inCart = isInCart(product.id);

	const price = product.pricing?.priceRange?.start?.gross.amount ?? 0;
	const originalPrice = price * 1.4;
	const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

	// Split search query into words for multi-word highlighting
	const highlightWords = searchQuery.split(/\s+/).filter((w) => w.length > 1);

	// Random ratings for demo
	const rating = (4.0 + Math.random()).toFixed(1);
	const reviews = Math.floor(Math.random() * 10000) + 100;

	const handleAddToCart = () => {
		addItem({
			id: product.id,
			productId: product.id,
			name: product.name,
			price: price,
			image: product.thumbnail?.url,
			slug: product.slug,
			category: product.category?.name,
			quantity: 1,
		});
		setShowAddedToast(true);
		setTimeout(() => setShowAddedToast(false), 2000);
	};

	if (viewMode === "list") {
		return (
			<div className="group flex gap-4 bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
				{/* Image */}
				<Link
					href={`/${channel}/products/${product.slug}`}
					className="shrink-0 w-32 h-32 sm:w-40 sm:h-40 overflow-hidden rounded-lg bg-gray-50"
				>
					<ProductImageWrapper
						src={product.thumbnail?.url || "/placeholder.svg"}
						alt={product.thumbnail?.alt || product.name}
						width={160}
						height={160}
						className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
					/>
				</Link>

				{/* Content */}
				<div className="flex-1 min-w-0 flex flex-col">
					<Link href={`/${channel}/products/${product.slug}`}>
						<h3 className="text-base font-medium text-gray-900 hover:text-temu-500 transition-colors line-clamp-2">
							<HighlightedTextMulti text={product.name} highlights={highlightWords} />
						</h3>
					</Link>

					{/* Category with highlight */}
					{product.category && (
						<p className="text-sm text-gray-500 mt-1">
							<HighlightedTextMulti
								text={product.category.name}
								highlights={highlightWords}
							/>
						</p>
					)}

					{/* Rating */}
					<div className="flex items-center gap-2 mt-2">
						<div className="flex items-center">
							<Star size={14} className="fill-yellow-400 text-yellow-400" />
							<span className="text-sm font-medium ml-1">{rating}</span>
						</div>
						<span className="text-sm text-gray-400">({reviews.toLocaleString()} reviews)</span>
					</div>

					{/* Price */}
					<div className="flex items-baseline gap-2 mt-auto pt-2">
						<span className="text-xl font-bold text-secondary-500">
							UGX {price.toLocaleString("en-UG")}
						</span>
						<span className="text-sm text-gray-400 line-through">
							UGX {originalPrice.toLocaleString("en-UG")}
						</span>
						<span className="text-sm text-green-600 font-medium">
							-{discountPercent}%
						</span>
					</div>
				</div>

				{/* Actions */}
				<div className="flex flex-col gap-2 shrink-0">
					<button
						onClick={() => toggleWishlist(product.id)}
						className={`p-2 rounded-full transition-colors ${
							isWishlisted
								? "bg-red-50 text-red-500"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}
						title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
					>
						<Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
					</button>
					<button
						onClick={handleAddToCart}
						disabled={product.isAvailable === false}
						className={`p-2 rounded-full transition-colors ${
							product.isAvailable === false
								? "bg-gray-100 text-gray-400 cursor-not-allowed"
								: inCart
									? "bg-green-500 text-white"
									: "bg-temu-500 text-white hover:bg-temu-600"
						}`}
						title={inCart ? "In cart" : "Add to cart"}
					>
						{inCart ? <Check size={20} /> : <ShoppingCart size={20} />}
					</button>
				</div>

				{/* Added Toast */}
				{showAddedToast && (
					<div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg animate-bounce">
						Added to cart!
					</div>
				)}
			</div>
		);
	}

	// Grid view (default)
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

				{/* Action Buttons */}
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
					>
						<Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
					</button>
				</div>

				{/* Quick Add to Cart */}
				<button
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						if (product.isAvailable !== false) handleAddToCart();
					}}
					disabled={product.isAvailable === false}
					className={`absolute bottom-2 right-2 p-1.5 sm:p-2 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow-lg ${
						product.isAvailable === false
							? "bg-gray-300 text-gray-500 cursor-not-allowed"
							: inCart
								? "bg-green-500 text-white"
								: "bg-white text-gray-700 hover:bg-temu-500 hover:text-white"
					}`}
				>
					{inCart ? <Check size={16} /> : <ShoppingCart size={16} />}
				</button>

				{showAddedToast && (
					<div className="absolute bottom-14 right-2 bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg animate-bounce">
						Added!
					</div>
				)}
			</div>

			{/* Product Info */}
			<div className="p-2 sm:p-3">
				<h3 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] mb-1 sm:mb-2">
					<HighlightedTextMulti text={product.name} highlights={highlightWords} />
				</h3>

				{/* Category with highlight */}
				{product.category && (
					<p className="text-[10px] sm:text-xs text-gray-500 mb-1">
						<HighlightedTextMulti
							text={product.category.name}
							highlights={highlightWords}
						/>
					</p>
				)}

				{/* Rating */}
				<div className="flex items-center gap-1 mb-1 sm:mb-2">
					<div className="flex items-center">
						<Star size={10} className="sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
						<span className="text-[10px] sm:text-xs font-medium ml-0.5 sm:ml-1">
							{rating}
						</span>
					</div>
					<span className="text-[10px] sm:text-xs text-gray-400">
						({reviews.toLocaleString()})
					</span>
				</div>

				{/* Price */}
				<div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
					<span className="text-base sm:text-xl font-bold text-secondary-500">
						UGX {price.toLocaleString("en-UG")}
					</span>
					<span className="text-[10px] sm:text-sm text-gray-400 line-through">
						UGX {originalPrice.toLocaleString("en-UG")}
					</span>
				</div>
			</div>
		</Link>
	);
}
