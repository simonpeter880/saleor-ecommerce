"use client";

import { Star } from "lucide-react";

interface ReviewStatsProps {
	averageRating: number;
	totalReviews: number;
	ratingDistribution: {
		5: number;
		4: number;
		3: number;
		2: number;
		1: number;
	};
	onFilterByRating?: (rating: number | null) => void;
	selectedRating?: number | null;
}

export function ProductReviewStats({
	averageRating,
	totalReviews,
	ratingDistribution,
	onFilterByRating,
	selectedRating,
}: ReviewStatsProps) {
	if (totalReviews === 0) {
		return (
			<div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
				<div className="mb-2 text-gray-400">
					<Star size={48} className="mx-auto" />
				</div>
				<h3 className="mb-1 text-lg font-bold text-gray-900">No reviews yet</h3>
				<p className="text-sm text-gray-600">Be the first to review this product</p>
			</div>
		);
	}

	const getRatingPercentage = (rating: number) => {
		return totalReviews > 0 ? Math.round((ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100) : 0;
	};

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-6">
			{/* Overall Rating */}
			<div className="mb-6 text-center">
				<div className="mb-2 text-5xl font-black text-gray-900">{averageRating.toFixed(1)}</div>
				<div className="mb-2 flex items-center justify-center gap-1">
					{[1, 2, 3, 4, 5].map((star) => (
						<Star
							key={star}
							size={20}
							className={`${
								star <= Math.round(averageRating)
									? "fill-yellow-400 text-yellow-400"
									: "text-gray-300"
							}`}
						/>
					))}
				</div>
				<p className="text-sm text-gray-600">
					Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
				</p>
			</div>

			{/* Rating Distribution */}
			<div className="space-y-2">
				{[5, 4, 3, 2, 1].map((rating) => {
					const percentage = getRatingPercentage(rating);
					const count = ratingDistribution[rating as keyof typeof ratingDistribution];
					const isSelected = selectedRating === rating;

					return (
						<button
							key={rating}
							onClick={() => onFilterByRating?.(isSelected ? null : rating)}
							className={`flex w-full items-center gap-3 rounded-lg p-2 transition-colors ${
								isSelected
									? "bg-temu-50 ring-2 ring-temu-500"
									: "hover:bg-gray-50"
							}`}
						>
							<div className="flex items-center gap-1">
								<span className="text-sm font-medium text-gray-700">{rating}</span>
								<Star size={14} className="fill-yellow-400 text-yellow-400" />
							</div>

							<div className="flex-1">
								<div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
									<div
										className="h-full bg-yellow-400 transition-all duration-300"
										style={{ width: `${percentage}%` }}
									/>
								</div>
							</div>

							<span className="text-sm text-gray-600 w-12 text-right">
								{percentage}%
							</span>
							<span className="text-xs text-gray-500 w-8 text-right">
								({count})
							</span>
						</button>
					);
				})}
			</div>

			{selectedRating && (
				<button
					onClick={() => onFilterByRating?.(null)}
					className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
				>
					Show All Reviews
				</button>
			)}
		</div>
	);
}
