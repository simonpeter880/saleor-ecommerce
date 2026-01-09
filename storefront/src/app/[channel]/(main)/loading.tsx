import { HeroSkeleton, ProductListSkeleton, CategoryGridSkeleton, TrustBadgesSkeleton } from "@/ui/components/LoadingStates";

export default function Loading() {
	return (
		<>
			{/* Hero Section Skeleton */}
			<HeroSkeleton />

			{/* Categories Preview Skeleton */}
			<section className="bg-neutral-50 py-16">
				<div className="mx-auto max-w-7xl px-8">
					<div className="mb-8 h-8 w-48 animate-pulse rounded bg-neutral-200" />
					<CategoryGridSkeleton count={4} />
				</div>
			</section>

			{/* Featured Products Skeleton */}
			<section className="mx-auto max-w-7xl p-8 pb-16">
				<div className="mb-8 h-8 w-56 animate-pulse rounded bg-neutral-200" />
				<ProductListSkeleton count={8} />
			</section>

			{/* Trust Badges Skeleton */}
			<TrustBadgesSkeleton />
		</>
	);
}
