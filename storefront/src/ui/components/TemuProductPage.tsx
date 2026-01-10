"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	Star,
	Heart,
	Share2,
	Truck,
	Shield,
	RotateCcw,
	ChevronLeft,
	ChevronRight,
	Check,
	Minus,
	Plus,
	ShoppingCart,
	Tag,
	TrendingUp,
	Clock,
	Package,
	Award,
	MessageCircle,
	ThumbsUp,
	ChevronDown,
	Ruler,
	Scale,
	HelpCircle,
	X,
	Maximize2,
	Zap,
} from "lucide-react";
import { formatMoney } from "@/lib/utils";
import { WishlistButton } from "./WishlistButton";
import { ProductReviewsInline } from "./ProductReviewsInline";
import { Toast, useToast } from "./Toast";

// Lazy load heavy components for better performance
const ProductQASection = lazy(() => import("./ProductQASection"));

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
	reviews?: any[];
}

interface TemuProductPageProps {
	product: Product;
	channel: string;
	selectedVariant?: ProductVariant;
	onAddToCart: () => void;
}

export function TemuProductPage({
	product,
	channel,
	selectedVariant,
	onAddToCart,
}: TemuProductPageProps) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [selectedVariantId, setSelectedVariantId] = useState(
		selectedVariant?.id || product.variants?.[0]?.id || ""
	);
	const [activeTab, setActiveTab] = useState("description");
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [showSizeGuide, setShowSizeGuide] = useState(false);
	const [showImageZoom, setShowImageZoom] = useState(false);
	const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 34, seconds: 56 });
	const [imageLoaded, setImageLoaded] = useState(false);
	const { toasts, success, error, removeToast } = useToast();

	// Flash sale countdown timer
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev.seconds > 0) {
					return { ...prev, seconds: prev.seconds - 1 };
				} else if (prev.minutes > 0) {
					return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
				} else if (prev.hours > 0) {
					return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
				}
				return prev;
			});
		}, 1000);
		return () => clearInterval(timer);
	}, []);

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

	// Calculate price and discount
	const basePrice = selectedVariant?.pricing?.price?.gross.amount || product.pricing?.priceRange?.start?.gross.amount || 0;
	const originalPrice = Math.floor(basePrice * 1.15); // Simulated discount
	const discount = Math.floor(((originalPrice - basePrice) / originalPrice) * 100);
	const savings = originalPrice - basePrice;

	// Check availability
	const isAvailable = selectedVariant ? (selectedVariant.quantityAvailable ?? 0) > 0 : product.variants?.some((v) => (v.quantityAvailable ?? 0) > 0) || false;
	const stockCount = selectedVariant?.quantityAvailable || 0;

	// Calculate rating stats (simulated)
	const rating = product.rating || 4.7;
	const reviewCount = product.reviews?.length || 1234;
	const ratingDistribution = [
		{ stars: 5, percentage: 75 },
		{ stars: 4, percentage: 15 },
		{ stars: 3, percentage: 6 },
		{ stars: 2, percentage: 2 },
		{ stars: 1, percentage: 2 },
	];

	const handlePrevImage = () => {
		setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const handleNextImage = () => {
		setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	const handleQuantityChange = (delta: number) => {
		const newQuantity = Math.max(1, Math.min(stockCount, quantity + delta));
		setQuantity(newQuantity);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* Breadcrumb */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm backdrop-blur-lg bg-white/95">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
					<nav className="flex items-center gap-2 text-sm overflow-x-auto">
						<Link href={`/${channel}/`} className="text-gray-600 hover:text-temu-600 transition-colors whitespace-nowrap">
							Home
						</Link>
						<ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
						{product.category && (
							<>
								<Link
									href={`/${channel}/categories/${product.category.slug}`}
									className="text-gray-600 hover:text-temu-600 transition-colors whitespace-nowrap"
								>
									{product.category.name}
								</Link>
								<ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
							</>
						)}
						<span className="text-gray-900 font-semibold truncate">{product.name}</span>
					</nav>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-8">
					{/* Left Column - Image Gallery */}
					<div className="space-y-4">
						{/* Main Image */}
						<div className="relative bg-white rounded-xl overflow-hidden border border-gray-200 aspect-square group">
							{discount > 0 && (
								<div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-secondary-500 to-red-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg animate-pulse">
									<Zap size={12} className="inline mr-1" />
									-{discount}%
								</div>
							)}
							{images.length > 0 && (
								<>
									{!imageLoaded && (
										<div className="absolute inset-0 flex items-center justify-center bg-gray-100">
											<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-temu-500"></div>
										</div>
									)}
									<Image
										src={images[currentImageIndex].url}
										alt={images[currentImageIndex].alt || product.name}
										fill
										className={`object-contain p-4 sm:p-8 transition-all duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
										priority
										quality={90}
										sizes="(max-width: 768px) 100vw, 50vw"
										onLoad={() => setImageLoaded(true)}
									/>
								</>
							)}
							{images.length > 1 && (
								<>
									<button
										onClick={handlePrevImage}
										className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
										aria-label="Previous image"
									>
										<ChevronLeft size={20} className="sm:w-6 sm:h-6" />
									</button>
									<button
										onClick={handleNextImage}
										className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
										aria-label="Next image"
									>
										<ChevronRight size={20} className="sm:w-6 sm:h-6" />
									</button>
								</>
							)}
							{/* Zoom Button */}
							<button
								onClick={() => setShowImageZoom(true)}
								className="absolute bottom-4 right-4 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
								aria-label="Zoom image"
							>
								<Maximize2 size={18} className="sm:w-5 sm:h-5" />
							</button>
						</div>

						{/* Thumbnail Gallery */}
						{images.length > 1 && (
							<div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
								{images.slice(0, 5).map((image, index) => (
									<button
										key={index}
										onClick={() => {
											setCurrentImageIndex(index);
											setImageLoaded(false);
										}}
										className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
											currentImageIndex === index
												? "border-temu-500 shadow-md"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<Image
											src={image.url}
											alt={image.alt || `${product.name} ${index + 1}`}
											width={100}
											height={100}
											className="w-full h-full object-cover"
											loading="lazy"
											quality={60}
										/>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Right Column - Product Info */}
					<div className="space-y-4 sm:space-y-6">
						{/* Title and Rating */}
						<div className="animate-fadeIn">
							<h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-3 leading-tight">{product.name}</h1>
							<div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
								<div className="flex items-center gap-1">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											size={16}
											className={`sm:w-[18px] sm:h-[18px] transition-all ${
												i < Math.floor(rating)
													? "fill-yellow-400 text-yellow-400"
													: "text-gray-300"
											}`}
										/>
									))}
									<span className="ml-2 font-bold text-gray-900 text-sm sm:text-base">{rating.toFixed(1)}</span>
								</div>
								<div className="h-4 w-px bg-gray-300 hidden sm:block" />
								<button className="text-xs sm:text-sm text-temu-600 hover:text-temu-700 font-semibold transition-colors">
									{reviewCount.toLocaleString()} Reviews
								</button>
								<div className="h-4 w-px bg-gray-300 hidden sm:block" />
								<button className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
									<MessageCircle size={14} className="sm:w-4 sm:h-4" />
									Ask Question
								</button>
							</div>
						</div>

						{/* Price */}
						<div className="bg-gradient-to-r from-temu-50 to-orange-50 rounded-xl p-6 border border-temu-200">
							<div className="flex items-baseline gap-3 mb-2">
								<span className="text-4xl font-black text-secondary-500">
									UGX {basePrice.toLocaleString()}
								</span>
								{discount > 0 && (
									<>
										<span className="text-xl text-gray-400 line-through">
											UGX {originalPrice.toLocaleString()}
										</span>
										<span className="bg-secondary-500 text-white text-sm font-bold px-2 py-1 rounded">
											Save {discount}%
										</span>
									</>
								)}
							</div>
							{savings > 0 && (
								<p className="text-green-600 font-semibold flex items-center gap-1">
									<TrendingUp size={16} />
									You save UGX {savings.toLocaleString()}!
								</p>
							)}
						</div>

						{/* Variant Selector */}
						{product.variants && product.variants.length > 1 && (
							<div>
								<h3 className="font-bold text-gray-900 mb-3">
									Select Variant:
								</h3>
								<div className="flex flex-wrap gap-2">
									{product.variants.map((variant) => (
										<button
											key={variant.id}
											onClick={() => setSelectedVariantId(variant.id)}
											className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
												selectedVariantId === variant.id
													? "border-temu-500 bg-temu-50 text-temu-700"
													: "border-gray-200 hover:border-gray-300 text-gray-700"
											}`}
										>
											{variant.name}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Stock Status */}
						<div className="flex items-center gap-3">
							{isAvailable ? (
								<>
									<div className="flex items-center gap-2 text-green-600 font-semibold">
										<Check size={20} className="bg-green-100 rounded-full p-0.5" />
										In Stock
									</div>
									{stockCount < 10 && stockCount > 0 && (
										<span className="text-red-600 font-semibold">
											Only {stockCount} left!
										</span>
									)}
								</>
							) : (
								<div className="text-red-600 font-semibold">Out of Stock</div>
							)}
						</div>

						{/* Quantity Selector */}
						<div>
							<h3 className="font-bold text-gray-900 mb-3">Quantity:</h3>
							<div className="flex items-center gap-3">
								<div className="flex items-center border-2 border-gray-300 rounded-lg">
									<button
										onClick={() => handleQuantityChange(-1)}
										disabled={quantity <= 1}
										className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										<Minus size={18} />
									</button>
									<div className="px-6 py-3 font-bold text-lg border-x-2 border-gray-300">
										{quantity}
									</div>
									<button
										onClick={() => handleQuantityChange(1)}
										disabled={quantity >= stockCount}
										className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										<Plus size={18} />
									</button>
								</div>
								<span className="text-sm text-gray-600">
									{stockCount} available
								</span>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="space-y-3">
							<button
								onClick={handleAddToCart}
								disabled={!isAvailable || !selectedVariantId || isAddingToCart}
								className="w-full bg-gradient-to-r from-temu-500 to-temu-600 text-white font-bold py-4 px-6 rounded-lg hover:from-temu-600 hover:to-temu-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
							>
								<ShoppingCart size={20} />
								{isAddingToCart ? "Adding..." : "Add to Cart"}
							</button>
							<div className="grid grid-cols-2 gap-3">
								<WishlistButton
									productId={product.id}
									channel={channel}
									variant="button"
									size="md"
								/>
								<button
									onClick={handleShare}
									className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-lg font-semibold transition-all"
								>
									<Share2 size={20} />
									Share
								</button>
							</div>
						</div>

						{/* Trust Badges */}
						<div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
							<div className="text-center">
								<div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
									<Truck className="text-green-600" size={24} />
								</div>
								<p className="text-xs font-semibold text-gray-900">Free Shipping</p>
								<p className="text-xs text-gray-600">Orders over 50K</p>
							</div>
							<div className="text-center">
								<div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
									<Shield className="text-blue-600" size={24} />
								</div>
								<p className="text-xs font-semibold text-gray-900">Secure Payment</p>
								<p className="text-xs text-gray-600">100% Protected</p>
							</div>
							<div className="text-center">
								<div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
									<RotateCcw className="text-purple-600" size={24} />
								</div>
								<p className="text-xs font-semibold text-gray-900">Easy Returns</p>
								<p className="text-xs text-gray-600">30 Days Policy</p>
							</div>
						</div>

						{/* Flash Sale Timer */}
						<div className="bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-xl p-4 text-white shadow-lg animate-gradient">
							<div className="flex flex-col sm:flex-row items-center justify-between gap-3">
								<div className="flex items-center gap-2">
									<Tag size={18} className="sm:w-5 sm:h-5 animate-bounce" />
									<span className="font-bold text-sm sm:text-base">Flash Deal Ends In:</span>
								</div>
								<div className="flex gap-2">
									<div className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded font-bold text-sm sm:text-base min-w-[45px] text-center">
										{String(timeLeft.hours).padStart(2, '0')}<span className="text-xs ml-1">H</span>
									</div>
									<div className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded font-bold text-sm sm:text-base min-w-[45px] text-center">
										{String(timeLeft.minutes).padStart(2, '0')}<span className="text-xs ml-1">M</span>
									</div>
									<div className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded font-bold text-sm sm:text-base min-w-[45px] text-center">
										{String(timeLeft.seconds).padStart(2, '0')}<span className="text-xs ml-1">S</span>
									</div>
								</div>
							</div>
						</div>

						{/* Size Guide Button */}
						<button
							onClick={() => setShowSizeGuide(true)}
							className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm text-temu-600 hover:text-temu-700 font-semibold border-2 border-temu-200 hover:border-temu-300 rounded-lg transition-all hover:scale-105"
						>
							<Ruler size={18} />
							View Size Guide
						</button>
					</div>
				</div>

				{/* Product Details Tabs */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
					{/* Tab Headers */}
					<div className="border-b border-gray-200 bg-gray-50">
						<div className="flex overflow-x-auto scrollbar-hide">
							{["description", "reviews", "shipping", "qa"].map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`px-4 sm:px-6 py-3 sm:py-4 font-bold whitespace-nowrap transition-all relative ${
										activeTab === tab
											? "text-temu-600 bg-white"
											: "text-gray-600 hover:text-gray-900 hover:bg-white/50"
									}`}
								>
									{tab === "description" && "Product Details"}
									{tab === "reviews" && `Reviews (${reviewCount})`}
									{tab === "shipping" && "Shipping & Returns"}
									{tab === "qa" && "Q&A"}
									{activeTab === tab && (
										<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-temu-600"></div>
									)}
								</button>
							))}
						</div>
					</div>

					{/* Tab Content */}
					<div className="p-4 sm:p-6">
						{activeTab === "description" && (
							<div className="prose max-w-none animate-fadeIn">
								{product.description ? (
									<div dangerouslySetInnerHTML={{ __html: product.description }} />
								) : (
									<p className="text-gray-600">
										{product.name} - High quality product with excellent features and
										performance. Perfect for your needs.
									</p>
								)}
							</div>
						)}

						{activeTab === "reviews" && (
							<div className="animate-fadeIn">
								<ProductReviewsInline
									productId={product.id}
									productName={product.name}
									channel={channel}
								/>
							</div>
						)}

						{activeTab === "shipping" && (
							<div className="space-y-6 animate-fadeIn">
								<div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
									<Truck className="text-temu-600 mt-1 flex-shrink-0" size={24} />
									<div>
										<h3 className="font-bold text-gray-900 mb-2">Free Shipping</h3>
										<p className="text-gray-600 text-sm sm:text-base">
											Free standard shipping on orders over UGX 50,000. Estimated delivery
											3-7 business days.
										</p>
									</div>
								</div>
								<div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
									<Package className="text-blue-600 mt-1 flex-shrink-0" size={24} />
									<div>
										<h3 className="font-bold text-gray-900 mb-2">Express Shipping</h3>
										<p className="text-gray-600 text-sm sm:text-base">
											Express delivery available for UGX 5,000. Get your order in 1-2
											business days.
										</p>
									</div>
								</div>
								<div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
									<RotateCcw className="text-purple-600 mt-1 flex-shrink-0" size={24} />
									<div>
										<h3 className="font-bold text-gray-900 mb-2">30-Day Returns</h3>
										<p className="text-gray-600 text-sm sm:text-base">
											Not satisfied? Return within 30 days for a full refund. Item must be
											unused and in original packaging.
										</p>
									</div>
								</div>
								<div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
									<Shield className="text-green-600 mt-1 flex-shrink-0" size={24} />
									<div>
										<h3 className="font-bold text-gray-900 mb-2">Buyer Protection</h3>
										<p className="text-gray-600 text-sm sm:text-base">
											Your purchase is protected. If the item doesn't match the description,
											we'll make it right.
										</p>
									</div>
								</div>
							</div>
						)}

						{activeTab === "qa" && (
							<div className="animate-fadeIn">
								<Suspense fallback={
									<div className="flex items-center justify-center py-12">
										<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-temu-500"></div>
									</div>
								}>
									<ProductQASection productId={product.id} channel={channel} />
								</Suspense>
							</div>
						)}
					</div>
				</div>

			</div>

			{/* Toast Notifications */}
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					message={toast.message}
					type={toast.type}
					onClose={() => removeToast(toast.id)}
				/>
			))}

			{/* Size Guide Modal */}
			{showSizeGuide && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
					onClick={() => setShowSizeGuide(false)}
				>
					<div
						className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl animate-slideUp"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
							<h2 className="text-xl sm:text-2xl font-bold text-gray-900">Size Guide</h2>
							<button
								onClick={() => setShowSizeGuide(false)}
								className="p-2 hover:bg-gray-100 rounded-full transition-colors"
								aria-label="Close size guide"
							>
								<X size={24} />
							</button>
						</div>
						<div className="p-6">
							<div className="mb-6">
								<h3 className="text-lg font-bold text-gray-900 mb-3">How to Measure</h3>
								<div className="grid sm:grid-cols-2 gap-4">
									<div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
										<div className="bg-temu-100 p-2 rounded-full">
											<Ruler className="text-temu-600" size={20} />
										</div>
										<div>
											<p className="font-semibold text-gray-900 mb-1">Chest</p>
											<p className="text-sm text-gray-600">Measure around the fullest part of your chest</p>
										</div>
									</div>
									<div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
										<div className="bg-temu-100 p-2 rounded-full">
											<Ruler className="text-temu-600" size={20} />
										</div>
										<div>
											<p className="font-semibold text-gray-900 mb-1">Waist</p>
											<p className="text-sm text-gray-600">Measure around your natural waistline</p>
										</div>
									</div>
								</div>
							</div>

							<div className="overflow-x-auto">
								<table className="w-full border-collapse">
									<thead>
										<tr className="bg-gray-100">
											<th className="px-4 py-3 text-left font-bold text-gray-900 border border-gray-200">Size</th>
											<th className="px-4 py-3 text-left font-bold text-gray-900 border border-gray-200">Chest (cm)</th>
											<th className="px-4 py-3 text-left font-bold text-gray-900 border border-gray-200">Waist (cm)</th>
											<th className="px-4 py-3 text-left font-bold text-gray-900 border border-gray-200">Length (cm)</th>
										</tr>
									</thead>
									<tbody>
										{[
											{ size: 'S', chest: '88-92', waist: '73-77', length: '68-70' },
											{ size: 'M', chest: '93-97', waist: '78-82', length: '71-73' },
											{ size: 'L', chest: '98-102', waist: '83-87', length: '74-76' },
											{ size: 'XL', chest: '103-107', waist: '88-92', length: '77-79' },
											{ size: 'XXL', chest: '108-112', waist: '93-97', length: '80-82' },
										].map((row, idx) => (
											<tr key={idx} className="hover:bg-gray-50 transition-colors">
												<td className="px-4 py-3 font-semibold text-gray-900 border border-gray-200">{row.size}</td>
												<td className="px-4 py-3 text-gray-600 border border-gray-200">{row.chest}</td>
												<td className="px-4 py-3 text-gray-600 border border-gray-200">{row.waist}</td>
												<td className="px-4 py-3 text-gray-600 border border-gray-200">{row.length}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
								<p className="text-sm text-blue-900">
									<strong>Note:</strong> Measurements may vary slightly. If you're between sizes, we recommend sizing up for a more comfortable fit.
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Image Zoom Modal */}
			{showImageZoom && images.length > 0 && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fadeIn"
					onClick={() => setShowImageZoom(false)}
				>
					<button
						onClick={() => setShowImageZoom(false)}
						className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
						aria-label="Close zoom"
					>
						<X size={24} className="text-white" />
					</button>
					<div className="relative w-full max-w-5xl aspect-square">
						<Image
							src={images[currentImageIndex].url}
							alt={images[currentImageIndex].alt || product.name}
							fill
							className="object-contain"
							quality={100}
							sizes="90vw"
						/>
						{images.length > 1 && (
							<>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handlePrevImage();
									}}
									className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full shadow-xl transition-all hover:scale-110"
									aria-label="Previous image"
								>
									<ChevronLeft size={28} />
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleNextImage();
									}}
									className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full shadow-xl transition-all hover:scale-110"
									aria-label="Next image"
								>
									<ChevronRight size={28} />
								</button>
							</>
						)}
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
							{currentImageIndex + 1} / {images.length}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
