import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";
import type { ProductListItemFragment } from "@/gql/graphql";
import { formatMoneyRange } from "@/lib/utils";

interface EnhancedProductCardProps {
	product: ProductListItemFragment;
	loading?: "eager" | "lazy";
	priority?: boolean;
	showQuickView?: boolean;
}

export function EnhancedProductCard({
	product,
	loading = "lazy",
	priority = false,
	showQuickView = false,
}: EnhancedProductCardProps) {
	// Extract tech specs from product attributes (if available)
	const getTechSpecs = () => {
		// This will be populated when products have attributes
		// For now, return mock data for demonstration
		return [];
	};

	const specs = getTechSpecs();

	return (
		<li data-testid="EnhancedProductCard" className="group relative">
			<LinkWithChannel href={`/products/${product.slug}`} key={product.id}>
				<div className="overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:border-blue-500 hover:shadow-lg">
					{/* Product Image */}
					<div className="relative aspect-square overflow-hidden bg-neutral-100">
						{product?.thumbnail?.url && (
							<ProductImageWrapper
								loading={loading}
								src={product.thumbnail.url}
								alt={product.thumbnail.alt ?? ""}
								width={512}
								height={512}
								sizes={"512px"}
								priority={priority}
								className="transition group-hover:scale-105"
							/>
						)}

						{/* Badge for new/featured products */}
						<div className="absolute left-2 top-2 flex flex-col gap-2">
							{/* You can add badges based on product metadata */}
							<span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
								New
							</span>
						</div>

						{/* Quick view button (optional) */}
						{showQuickView && (
							<div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-white/95 p-3 backdrop-blur transition group-hover:translate-y-0">
								<button
									className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
									onClick={(e) => {
										e.preventDefault();
										// Handle quick view
									}}
								>
									Quick View
								</button>
								<button
									className="rounded-lg border border-neutral-300 bg-white p-2 transition hover:bg-neutral-50"
									onClick={(e) => {
										e.preventDefault();
										// Handle add to wishlist
									}}
								>
									<svg
										className="h-5 w-5 text-gray-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
										/>
									</svg>
								</button>
							</div>
						)}
					</div>

					{/* Product Info */}
					<div className="p-4">
						{/* Category */}
						<p className="text-xs font-medium uppercase tracking-wide text-blue-600">
							{product.category?.name}
						</p>

						{/* Product Name */}
						<h3 className="mt-2 font-semibold text-neutral-900 line-clamp-2 group-hover:text-blue-600">
							{product.name}
						</h3>

						{/* Tech Specs Preview */}
						{specs.length > 0 && (
							<div className="mt-3 flex flex-wrap gap-2">
								{specs.slice(0, 3).map((spec, idx) => (
									<span
										key={idx}
										className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600"
									>
										{spec}
									</span>
								))}
							</div>
						)}

						{/* Rating (placeholder for future implementation) */}
						<div className="mt-3 flex items-center gap-1">
							<div className="flex">
								{[...Array(5)].map((_, i) => (
									<svg
										key={i}
										className={`h-4 w-4 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								))}
							</div>
							<span className="ml-1 text-xs text-neutral-500">(128)</span>
						</div>

						{/* Price */}
						<div className="mt-4 flex items-center justify-between">
							<p className="text-lg font-bold text-neutral-900">
								{formatMoneyRange({
									start: product?.pricing?.priceRange?.start?.gross,
									stop: product?.pricing?.priceRange?.stop?.gross,
								})}
							</p>

							{/* Stock status */}
							<span className="flex items-center gap-1 text-xs text-green-600">
								<svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								In Stock
							</span>
						</div>

						{/* Add to Cart Button */}
						<button
							className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
							onClick={(e) => {
								e.preventDefault();
								// Handle add to cart
							}}
						>
							Add to Cart
						</button>
					</div>
				</div>
			</LinkWithChannel>
		</li>
	);
}
