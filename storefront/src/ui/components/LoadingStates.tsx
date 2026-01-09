/**
 * Loading skeleton components for better UX while content loads
 */

export function ProductCardSkeleton() {
	return (
		<div className="animate-pulse rounded-lg border border-neutral-200 bg-white p-4">
			{/* Image skeleton */}
			<div className="mb-4 aspect-square w-full rounded-lg bg-neutral-200" />

			{/* Title skeleton */}
			<div className="mb-2 h-4 w-3/4 rounded bg-neutral-200" />

			{/* Description skeleton */}
			<div className="mb-4 h-3 w-full rounded bg-neutral-200" />

			{/* Price skeleton */}
			<div className="mb-4 h-6 w-1/3 rounded bg-neutral-200" />

			{/* Button skeleton */}
			<div className="h-10 w-full rounded bg-neutral-200" />
		</div>
	);
}

export function ProductListSkeleton({ count = 8 }: { count?: number }) {
	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{[...Array(count)].map((_, index) => (
				<ProductCardSkeleton key={index} />
			))}
		</div>
	);
}

export function CategoryCardSkeleton() {
	return (
		<div className="animate-pulse rounded-lg border border-neutral-200 bg-white p-6">
			{/* Icon skeleton */}
			<div className="mb-4 h-12 w-12 rounded-lg bg-neutral-200" />

			{/* Title skeleton */}
			<div className="mb-2 h-5 w-2/3 rounded bg-neutral-200" />

			{/* Subtitle skeleton */}
			<div className="h-3 w-1/2 rounded bg-neutral-200" />
		</div>
	);
}

export function CategoryGridSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{[...Array(count)].map((_, index) => (
				<CategoryCardSkeleton key={index} />
			))}
		</div>
	);
}

export function TestimonialCardSkeleton() {
	return (
		<div className="animate-pulse rounded-lg border border-neutral-200 bg-white p-6">
			{/* Stars skeleton */}
			<div className="mb-4 flex gap-1">
				{[...Array(5)].map((_, index) => (
					<div key={index} className="h-5 w-5 rounded-full bg-neutral-200" />
				))}
			</div>

			{/* Content skeleton */}
			<div className="mb-2 h-3 w-full rounded bg-neutral-200" />
			<div className="mb-2 h-3 w-full rounded bg-neutral-200" />
			<div className="mb-4 h-3 w-3/4 rounded bg-neutral-200" />

			{/* Product tag skeleton */}
			<div className="mb-4 h-6 w-1/2 rounded bg-neutral-200" />

			{/* Author skeleton */}
			<div className="flex items-center gap-3 border-t border-neutral-200 pt-4">
				<div className="h-10 w-10 rounded-full bg-neutral-200" />
				<div className="flex-1">
					<div className="mb-2 h-4 w-1/3 rounded bg-neutral-200" />
					<div className="h-3 w-1/4 rounded bg-neutral-200" />
				</div>
			</div>
		</div>
	);
}

export function TestimonialsGridSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{[...Array(count)].map((_, index) => (
				<TestimonialCardSkeleton key={index} />
			))}
		</div>
	);
}

export function PageHeaderSkeleton() {
	return (
		<div className="animate-pulse mb-8">
			<div className="mb-4 h-10 w-1/2 rounded bg-neutral-200" />
			<div className="h-4 w-3/4 rounded bg-neutral-200" />
		</div>
	);
}

export function BrandCardSkeleton() {
	return (
		<div className="animate-pulse rounded-lg border border-neutral-200 bg-neutral-50 p-6">
			{/* Logo skeleton */}
			<div className="mb-3 h-12 w-12 rounded-lg bg-neutral-200 mx-auto" />

			{/* Name skeleton */}
			<div className="h-3 w-16 rounded bg-neutral-200 mx-auto" />
		</div>
	);
}

export function BrandGridSkeleton({ count = 12 }: { count?: number }) {
	return (
		<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
			{[...Array(count)].map((_, index) => (
				<BrandCardSkeleton key={index} />
			))}
		</div>
	);
}

