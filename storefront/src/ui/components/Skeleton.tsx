interface SkeletonProps {
	className?: string;
	variant?: "text" | "circular" | "rectangular";
	width?: string | number;
	height?: string | number;
	animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
	className = "",
	variant = "rectangular",
	width,
	height,
	animation = "pulse",
}: SkeletonProps) {
	const baseClasses = "bg-gray-200 dark:bg-gray-700";

	const variantClasses = {
		text: "rounded h-4",
		circular: "rounded-full",
		rectangular: "rounded-lg",
	};

	const animationClasses = {
		pulse: "animate-pulse",
		wave: "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]",
		none: "",
	};

	const style: React.CSSProperties = {};
	if (width) style.width = typeof width === "number" ? `${width}px` : width;
	if (height) style.height = typeof height === "number" ? `${height}px` : height;

	return (
		<div
			className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
			style={style}
		/>
	);
}

// Product Card Skeleton
export function ProductCardSkeleton() {
	return (
		<div className="group rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 transition-all">
			<Skeleton variant="rectangular" className="w-full aspect-square mb-3" />
			<Skeleton variant="text" className="w-3/4 mb-2" />
			<Skeleton variant="text" className="w-1/2 mb-2" />
			<Skeleton variant="text" className="w-full h-5 mb-2" />
			<div className="flex items-center gap-2">
				<Skeleton variant="text" className="w-20 h-8" />
				<Skeleton variant="text" className="w-16 h-6" />
			</div>
		</div>
	);
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={i} />
			))}
		</div>
	);
}

// Search Result Skeleton
export function SearchResultSkeleton() {
	return (
		<div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
			<div className="flex gap-4">
				<Skeleton variant="rectangular" className="w-24 h-24 flex-shrink-0" />
				<div className="flex-1">
					<Skeleton variant="text" className="w-3/4 mb-2 h-6" />
					<Skeleton variant="text" className="w-1/2 mb-3" />
					<Skeleton variant="text" className="w-full mb-2" />
					<Skeleton variant="text" className="w-2/3" />
				</div>
			</div>
		</div>
	);
}

// Cart Item Skeleton
export function CartItemSkeleton() {
	return (
		<div className="flex gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
			<Skeleton variant="rectangular" className="w-20 h-20 flex-shrink-0" />
			<div className="flex-1">
				<Skeleton variant="text" className="w-3/4 mb-2" />
				<Skeleton variant="text" className="w-1/2 mb-2" />
				<Skeleton variant="text" className="w-20" />
			</div>
			<Skeleton variant="rectangular" className="w-24 h-10" />
		</div>
	);
}

// Review Card Skeleton
export function ReviewCardSkeleton() {
	return (
		<div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<Skeleton variant="text" className="w-32 mb-2" />
					<Skeleton variant="text" className="w-24" />
				</div>
				<Skeleton variant="text" className="w-20" />
			</div>
			<Skeleton variant="text" className="w-full mb-2" />
			<Skeleton variant="text" className="w-full mb-2" />
			<Skeleton variant="text" className="w-3/4" />
		</div>
	);
}

// Category Card Skeleton
export function CategoryCardSkeleton() {
	return (
		<div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
			<Skeleton variant="rectangular" className="w-full aspect-video mb-3" />
			<Skeleton variant="text" className="w-3/4 mb-2" />
			<Skeleton variant="text" className="w-1/2" />
		</div>
	);
}

// Order Item Skeleton
export function OrderItemSkeleton() {
	return (
		<div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
			<div className="flex items-center justify-between mb-4">
				<Skeleton variant="text" className="w-32 h-6" />
				<Skeleton variant="text" className="w-24 h-6" />
			</div>
			<Skeleton variant="text" className="w-full mb-2" />
			<Skeleton variant="text" className="w-2/3 mb-4" />
			<div className="flex justify-between">
				<Skeleton variant="text" className="w-20" />
				<Skeleton variant="text" className="w-24 h-8" />
			</div>
		</div>
	);
}

// Page Header Skeleton
export function PageHeaderSkeleton() {
	return (
		<div className="mb-8">
			<Skeleton variant="text" className="w-64 h-10 mb-2" />
			<Skeleton variant="text" className="w-96 h-6" />
		</div>
	);
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
	return (
		<tr className="border-b border-gray-200 dark:border-gray-700">
			{Array.from({ length: columns }).map((_, i) => (
				<td key={i} className="px-4 py-3">
					<Skeleton variant="text" />
				</td>
			))}
		</tr>
	);
}

// Search Page Skeleton
export function SearchPageSkeleton() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="mx-auto max-w-7xl px-4 py-8 pb-16 sm:px-6 lg:px-8">
				{/* Header Skeleton */}
				<div className="mb-6">
					<Skeleton variant="text" className="h-8 w-64 mb-2" />
					<Skeleton variant="text" className="h-5 w-48" />
				</div>

				{/* Filters Skeleton */}
				<div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
					<div className="flex flex-wrap items-center gap-3">
						<Skeleton variant="rectangular" className="h-10 w-28 rounded-lg" />
						<Skeleton variant="rectangular" className="h-10 w-36 rounded-lg" />
						<Skeleton variant="rectangular" className="h-10 w-24 rounded-lg" />
						<Skeleton variant="rectangular" className="h-10 w-32 rounded-lg" />
					</div>
				</div>

				{/* Products Grid Skeleton */}
				<ProductGridSkeleton count={15} />
			</div>
		</div>
	);
}

