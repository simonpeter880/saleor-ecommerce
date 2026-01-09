"use client";

import { useState, useCallback, useEffect } from "react";
import { Star, ThumbsUp, Flag, CheckCircle, Loader2 } from "lucide-react";
import {
	getProductReviews,
	getReviewStatistics,
	submitReviewAction,
	markReviewHelpfulAction,
	type Review,
	type ReviewStatistics,
} from "@/app/review-actions";

interface ProductReviewsProps {
	productId: string;
	productName: string;
	channel: string;
}

function StarRating({
	rating,
	size = "md",
	interactive = false,
	onRatingChange,
}: {
	rating: number;
	size?: "sm" | "md" | "lg";
	interactive?: boolean;
	onRatingChange?: (rating: number) => void;
}) {
	const [hoverRating, setHoverRating] = useState(0);

	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-5 w-5",
		lg: "h-6 w-6",
	};

	const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

	return (
		<div className="flex gap-1">
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					key={star}
					type="button"
					disabled={!interactive}
					onClick={() => interactive && onRatingChange?.(star)}
					onMouseEnter={() => interactive && setHoverRating(star)}
					onMouseLeave={() => interactive && setHoverRating(0)}
					className={`${interactive ? "cursor-pointer" : "cursor-default"}`}
				>
					<Star
						className={`${sizeClasses[size]} ${
							star <= displayRating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
						} ${interactive ? "transition-colors hover:text-yellow-400" : ""}`}
					/>
				</button>
			))}
		</div>
	);
}

function formatDate(dateString: string) {
	const date = new Date(dateString);
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - date.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 1) return "Yesterday";
	if (diffDays < 7) return `${diffDays} days ago`;
	if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
	if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
	return date.toLocaleDateString();
}

