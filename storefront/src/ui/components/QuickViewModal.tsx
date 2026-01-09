"use client";

import { useState } from "react";
import { X, ShoppingCart, Heart, Star, Check, Minus, Plus, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WishlistButton } from "./WishlistButton";

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

interface ProductImage {
	url: string;
	alt?: string;
}

interface QuickViewProduct {
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
		};
	};
	rating?: number;
	reviews?: any[];
}

interface QuickViewModalProps {
	product: QuickViewProduct | null;
	channel: string;
	isOpen: boolean;
	onClose: () => void;
	onAddToCart?: (variantId: string, quantity: number) => Promise<void>;
}

export function QuickViewModal({
	product,
	channel,
	isOpen,
	onClose,
	onAddToCart,
}: QuickViewModalProps) {
	const [selectedImage, setSelectedImage] = useState(0);
	const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
	const [quantity, setQuantity] = useState(1);
	const [isAddingToCart, setIsAddingToCart] = useState(false);

	if (!isOpen || !product) return null;

	const images = product.media && product.media.length > 0 ? product.media : (product.thumbnail ? [product.thumbnail] : []);
	const variant = selectedVariant || product.variants?.[0];
	const price = variant?.pricing?.price?.gross || product.pricing?.priceRange?.start?.gross;
	const isInStock = (variant?.quantityAvailable || 0) > 0;
	const maxQuantity = Math.min(variant?.quantityAvailable || 10, 10);

	const handleAddToCart = async () => {
		if (!variant || !onAddToCart) return;

		setIsAddingToCart(true);
		try {
			await onAddToCart(variant.id, quantity);
		} finally {
			setIsAddingToCart(false);
		}
	};

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 overflow-y-auto"
			onClick={handleBackdropClick}
		>
			<div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl my-8 animate-in fade-in zoom-in duration-300">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
				>
					<X size={24} className="text-gray-600" />
				</button>

				<div className="grid md:grid-cols-2 gap-8 p-8">
					{/* Left: Images */}
					<div>
						{/* Main Image */}
						<div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
							{images[selectedImage] ? (
								<Image
									src={images[selectedImage].url}
									alt={images[selectedImage].alt || product.name}
									fill
									className="object-contain"
									sizes="(max-width: 768px) 100vw, 50vw"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-gray-400">
									No image available
								</div>
							)}
						</div>

						{/* Thumbnail Gallery */}
						{images.length > 1 && (
							<div className="flex gap-2 overflow-x-auto">
								{images.map((image, index) => (
									<button
										key={index}
										onClick={() => setSelectedImage(index)}
										className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
											selectedImage === index
												? "border-temu-500 ring-2 ring-temu-200"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<Image
											src={image.url}
											alt={image.alt || `${product.name} ${index + 1}`}
											fill
											className="object-cover"
											sizes="80px"
										/>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Right: Product Info */}
					<div className="flex flex-col">
						{/* Category */}
						{product.category && (
							<Link
								href={`/${channel}/categories/${product.category.slug}`}
								className="text-sm font-semibold text-temu-600 hover:underline mb-2"
								onClick={onClose}
							>
								{product.category.name}
							</Link>
						)}

						{/* Product Name */}
						<h2 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h2>

						{/* Rating */}
						{product.rating && (
							<div className="flex items-center gap-2 mb-4">
								<div className="flex">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											size={16}
											className={`${
												i < Math.round(product.rating!)
													? "fill-yellow-400 text-yellow-400"
													: "text-gray-300"
											}`}
										/>
									))}
								</div>
								<span className="text-sm text-gray-600">
									({product.reviews?.length || 0} reviews)
								</span>
							</div>
						)}

						{/* Price */}
						{price && (
							<div className="mb-6">
								<div className="text-3xl font-bold text-gray-900">
									UGX {price.amount.toLocaleString()}
								</div>
							</div>
						)}

						{/* Stock Status */}
						<div className="mb-6">
							{isInStock ? (
								<div className="flex items-center gap-2 text-green-600">
									<Check size={20} />
									<span className="font-semibold">In Stock</span>
									<span className="text-sm text-gray-600">
										({variant?.quantityAvailable} available)
									</span>
								</div>
							) : (
								<div className="text-red-600 font-semibold">Out of Stock</div>
							)}
						</div>

						{/* Variant Selector */}
						{product.variants && product.variants.length > 1 && (
							<div className="mb-6">
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Select Variant
								</label>
								<div className="flex flex-wrap gap-2">
									{product.variants.map((v) => (
										<button
											key={v.id}
											onClick={() => setSelectedVariant(v)}
											className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
												variant?.id === v.id
													? "border-temu-500 bg-temu-50 text-temu-700"
													: "border-gray-300 hover:border-gray-400"
											}`}
										>
											{v.name}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Quantity Selector */}
						{isInStock && (
							<div className="mb-6">
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Quantity
								</label>
								<div className="flex items-center gap-3">
									<button
										onClick={() => setQuantity(Math.max(1, quantity - 1))}
										disabled={quantity <= 1}
										className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<Minus size={20} />
									</button>
									<span className="text-xl font-bold w-12 text-center">{quantity}</span>
									<button
										onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
										disabled={quantity >= maxQuantity}
										className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<Plus size={20} />
									</button>
								</div>
							</div>
						)}

						{/* Description */}
						{product.description && (
							<div className="mb-6">
								<p className="text-gray-600 line-clamp-3">{product.description}</p>
							</div>
						)}

						{/* Actions */}
						<div className="flex gap-3 mt-auto">
							{isInStock && onAddToCart && (
								<button
									onClick={handleAddToCart}
									disabled={isAddingToCart}
									className="flex-1 bg-gradient-to-r from-temu-500 to-temu-600 text-white font-bold py-3 px-6 rounded-lg hover:from-temu-600 hover:to-temu-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
								>
									{isAddingToCart ? (
										<>
											<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
											</svg>
											Adding...
										</>
									) : (
										<>
											<ShoppingCart size={20} />
											Add to Cart
										</>
									)}
								</button>
							)}

							<WishlistButton
								productId={product.id}
								channel={channel}
								variant="icon"
								size="lg"
								className="flex-shrink-0"
							/>
						</div>

						{/* View Full Details Link */}
						<Link
							href={`/${channel}/products/${product.slug}`}
							onClick={onClose}
							className="mt-4 flex items-center justify-center gap-2 text-temu-600 hover:text-temu-700 font-semibold"
						>
							<ExternalLink size={18} />
							View Full Details
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
