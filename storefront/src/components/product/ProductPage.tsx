"use client";

import { useState, Suspense, lazy } from "react";
import Image from "next/image";
import {
	Star,
	Share2,
	Truck,
	Shield,
	RotateCcw,
	ChevronLeft,
	ChevronRight,
	Minus,
	Plus,
	ShoppingCart,
	Package,
} from "lucide-react";
import { WishlistButton } from "@/ui/components/WishlistButton";
import { ProductReviewsInline } from "@/ui/components/ProductReviewsInline";
import { Toast, useToast } from "@/ui/components/Toast";

// Lazy load heavy components for better performance
const ProductQASection = lazy(() => import("@/ui/components/ProductQASection"));

interface ProductImage {
	url: string;
	alt?: string;
}

interface ProductVariant {
	id: string;
	name: string;
	quantityAvailable?: number;
	pricing?: {
		price?: {
			gross: {
				amount: number;
				currency: string;
			};
		};
	};
}

interface Product {
	id: string;
	name: string;
	slug: string;
	description?: string;
	thumbnail?: ProductImage;
	media?: ProductImage[];
	variants?: ProductVariant[];
	category?: {
		name: string;
		slug: string;
	};
	pricing?: {
		priceRange?: {
			start?: {
				gross: {
					amount: number;
					currency: string;
				};
			};
			stop?: {
				gross: {
					amount: number;
					currency: string;
				};
			};
		};
	};
	rating?: number;
}

interface ProductPageProps {
	product: Product;
	channel: string;
	selectedVariant?: ProductVariant;
	onAddToCart: () => void;
}

