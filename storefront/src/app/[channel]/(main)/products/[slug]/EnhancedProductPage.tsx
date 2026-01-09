"use client";

import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { ProductImageGallery } from "@/ui/components/ProductImageGallery";
import { ProductSpecifications, getDefaultSpecifications } from "@/ui/components/ProductSpecifications";
import { ProductReviews } from "@/ui/components/ProductReviews";

interface ProductImage {
	url: string;
	alt: string | null;
}

interface ProductVariant {
	id: string;
	name: string;
	sku: string;
	pricing: {
		price: {
			gross: {
				amount: number;
				currency: string;
			};
		};
	} | null;
	quantityAvailable: number;
}

interface Product {
	id: string;
	name: string;
	slug: string;
	seoDescription: string | null;
	category: {
		name: string;
		slug: string;
	} | null;
	thumbnail: ProductImage | null;
	variants: ProductVariant[] | null;
	productType: {
		slug: string;
	};
}

interface EnhancedProductPageProps {
	product: Product;
	description?: string | null;
	channel: string;
}

export function EnhancedProductPage({ product, description, channel }: EnhancedProductPageProps) {
	const { addItem } = useCart();
	const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
		product.variants?.[0] || null
	);
	const [quantity, setQuantity] = useState(1);
	const [addedToCart, setAddedToCart] = useState(false);

	// Prepare images for gallery
	const images = product.thumbnail ? [product.thumbnail] : [];

	// Get specifications based on product type
	const specifications = getDefaultSpecifications(product.productType.slug);

	const handleAddToCart = () => {
		if (!selectedVariant) return;

		addItem({
			id: selectedVariant.id,
			productId: product.id,
			variantId: selectedVariant.id,
			name: `${product.name} - ${selectedVariant.name}`,
			price: selectedVariant.pricing?.price?.gross.amount || 0,
			quantity,
			image: product.thumbnail?.url,
			slug: product.slug,
			category: product.category?.name,
			maxQuantity: selectedVariant.quantityAvailable,
		});

		setAddedToCart(true);
		setTimeout(() => setAddedToCart(false), 3000);
	};

	const price = selectedVariant?.pricing?.price?.gross.amount || 0;
	const currency = selectedVariant?.pricing?.price?.gross.currency || "USD";
	const isAvailable = (selectedVariant?.quantityAvailable || 0) > 0;

	return (
		<div className="mx-auto max-w-7xl px-8 py-8">
			{/* Breadcrumb */}
			<nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
				<a href="/" className="hover:text-blue-600">
					Home
				</a>
				<span>/</span>
				{product.category && (
					<>
						<a href={`/categories/${product.category.slug}`} className="hover:text-blue-600">
							{product.category.name}
						</a>
						<span>/</span>
					</>
				)}
				<span className="text-gray-900">{product.name}</span>
			</nav>

			{/* Product Details Grid */}
			<div className="grid gap-8 lg:grid-cols-2">
				{/* Left Column - Images */}
				<div>
					<ProductImageGallery images={images} productName={product.name} />
				</div>

				{/* Right Column - Product Info */}
				<div>
					{/* Category Badge */}
					{product.category && (
						<span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600">
							{product.category.name}
						</span>
					)}

					{/* Product Name */}
					<h1 className="mt-4 text-3xl font-bold text-gray-900 lg:text-4xl">
						{product.name}
					</h1>

					{/* Rating (placeholder) */}
					<div className="mt-4 flex items-center gap-3">
						<div className="flex">
							{[...Array(5)].map((_, i) => (
								<svg
									key={i}
									className={`h-5 w-5 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
							))}
						</div>
						<span className="text-sm text-gray-600">4.5 (128 reviews)</span>
					</div>

					{/* Price */}
					<div className="mt-6 flex items-baseline gap-3">
						<span className="text-4xl font-bold text-gray-900">
							${price.toFixed(2)}
						</span>
						<span className="text-sm text-gray-500">{currency}</span>
					</div>

					{/* Description */}
					{product.seoDescription && (
						<p className="mt-6 text-gray-700">{product.seoDescription}</p>
					)}

					{/* Variant Selector */}
					{product.variants && product.variants.length > 1 && (
						<div className="mt-8">
							<label className="mb-3 block font-semibold text-gray-900">
								Select Option
							</label>
							<div className="grid gap-3">
								{product.variants.map((variant) => (
									<button
										key={variant.id}
										onClick={() => setSelectedVariant(variant)}
										className={`rounded-lg border-2 p-4 text-left transition ${
											selectedVariant?.id === variant.id
												? "border-blue-600 bg-blue-50"
												: "border-neutral-200 hover:border-neutral-400"
										}`}
									>
										<div className="flex items-center justify-between">
											<span className="font-medium text-gray-900">
												{variant.name}
											</span>
											<span className="font-bold text-blue-600">
												${variant.pricing?.price?.gross.amount.toFixed(2)}
											</span>
										</div>
										<span className="mt-1 text-sm text-gray-600">
											SKU: {variant.sku}
										</span>
									</button>
								))}
							</div>
						</div>
					)}

					{/* Quantity Selector */}
					<div className="mt-8">
						<label className="mb-3 block font-semibold text-gray-900">Quantity</label>
						<div className="flex items-center gap-3">
							<button
								onClick={() => setQuantity(Math.max(1, quantity - 1))}
								className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 transition hover:bg-neutral-50"
							>
								−
							</button>
							<span className="w-16 text-center text-lg font-medium">{quantity}</span>
							<button
								onClick={() =>
									setQuantity(
										Math.min(quantity + 1, selectedVariant?.quantityAvailable || 999)
									)
								}
								className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 transition hover:bg-neutral-50"
							>
								+
							</button>
							<span className="ml-4 text-sm text-gray-600">
								{selectedVariant?.quantityAvailable || 0} available
							</span>
						</div>
					</div>

					{/* Add to Cart Button */}
					<div className="mt-8 space-y-3">
						<button
							onClick={handleAddToCart}
							disabled={!isAvailable || !selectedVariant}
							className="w-full rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{addedToCart ? "✓ Added to Cart!" : "Add to Cart"}
						</button>
						<button className="w-full rounded-lg border-2 border-blue-600 px-8 py-4 text-lg font-semibold text-blue-600 transition hover:bg-blue-50">
							Add to Wishlist
						</button>
					</div>

					{/* Stock Status */}
					<div className="mt-6 rounded-lg bg-green-50 p-4">
						<div className="flex items-center gap-2 text-green-800">
							<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							<span className="font-medium">
								{isAvailable ? "In Stock - Ships within 2-3 business days" : "Out of Stock"}
							</span>
						</div>
					</div>

					{/* Features */}
					<div className="mt-8 space-y-3 border-t border-neutral-200 pt-8">
						<div className="flex items-center gap-3 text-sm text-gray-700">
							<svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							Free shipping on orders over $100
						</div>
						<div className="flex items-center gap-3 text-sm text-gray-700">
							<svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							30-day return policy
						</div>
						<div className="flex items-center gap-3 text-sm text-gray-700">
							<svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							1-year manufacturer warranty
						</div>
						<div className="flex items-center gap-3 text-sm text-gray-700">
							<svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							100% authentic products
						</div>
					</div>
				</div>
			</div>

			{/* Tabs Section */}
			<div className="mt-16 border-t border-neutral-200 pt-16">
				<div className="space-y-16">
					{/* Description */}
					{description && (
						<div>
							<h2 className="mb-6 text-2xl font-bold text-gray-900">Product Description</h2>
							<div
								className="prose max-w-none text-gray-700"
								dangerouslySetInnerHTML={{ __html: description }}
							/>
						</div>
					)}

					{/* Specifications */}
					{specifications.length > 0 && (
						<ProductSpecifications specifications={specifications} />
					)}
				</div>
			</div>

			{/* Reviews */}
			<ProductReviews
				productId={product.id}
				productName={product.name}
				channel={channel}
			/>
		</div>
	);
}