// Category Page Skeleton
export function CategoryPageSkeleton() {
	return (
		<div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-16">
				{/* Header Skeleton */}
				<div className="mb-6">
					<Skeleton variant="text" className="h-10 w-48 mb-2" />
					<Skeleton variant="text" className="h-5 w-32" />
				</div>

				{/* Toolbar Skeleton */}
				<div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-4">
							<Skeleton variant="rectangular" className="h-10 w-28 rounded-lg" />
							<Skeleton variant="text" className="h-5 w-24" />
						</div>
						<div className="flex items-center gap-3">
							<Skeleton variant="rectangular" className="h-10 w-20 rounded-lg" />
							<Skeleton variant="rectangular" className="h-10 w-40 rounded-lg" />
						</div>
					</div>
				</div>

				{/* Products Grid Skeleton */}
				<ProductGridSkeleton count={12} />
			</div>
		</div>
	);
}

// Cart Page Skeleton
export function CartPageSkeleton() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header Skeleton */}
				<div className="mb-8">
					<Skeleton variant="text" className="h-10 w-48 mb-2" />
					<Skeleton variant="text" className="h-5 w-32" />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Cart Items Skeleton */}
					<div className="lg:col-span-2 space-y-4">
						{Array.from({ length: 3 }).map((_, i) => (
							<CartItemSkeleton key={i} />
						))}
					</div>

					{/* Order Summary Skeleton */}
					<div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 h-fit">
						<Skeleton variant="text" className="h-6 w-32 mb-4" />
						<div className="space-y-3 mb-6">
							<div className="flex justify-between">
								<Skeleton variant="text" className="h-5 w-20" />
								<Skeleton variant="text" className="h-5 w-24" />
							</div>
							<div className="flex justify-between">
								<Skeleton variant="text" className="h-5 w-16" />
								<Skeleton variant="text" className="h-5 w-20" />
							</div>
							<div className="flex justify-between pt-3 border-t">
								<Skeleton variant="text" className="h-6 w-16" />
								<Skeleton variant="text" className="h-6 w-28" />
							</div>
						</div>
						<Skeleton variant="rectangular" className="h-12 w-full rounded-full" />
					</div>
				</div>
			</div>
		</div>
	);
}

// Product Detail Page Skeleton
export function ProductDetailSkeleton() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Image Gallery Skeleton */}
					<div className="space-y-4">
						<Skeleton variant="rectangular" className="w-full aspect-square rounded-lg" />
						<div className="grid grid-cols-5 gap-2">
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton key={i} variant="rectangular" className="aspect-square rounded-lg" />
							))}
						</div>
					</div>

					{/* Product Details Skeleton */}
					<div className="space-y-6">
						<div>
							<Skeleton variant="text" className="h-8 w-3/4 mb-2" />
							<Skeleton variant="text" className="h-5 w-1/2 mb-4" />
						</div>

						{/* Rating Skeleton */}
						<div className="flex items-center gap-2">
							<Skeleton variant="rectangular" className="h-5 w-32" />
							<Skeleton variant="text" className="h-4 w-24" />
						</div>

						{/* Price Skeleton */}
						<div className="flex items-baseline gap-3">
							<Skeleton variant="text" className="h-10 w-32" />
							<Skeleton variant="text" className="h-6 w-24" />
						</div>

						{/* Stock Status Skeleton */}
						<Skeleton variant="rectangular" className="h-8 w-28 rounded-lg" />

						{/* Quantity Selector Skeleton */}
						<div className="flex items-center gap-4">
							<Skeleton variant="text" className="h-5 w-20" />
							<Skeleton variant="rectangular" className="h-10 w-32 rounded-lg" />
						</div>

						{/* Action Buttons Skeleton */}
						<div className="flex flex-col gap-3">
							<Skeleton variant="rectangular" className="h-14 w-full rounded-full" />
							<Skeleton variant="rectangular" className="h-14 w-full rounded-full" />
						</div>

						{/* Description Skeleton */}
						<div className="pt-6 border-t">
							<Skeleton variant="text" className="h-6 w-32 mb-4" />
							<Skeleton variant="text" className="h-4 w-full mb-2" />
							<Skeleton variant="text" className="h-4 w-full mb-2" />
							<Skeleton variant="text" className="h-4 w-3/4" />
						</div>
					</div>
				</div>

				{/* Reviews Section Skeleton */}
				<div className="mt-16">
					<Skeleton variant="text" className="h-8 w-48 mb-6" />
					<div className="space-y-4">
						{Array.from({ length: 3 }).map((_, i) => (
							<ReviewCardSkeleton key={i} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

// Filter Skeleton for sidebar/expanded filters
export function FilterSkeleton() {
	return (
		<div className="space-y-6">
			{/* Price Range Skeleton */}
			<div>
				<Skeleton variant="text" className="h-5 w-24 mb-3" />
				<Skeleton variant="rectangular" className="h-8 w-full rounded-lg mb-2" />
				<div className="flex items-center gap-2">
					<Skeleton variant="rectangular" className="h-10 flex-1 rounded-lg" />
					<Skeleton variant="text" className="h-4 w-4" />
					<Skeleton variant="rectangular" className="h-10 flex-1 rounded-lg" />
				</div>
			</div>

			{/* Categories Skeleton */}
			<div>
				<Skeleton variant="text" className="h-5 w-28 mb-3" />
				<div className="space-y-2">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="flex items-center gap-2">
							<Skeleton variant="rectangular" className="h-4 w-4 rounded" />
							<Skeleton variant="text" className="h-4 w-32" />
						</div>
					))}
				</div>
			</div>

			{/* Rating Skeleton */}
			<div>
				<Skeleton variant="text" className="h-5 w-16 mb-3" />
				<div className="space-y-2">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="flex items-center gap-2">
							<Skeleton variant="rectangular" className="h-4 w-4 rounded" />
							<Skeleton variant="rectangular" className="h-4 w-24" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
