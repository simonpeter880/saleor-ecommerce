"use client";

import Link from "next/link";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";

interface ProductListItemProps {
	product: {
		id: string;
		name: string;
		slug: string;
		description?: string;
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
		};
	};
	channel: string;
}

export function ProductListItem({ product, channel }: ProductListItemProps) {
	const [isWishlisted, setIsWishlisted] = useState(false);

	const price = product.pricing?.priceRange?.start?.gross.amount ?? 0;
	const originalPrice = price * 1.4;
	const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

	// Random ratings for demo
	const rating = (4.0 + Math.random()).toFixed(1);
	const reviews = Math.floor(Math.random() * 10000) + 100;
	const soldCount = Math.floor(Math.random() * 50000) + 1000;

	return (
		<Link
			href={`/${channel}/products/${product.slug}`}
			className="group flex gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-lg"
		>
			{/* Image */}
			<div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 sm:h-40 sm:w-40">
				<ProductImageWrapper
					src={product.thumbnail?.url || "/placeholder.png"}
					alt={product.thumbnail?.alt || product.name}
					width={160}
					height={160}
					className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
				{discountPercent > 0 && (
					<div className="absolute left-1 top-1 rounded bg-secondary-500 px-1.5 py-0.5 text-xs font-bold text-white">
						-{discountPercent}%
					</div>
				)}
			</div>

			{/* Content */}
			<div className="flex flex-1 flex-col justify-between">
				<div>
					{/* Category */}
					{product.category && (
						<span className="text-xs font-medium text-primary-600">
							{product.category.name}
						</span>
					)}

					{/* Product Name */}
					<h3 className="mb-1 text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600">
						{product.name}
					</h3>

					{/* Rating */}
					<div className="mb-2 flex items-center gap-2">
						<div className="flex items-center">
							<Star size={14} className="fill-yellow-400 text-yellow-400" />
							<span className="ml-1 text-sm font-medium">{rating}</span>
						</div>
						<span className="text-sm text-gray-400">
							({reviews.toLocaleString()} reviews)
						</span>
						<span className="text-sm text-gray-400">•</span>
						<span className="text-sm text-gray-500">
							{soldCount.toLocaleString()}+ sold
						</span>
					</div>
				</div>

				{/* Bottom section */}
				<div className="flex items-end justify-between">
					{/* Price */}
					<div>
						<div className="flex items-baseline gap-2">
							<span className="text-xl font-bold text-secondary-500">
								UGX {price.toLocaleString("en-UG", { minimumFractionDigits: 0 })}
							</span>
							<span className="text-sm text-gray-400 line-through">
								UGX {originalPrice.toLocaleString("en-UG", { minimumFractionDigits: 0 })}
							</span>
						</div>
						<div className="mt-1 inline-block rounded bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
							Extra 5% off with app
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-2">
						<button
							onClick={(e) => {
								e.preventDefault();
								setIsWishlisted(!isWishlisted);
							}}
							className={`rounded-full border p-2 transition-colors ${
								isWishlisted
									? "border-red-200 bg-red-50 text-red-500"
									: "border-gray-200 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
							}`}
							title="Add to wishlist"
						>
							<Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
						</button>
						<button
							onClick={(e) => {
								e.preventDefault();
								// Add to cart
							}}
							className="flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
						>
							<ShoppingCart size={16} />
							<span className="hidden sm:inline">Add to Cart</span>
						</button>
					</div>
				</div>
			</div>
		</Link>
	);
}
