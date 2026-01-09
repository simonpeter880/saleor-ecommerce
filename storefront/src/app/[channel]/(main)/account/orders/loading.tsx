import { OrderCardSkeleton } from "@/ui/components/LoadingStates";

export default function Loading() {
	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4 max-w-4xl">
				{/* Header Skeleton */}
				<div className="flex items-center justify-between mb-8 animate-pulse">
					<div>
						<div className="h-8 w-40 bg-gray-200 rounded mb-2" />
						<div className="h-4 w-56 bg-gray-200 rounded" />
					</div>
					<div className="h-4 w-32 bg-gray-200 rounded" />
				</div>

				{/* Order Cards Skeleton */}
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<OrderCardSkeleton key={i} />
					))}
				</div>
			</div>
		</div>
	);
}
