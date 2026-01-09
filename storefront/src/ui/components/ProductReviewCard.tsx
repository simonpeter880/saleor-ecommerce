"use client";

import { Star, ThumbsUp, ThumbsDown, BadgeCheck } from "lucide-react";
import { useState } from "react";
import type { ProductReview } from "@/hooks/useProductReviews";

interface ProductReviewCardProps {
	review: ProductReview;
	onVote: (reviewId: string, helpful: boolean) => void;
}

export function ProductReviewCard({ review, onVote }: ProductReviewCardProps) {
	const [hasVoted, setHasVoted] = useState(false);

	const handleVote = (helpful: boolean) => {
		if (!hasVoted) {
			onVote(review.id, helpful);
			setHasVoted(true);
		}
	};

	const formatDate = (timestamp: number) => {
		const date = new Date(timestamp);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
			{/* Header */}
			<div className="mb-4 flex items-start justify-between">
				<div>
					<div className="mb-1 flex items-center gap-2">
						<h4 className="font-bold text-gray-900">{review.userName}</h4>
						{review.verified && (
							<div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
								<BadgeCheck size={14} />
								Verified Purchase
							</div>
						)}
					</div>
					<p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
				</div>

				{/* Star Rating */}
				<div className="flex items-center gap-1">
					{[1, 2, 3, 4, 5].map((star) => (
						<Star
							key={star}
							size={16}
							className={`${
								star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
							}`}
						/>
					))}
				</div>
			</div>

			{/* Review Title */}
			{review.title && <h5 className="mb-2 font-bold text-gray-900">{review.title}</h5>}

			{/* Review Comment */}
			<p className="mb-4 text-gray-700 leading-relaxed">{review.comment}</p>

			{/* Review Images */}
			{review.images && review.images.length > 0 && (
				<div className="mb-4 flex gap-2">
					{review.images.map((image, index) => (
						<div
							key={index}
							className="h-20 w-20 overflow-hidden rounded-lg border border-gray-200"
						>
							<img
								src={image}
								alt={`Review ${index + 1}`}
								className="h-full w-full object-cover"
							/>
						</div>
					))}
				</div>
			)}

			{/* Helpful Actions */}
			<div className="flex items-center gap-4 border-t border-gray-200 pt-4">
				<span className="text-sm text-gray-600">Was this helpful?</span>
				<div className="flex gap-2">
					<button
						onClick={() => handleVote(true)}
						disabled={hasVoted}
						className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
							hasVoted
								? "cursor-not-allowed bg-gray-100 text-gray-400"
								: "border border-gray-200 text-gray-700 hover:border-green-500 hover:bg-green-50 hover:text-green-600"
						}`}
					>
						<ThumbsUp size={16} />
						<span>Yes ({review.helpful})</span>
					</button>
					<button
						onClick={() => handleVote(false)}
						disabled={hasVoted}
						className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
							hasVoted
								? "cursor-not-allowed bg-gray-100 text-gray-400"
								: "border border-gray-200 text-gray-700 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
						}`}
					>
						<ThumbsDown size={16} />
						<span>No ({review.notHelpful})</span>
					</button>
				</div>
			</div>
		</div>
	);
}