export function ProductReviews({
	productId,
	productName,
	channel,
}: ProductReviewsProps) {
	const [showWriteReview, setShowWriteReview] = useState(false);
	const [sortBy, setSortBy] = useState<"helpful" | "recent">("helpful");
	const [reviews, setReviews] = useState<Review[]>([]);
	const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [hasMore, setHasMore] = useState(false);
	const [endCursor, setEndCursor] = useState<string | null>(null);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [votedReviews, setVotedReviews] = useState<Set<string>>(new Set());

	// Review form state
	const [formRating, setFormRating] = useState(0);
	const [formTitle, setFormTitle] = useState("");
	const [formContent, setFormContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

	// Fetch reviews on mount
	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			try {
				const [reviewsData, statsData] = await Promise.all([
					getProductReviews(productId, 10),
					getReviewStatistics(productId),
				]);

				setReviews(reviewsData.reviews);
				setHasMore(reviewsData.hasMore);
				setEndCursor(reviewsData.endCursor);
				setStatistics(statsData);
			} catch (error) {
				console.error("Error fetching reviews:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchData();
	}, [productId]);

	const sortedReviews = [...reviews].sort((a, b) => {
		if (sortBy === "helpful") {
			return b.helpfulCount - a.helpfulCount;
		}
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});

	const handleLoadMore = async () => {
		if (!hasMore || isLoadingMore) return;

		setIsLoadingMore(true);
		try {
			const data = await getProductReviews(productId, 10, endCursor || undefined);
			setReviews((prev) => [...prev, ...data.reviews]);
			setHasMore(data.hasMore);
			setEndCursor(data.endCursor);
		} catch (error) {
			console.error("Error loading more reviews:", error);
		} finally {
			setIsLoadingMore(false);
		}
	};

	const handleSubmitReview = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			if (formRating === 0 || !formTitle.trim() || !formContent.trim()) {
				setSubmitMessage({ type: "error", text: "Please fill in all fields" });
				setTimeout(() => setSubmitMessage(null), 3000);
				return;
			}

			setIsSubmitting(true);
			setSubmitMessage(null);

			const result = await submitReviewAction(
				{
					productId,
					rating: formRating,
					title: formTitle,
					content: formContent,
				},
				channel
			);

			setIsSubmitting(false);

			if (result.success) {
				// Add the new review to the list
				if (result.review) {
					const newReview: Review = {
						id: result.review.id,
						rating: result.review.rating,
						title: result.review.title,
						content: result.review.content,
						authorName: "You",
						isVerifiedPurchase: false,
						helpfulCount: 0,
						createdAt: new Date().toISOString(),
					};
					setReviews((prev) => [newReview, ...prev]);
				}

				setFormRating(0);
				setFormTitle("");
				setFormContent("");
				setShowWriteReview(false);
				setSubmitMessage({ type: "success", text: result.message || "Thank you for your review!" });
			} else {
				setSubmitMessage({ type: "error", text: result.error || "Failed to submit review" });
			}

			setTimeout(() => setSubmitMessage(null), 5000);
		},
		[formRating, formTitle, formContent, productId, channel]
	);

	const handleHelpful = useCallback(
		async (reviewId: string) => {
			if (votedReviews.has(reviewId)) return;

			// Optimistically update
			setVotedReviews((prev) => new Set([...prev, reviewId]));
			setReviews((prev) =>
				prev.map((review) =>
					review.id === reviewId
						? { ...review, helpfulCount: review.helpfulCount + 1 }
						: review
				)
			);

			const result = await markReviewHelpfulAction(reviewId, channel);

			if (!result.success) {
				// Revert on error
				setVotedReviews((prev) => {
					const newSet = new Set(prev);
					newSet.delete(reviewId);
					return newSet;
				});
				setReviews((prev) =>
					prev.map((review) =>
						review.id === reviewId
							? { ...review, helpfulCount: review.helpfulCount - 1 }
							: review
					)
				);
			}
		},
		[votedReviews, channel]
	);

	const averageRating = statistics?.averageRating || 0;
	const totalReviews = statistics?.totalCount || reviews.length;
	const distribution = statistics?.distribution || [];

	if (isLoading) {
		return (
			<section className="mt-16 border-t border-neutral-200 pt-16">
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-gray-400" />
					<span className="ml-3 text-gray-600">Loading reviews...</span>
				</div>
			</section>
		);
	}

	return (
		<section className="mt-16 border-t border-neutral-200 pt-16">
			<div className="mb-8">
				<h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
			</div>

			{/* Success/Error Message */}
			{submitMessage && (
				<div
					className={`mb-6 flex items-center gap-2 rounded-lg border p-4 ${
						submitMessage.type === "success"
							? "bg-green-50 border-green-200 text-green-700"
							: "bg-red-50 border-red-200 text-red-700"
					}`}
				>
					<CheckCircle size={20} />
					<span>{submitMessage.text}</span>
				</div>
			)}

			{/* Rating Summary */}
			<div className="mb-12 grid gap-8 md:grid-cols-2">
				{/* Overall Rating */}
				<div className="rounded-lg border border-neutral-200 bg-white p-8 text-center">
					<div className="mb-2 text-5xl font-bold text-gray-900">
						{averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
					</div>
					<StarRating rating={Math.round(averageRating)} size="lg" />
					<p className="mt-3 text-sm text-gray-600">
						{totalReviews > 0 ? `Based on ${totalReviews} reviews` : "No reviews yet"}
					</p>
					<button
						onClick={() => setShowWriteReview(!showWriteReview)}
						className="mt-6 rounded-lg bg-temu-600 px-6 py-2.5 font-semibold text-white transition hover:bg-temu-700"
					>
						Write a Review
					</button>
				</div>

				{/* Rating Distribution */}
				<div className="space-y-3">
					{distribution.length > 0 ? (
						distribution.map((item) => (
							<div key={item.stars} className="flex items-center gap-3">
								<span className="w-12 text-sm font-medium text-gray-700">{item.stars} star</span>
								<div className="flex-1">
									<div className="h-3 w-full overflow-hidden rounded-full bg-neutral-200">
										<div
											className="h-full bg-yellow-400 transition-all"
											style={{ width: `${item.percentage}%` }}
										/>
									</div>
								</div>
								<span className="w-16 text-right text-sm text-gray-600">
									{item.count} ({item.percentage.toFixed(0)}%)
								</span>
							</div>
						))
					) : (
						<div className="flex items-center justify-center h-full text-gray-500">
							<p>Be the first to review this product!</p>
						</div>
					)}
				</div>
			</div>

			{/* Write Review Form */}
			{showWriteReview && (
				<div className="mb-8 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
					<h3 className="mb-4 text-lg font-bold text-gray-900">Write Your Review for {productName}</h3>
					<form onSubmit={handleSubmitReview} className="space-y-4">
						<div>
							<label className="mb-2 block text-sm font-medium text-gray-900">Your Rating *</label>
							<StarRating rating={formRating} size="lg" interactive onRatingChange={setFormRating} />
							{formRating === 0 && (
								<p className="mt-1 text-sm text-gray-500">Click to select a rating</p>
							)}
						</div>
						<div>
							<label className="mb-2 block text-sm font-medium text-gray-900">Review Title *</label>
							<input
								type="text"
								value={formTitle}
								onChange={(e) => setFormTitle(e.target.value)}
								placeholder="Sum up your experience"
								className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-temu-500 focus:outline-none focus:ring-1 focus:ring-temu-500"
								required
								minLength={3}
							/>
						</div>
						<div>
							<label className="mb-2 block text-sm font-medium text-gray-900">Your Review *</label>
							<textarea
								rows={4}
								value={formContent}
								onChange={(e) => setFormContent(e.target.value)}
								placeholder="Tell us what you think about this product (minimum 10 characters)"
								className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-temu-500 focus:outline-none focus:ring-1 focus:ring-temu-500"
								required
								minLength={10}
							/>
						</div>
						<div className="flex gap-3">
							<button
								type="submit"
								disabled={isSubmitting || formRating === 0}
								className="rounded-lg bg-temu-600 px-6 py-2.5 font-semibold text-white transition hover:bg-temu-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							>
								{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
								{isSubmitting ? "Submitting..." : "Submit Review"}
							</button>
							<button
								type="button"
								onClick={() => {
									setShowWriteReview(false);
									setFormRating(0);
									setFormTitle("");
									setFormContent("");
								}}
								className="rounded-lg border border-neutral-300 px-6 py-2.5 font-semibold text-gray-700 transition hover:bg-neutral-100"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Sort Options */}
			{reviews.length > 0 && (
				<div className="mb-6 flex items-center justify-between">
					<h3 className="font-semibold text-gray-900">{reviews.length} Customer Reviews</h3>
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as "helpful" | "recent")}
						className="rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-temu-500 focus:outline-none"
					>
						<option value="helpful">Most Helpful</option>
						<option value="recent">Most Recent</option>
					</select>
				</div>
			)}

			{/* Reviews List */}
			{reviews.length > 0 ? (
				<div className="space-y-6">
					{sortedReviews.map((review) => (
						<div key={review.id} className="rounded-lg border border-neutral-200 bg-white p-6">
							<div className="mb-4 flex items-start justify-between">
								<div>
									<div className="mb-2 flex items-center gap-3">
										<StarRating rating={review.rating} size="sm" />
										<span className="text-sm font-medium text-gray-900">{review.authorName}</span>
										{review.isVerifiedPurchase && (
											<span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
												<CheckCircle size={12} />
												Verified Purchase
											</span>
										)}
									</div>
									<h4 className="font-semibold text-gray-900">{review.title}</h4>
								</div>
								<span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
							</div>

							<p className="mb-4 text-gray-700">{review.content}</p>

							<div className="flex items-center gap-4 border-t border-neutral-200 pt-4">
								<button
									onClick={() => handleHelpful(review.id)}
									disabled={votedReviews.has(review.id)}
									className={`flex items-center gap-2 text-sm transition ${
										votedReviews.has(review.id)
											? "text-temu-600 cursor-default"
											: "text-gray-600 hover:text-gray-900"
									}`}
								>
									<ThumbsUp size={16} className={votedReviews.has(review.id) ? "fill-current" : ""} />
									Helpful ({review.helpfulCount})
								</button>
								<button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
									<Flag size={16} />
									Report
								</button>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-12 bg-gray-50 rounded-lg">
					<p className="text-gray-600 mb-4">No reviews yet. Be the first to share your thoughts!</p>
					<button
						onClick={() => setShowWriteReview(true)}
						className="rounded-lg bg-temu-600 px-6 py-2.5 font-semibold text-white transition hover:bg-temu-700"
					>
						Write the First Review
					</button>
				</div>
			)}

			{/* Load More */}
			{hasMore && (
				<div className="mt-8 text-center">
					<button
						onClick={handleLoadMore}
						disabled={isLoadingMore}
						className="rounded-lg border border-neutral-300 px-8 py-3 font-semibold text-gray-700 transition hover:bg-neutral-50 disabled:opacity-50 flex items-center gap-2 mx-auto"
					>
						{isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
						{isLoadingMore ? "Loading..." : "Load More Reviews"}
					</button>
				</div>
			)}
		</section>
	);
}