export function ProductPage({
	product,
	channel,
	selectedVariant,
	onAddToCart,
}: ProductPageProps) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [selectedVariantId, setSelectedVariantId] = useState(
		selectedVariant?.id || product.variants?.[0]?.id || ""
	);
	const [activeTab, setActiveTab] = useState("description");
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const { toasts, success, error, removeToast } = useToast();

	// Handle Add to Cart with feedback
	const handleAddToCart = async () => {
		setIsAddingToCart(true);
		try {
			await onAddToCart();
			success("Added to cart!");
		} catch (err) {
			error("Failed to add to cart");
		} finally {
			setIsAddingToCart(false);
		}
	};

	// Handle Share functionality
	const handleShare = async () => {
		const shareData = {
			title: product.name,
			text: `Check out ${product.name}!`,
			url: window.location.href,
		};

		try {
			if (navigator.share) {
				await navigator.share(shareData);
			} else {
				// Fallback: copy to clipboard
				await navigator.clipboard.writeText(window.location.href);
				success("Link copied to clipboard!");
			}
		} catch (err) {
			console.error("Error sharing:", err);
		}
	};

	// Get all product images
	const images = [
		product.thumbnail,
		...(product.media || []),
	].filter((img): img is ProductImage => !!img);

	// Get price
	const price = selectedVariant?.pricing?.price?.gross.amount || product.pricing?.priceRange?.start?.gross.amount || 0;
	const currency = selectedVariant?.pricing?.price?.gross.currency || product.pricing?.priceRange?.start?.gross.currency || "USD";

	// Check availability
	const isAvailable = selectedVariant ? (selectedVariant.quantityAvailable ?? 0) > 0 : product.variants?.some((v) => (v.quantityAvailable ?? 0) > 0) || false;
	const stockCount = selectedVariant?.quantityAvailable || 0;

	// Rating
	const rating = product.rating || 0;

	const handlePrevImage = () => {
		setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const handleNextImage = () => {
		setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	const handleQuantityChange = (delta: number) => {
		const newQuantity = Math.max(1, Math.min(stockCount || 999, quantity + delta));
		setQuantity(newQuantity);
	};

	const formatPrice = (amount: number, curr: string) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: curr,
		}).format(amount);
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
					{/* Left Column - Image Gallery */}
					<div className="space-y-4">
						{/* Main Image */}
						<div className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 aspect-square">
							{images.length > 0 ? (
								<>
									<Image
										src={images[currentImageIndex].url}
										alt={images[currentImageIndex].alt || product.name}
										fill
										className="object-contain p-4"
										priority={currentImageIndex === 0}
									/>
									{images.length > 1 && (
										<>
											<button
												onClick={handlePrevImage}
												className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
												aria-label="Previous image"
											>
												<ChevronLeft size={20} />
											</button>
											<button
												onClick={handleNextImage}
												className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
												aria-label="Next image"
											>
												<ChevronRight size={20} />
											</button>
										</>
									)}
								</>
							) : (
								<div className="w-full h-full flex items-center justify-center text-gray-400">
									<Package size={64} />
								</div>
							)}
						</div>

						{/* Thumbnail Gallery */}
						{images.length > 1 && (
							<div className="grid grid-cols-5 gap-2">
								{images.slice(0, 5).map((img, idx) => (
									<button
										key={idx}
										onClick={() => setCurrentImageIndex(idx)}
										className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
											currentImageIndex === idx
												? "border-primary-500 ring-2 ring-primary-200"
												: "border-gray-200 dark:border-gray-700 hover:border-primary-300"
										}`}
									>
										<Image
											src={img.url}
											alt={img.alt || `${product.name} ${idx + 1}`}
											fill
											className="object-cover"
										/>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Right Column - Product Info */}
					<div className="space-y-6">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
								{product.name}
							</h1>

							{/* Rating */}
							{rating > 0 && (
								<div className="flex items-center gap-2 mb-4">
									<div className="flex items-center">
										{[1, 2, 3, 4, 5].map((star) => (
											<Star
												key={star}
												size={18}
												className={`${
													star <= Math.round(rating)
														? "fill-yellow-400 text-yellow-400"
														: "text-gray-300 dark:text-gray-600"
												}`}
											/>
										))}
									</div>
									<span className="text-sm text-gray-600 dark:text-gray-400">
										{rating.toFixed(1)} rating
									</span>
								</div>
							)}

							{/* Price */}
							<div className="mb-6">
								<div className="text-4xl font-bold text-gray-900 dark:text-white">
									{formatPrice(price, currency)}
								</div>
							</div>

							{/* Stock Status */}
							<div className="mb-6">
								{isAvailable ? (
									<div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										In Stock
									</div>
								) : (
									<div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
										<div className="w-2 h-2 bg-red-500 rounded-full"></div>
										Out of Stock
									</div>
								)}
							</div>
						</div>

						{/* Variant Selection */}
						{product.variants && product.variants.length > 1 && (
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Select Option
								</label>
								<div className="flex flex-wrap gap-2">
									{product.variants.map((variant) => (
										<button
											key={variant.id}
											onClick={() => setSelectedVariantId(variant.id)}
											disabled={!variant.quantityAvailable}
											className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
												selectedVariantId === variant.id
													? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
													: variant.quantityAvailable
													? "border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700"
													: "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
											}`}
										>
											{variant.name}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Quantity Selector */}
						{isAvailable && (
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Quantity
								</label>
								<div className="flex items-center gap-3">
									<button
										onClick={() => handleQuantityChange(-1)}
										disabled={quantity <= 1}
										className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										<Minus size={18} />
									</button>
									<span className="w-12 text-center font-semibold text-lg">
										{quantity}
									</span>
									<button
										onClick={() => handleQuantityChange(1)}
										disabled={quantity >= stockCount}
										className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										<Plus size={18} />
									</button>
								</div>
							</div>
						)}

						{/* Action Buttons */}
						<div className="flex gap-3">
							<button
								onClick={handleAddToCart}
								disabled={!isAvailable || isAddingToCart}
								className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
							>
								<ShoppingCart size={20} />
								{isAddingToCart ? "Adding..." : "Add to Cart"}
							</button>
							<WishlistButton productId={product.id} />
							<button
								onClick={handleShare}
								className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
								aria-label="Share product"
							>
								<Share2 size={20} />
							</button>
						</div>

						{/* Trust Badges */}
						<div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="text-center">
								<div className="w-12 h-12 mx-auto mb-2 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
									<Truck className="text-primary-600 dark:text-primary-400" size={24} />
								</div>
								<div className="text-xs font-medium text-gray-700 dark:text-gray-300">Free Shipping</div>
								<div className="text-xs text-gray-500 dark:text-gray-400">On orders $50+</div>
							</div>
							<div className="text-center">
								<div className="w-12 h-12 mx-auto mb-2 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
									<RotateCcw className="text-primary-600 dark:text-primary-400" size={24} />
								</div>
								<div className="text-xs font-medium text-gray-700 dark:text-gray-300">30-Day Returns</div>
								<div className="text-xs text-gray-500 dark:text-gray-400">Easy returns</div>
							</div>
							<div className="text-center">
								<div className="w-12 h-12 mx-auto mb-2 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
									<Shield className="text-primary-600 dark:text-primary-400" size={24} />
								</div>
								<div className="text-xs font-medium text-gray-700 dark:text-gray-300">1-Year Warranty</div>
								<div className="text-xs text-gray-500 dark:text-gray-400">Guaranteed</div>
							</div>
						</div>
					</div>
				</div>

				{/* Product Tabs */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
					{/* Tab Headers */}
					<div className="border-b border-gray-200 dark:border-gray-700">
						<div className="flex overflow-x-auto">
							{["description", "reviews", "shipping", "qa"].map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`px-6 py-4 font-medium whitespace-nowrap relative transition-colors ${
										activeTab === tab
											? "text-primary-600 dark:text-primary-400"
											: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
									}`}
								>
									{tab === "description" && "Product Details"}
									{tab === "reviews" && "Reviews"}
									{tab === "shipping" && "Shipping & Returns"}
									{tab === "qa" && "Q&A"}
									{activeTab === tab && (
										<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"></div>
									)}
								</button>
							))}
						</div>
					</div>

					{/* Tab Content */}
					<div className="p-6">
						{activeTab === "description" && (
							<div className="prose dark:prose-invert max-w-none">
								{product.description ? (
									<div dangerouslySetInnerHTML={{ __html: product.description }} />
								) : (
									<p className="text-gray-500 dark:text-gray-400">No description available.</p>
								)}
							</div>
						)}

						{activeTab === "reviews" && (
							<div>
								<ProductReviewsInline
									productId={product.id}
									productName={product.name}
								/>
							</div>
						)}

						{activeTab === "shipping" && (
							<div className="space-y-4">
								<div>
									<h3 className="font-semibold text-lg mb-2">Shipping Information</h3>
									<p className="text-gray-600 dark:text-gray-400">
										Free standard shipping on orders over $50. Standard delivery takes 3-5 business days.
										Express shipping available at checkout.
									</p>
								</div>
								<div>
									<h3 className="font-semibold text-lg mb-2">Returns</h3>
									<p className="text-gray-600 dark:text-gray-400">
										30-day return policy. Items must be in original condition with tags attached.
										Contact customer service to initiate a return.
									</p>
								</div>
							</div>
						)}

						{activeTab === "qa" && (
							<Suspense fallback={<div className="text-center py-8">Loading Q&A...</div>}>
								<ProductQASection productId={product.id} />
							</Suspense>
						)}
					</div>
				</div>
			</div>

			{/* Toast Notifications */}
			<div className="fixed bottom-4 right-4 z-50 space-y-2">
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						message={toast.message}
						type={toast.type}
						onClose={() => removeToast(toast.id)}
					/>
				))}
			</div>
		</div>
	);
}