export function HeroSkeleton() {
	return (
		<div className="animate-pulse bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
			<div className="mx-auto max-w-7xl px-8 py-20 md:py-32">
				<div className="grid gap-12 md:grid-cols-2 md:gap-8">
					<div className="flex flex-col justify-center">
						{/* Title skeleton */}
						<div className="mb-4 h-16 w-3/4 rounded bg-blue-800/50" />
						<div className="mb-6 h-12 w-full rounded bg-blue-800/50" />

						{/* Description skeleton */}
						<div className="mb-2 h-4 w-full rounded bg-blue-700/50" />
						<div className="mb-8 h-4 w-2/3 rounded bg-blue-700/50" />

						{/* Buttons skeleton */}
						<div className="mb-12 flex gap-4">
							<div className="h-12 w-32 rounded-lg bg-blue-800/50" />
							<div className="h-12 w-36 rounded-lg bg-blue-800/50" />
						</div>

						{/* Stats skeleton */}
						<div className="grid grid-cols-3 gap-6 border-t border-blue-400/30 pt-8">
							{[...Array(3)].map((_, index) => (
								<div key={index}>
									<div className="mb-2 h-8 w-20 rounded bg-blue-800/50" />
									<div className="h-3 w-16 rounded bg-blue-700/50" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function TrustBadgesSkeleton() {
	return (
		<div className="animate-pulse border-y border-neutral-200 bg-white py-12">
			<div className="mx-auto max-w-7xl px-8">
				<div className="grid gap-8 md:grid-cols-4">
					{[...Array(4)].map((_, index) => (
						<div key={index} className="flex items-center gap-4">
							<div className="h-10 w-10 rounded-full bg-neutral-200" />
							<div className="flex-1">
								<div className="mb-2 h-4 w-3/4 rounded bg-neutral-200" />
								<div className="h-3 w-1/2 rounded bg-neutral-200" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-8 w-8",
		lg: "h-12 w-12",
	};

	return (
		<div className="flex items-center justify-center">
			<div
				className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-neutral-200 border-t-blue-600`}
			/>
		</div>
	);
}

export function FullPageLoader({ message = "Loading..." }: { message?: string }) {
	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
			<LoadingSpinner size="lg" />
			<p className="text-gray-600">{message}</p>
		</div>
	);
}

export function ButtonLoadingState({ children, loading }: { children: React.ReactNode; loading: boolean }) {
	return (
		<>
			{loading && <LoadingSpinner size="sm" />}
			<span className={loading ? "ml-2" : ""}>{children}</span>
		</>
	);
}

export function ImageSkeleton({ className = "" }: { className?: string }) {
	return (
		<div className={`animate-pulse bg-neutral-200 ${className}`}>
			<svg
				className="mx-auto h-full w-full text-neutral-300"
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
			</svg>
		</div>
	);
}

/**
 * Temu-Style Button Loader
 */
export function TemuButtonLoader({ text = "Loading..." }: { text?: string }) {
	return (
		<span className="flex items-center justify-center gap-2">
			<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
				<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
				<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
			</svg>
			{text}
		</span>
	);
}

/**
 * Inline Loader - For inline loading states
 */
export function InlineLoader({ text = "Loading..." }: { text?: string }) {
	return (
		<div className="flex items-center gap-2 text-gray-600">
			<LoadingSpinner size="sm" />
			<span className="text-sm">{text}</span>
		</div>
	);
}

/**
 * Progress Bar
 */
export function ProgressBar({ progress, className = "" }: { progress: number; className?: string }) {
	return (
		<div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
			<div
				className="bg-gradient-to-r from-temu-500 to-temu-600 h-2 rounded-full transition-all duration-300"
				style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
			/>
		</div>
	);
}

/**
 * Loading Overlay - For loading over existing content
 */
export function LoadingOverlay({ message }: { message?: string }) {
	return (
		<div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
			<div className="text-center">
				<LoadingSpinner size="lg" />
				{message && <p className="mt-3 text-sm font-medium text-gray-700">{message}</p>}
			</div>
		</div>
	);
}

/**
 * Cart Item Skeleton
 */
export function CartItemSkeleton() {
	return (
		<div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 animate-pulse">
			<div className="bg-gray-200 h-24 w-24 rounded" />
			<div className="flex-1 space-y-2">
				<div className="h-4 bg-gray-200 rounded w-3/4" />
				<div className="h-4 bg-gray-200 rounded w-1/2" />
				<div className="h-6 bg-gray-200 rounded w-1/4" />
			</div>
		</div>
	);
}

/**
 * Order Card Skeleton
 */
export function OrderCardSkeleton() {
	return (
		<div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
			<div className="flex justify-between mb-4">
				<div className="h-6 bg-gray-200 rounded w-32" />
				<div className="h-6 bg-gray-200 rounded w-24" />
			</div>
			<div className="space-y-3">
				<div className="h-4 bg-gray-200 rounded w-full" />
				<div className="h-4 bg-gray-200 rounded w-2/3" />
			</div>
			<div className="flex gap-2 mt-4">
				<div className="h-10 bg-gray-200 rounded flex-1" />
				<div className="h-10 bg-gray-200 rounded flex-1" />
			</div>
		</div>
	);
}

/**
 * Search Loading State
 */
export function SearchLoader() {
	return (
		<div className="flex flex-col items-center justify-center py-12">
			<div className="relative">
				<div className="h-16 w-16 border-4 border-gray-200 rounded-full" />
				<div className="absolute top-0 left-0 h-16 w-16 border-4 border-temu-600 rounded-full border-t-transparent animate-spin" />
			</div>
			<p className="mt-4 text-gray-600 font-medium">Searching products...</p>
		</div>
	);
}

/**
 * Pulsing Dots Loader
 */
export function PulsingDots() {
	return (
		<div className="flex gap-1">
			{[0, 1, 2].map((i) => (
				<div
					key={i}
					className="h-2 w-2 bg-temu-600 rounded-full animate-bounce"
					style={{ animationDelay: `${i * 0.15}s` }}
				/>
			))}
		</div>
	);
}
