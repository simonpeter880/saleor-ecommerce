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

interface ProductReviewsInlineProps {
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
		<div className="flex gap-0.5">
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

export function ProductReviewsInline({
	productId,
	productName,
	channel,
}: ProductReviewsInlineProps) {
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
					getProductReviews(productId, 5),
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
			const data = await getProductReviews(productId, 5, endCursor || undefined);
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
			<div className="flex items-center justify-center py-8">
				<Loader2 className="h-6 w-6 animate-spin text-gray-400" />
				<span className="ml-2 text-gray-600">Loading reviews...</span>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Success/Error Message */}
			{submitMessage && (
				<div
					className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
						submitMessage.type === "success"
							? "bg-green-50 border-green-200 text-green-700"
							: "bg-red-50 border-red-200 text-red-700"
					}`}
				>
					<CheckCircle size={16} />
					<span>{submitMessage.text}</span>
				</div>
			)}

			{/* Rating Summary */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6 border-b border-gray-200">
				<div className="text-center">
					<div className="text-5xl font-black text-gray-900 mb-2">
						{averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
					</div>
					<div className="flex justify-center mb-2">
						<StarRating rating={Math.round(averageRating)} size="lg" />
					</div>
					<p className="text-gray-600">
						{totalReviews > 0 ? `${totalReviews} reviews` : "No reviews yet"}
					</p>
					<button
						onClick={() => setShowWriteReview(!showWriteReview)}
						className="mt-4 bg-temu-500 hover:bg-temu-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
					>
						Write a Review
					</button>
				</div>
				<div className="space-y-2">
					{distribution.length > 0 ? (
						distribution.map((item) => (
							<div key={item.stars} className="flex items-center gap-3">
								<span className="text-sm font-semibold w-12">{item.stars} star</span>
								<div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
									<div
										className="bg-yellow-400 h-full transition-all"
										style={{ width: `${item.percentage}%` }}
									/>
								</div>
								<span className="text-sm text-gray-600 w-12">{item.percentage.toFixed(0)}%</span>
							</div>
						))
					) : (
						<div className="flex items-center justify-center h-full text-gray-500 text-sm">
							Be the first to review!
						</div>
					)}
				</div>
			</div>

			{/* Write Review Form */}
			{showWriteReview && (
				<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
					<h4 className="font-bold text-gray-900 mb-3">Write Your Review</h4>
					<form onSubmit={handleSubmitReview} className="space-y-3">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
							<StarRating rating={formRating} size="lg" interactive onRatingChange={setFormRating} />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
							<input
								type="text"
								value={formTitle}
								onChange={(e) => setFormTitle(e.target.value)}
								placeholder="Sum up your experience"
								className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-temu-500 focus:outline-none"
								required
								minLength={3}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Review *</label>
							<textarea
								rows={3}
								value={formContent}
								onChange={(e) => setFormContent(e.target.value)}
								placeholder="Share your thoughts (min 10 characters)"
								className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-temu-500 focus:outline-none"
								required
								minLength={10}
							/>
						</div>
						<div className="flex gap-2">
							<button
								type="submit"
								disabled={isSubmitting || formRating === 0}
								className="bg-temu-500 hover:bg-temu-600 text-white font-semibold py-2 px-4 rounded-lg text-sm disabled:opacity-50 flex items-center gap-2"
							>
								{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
								{isSubmitting ? "Submitting..." : "Submit"}
							</button>
							<button
								type="button"
								onClick={() => {
									setShowWriteReview(false);
									setFormRating(0);
									setFormTitle("");
									setFormContent("");
								}}
								className="border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-gray-50"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Sort Options */}
			{reviews.length > 0 && (
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-600">{reviews.length} reviews</span>
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as "helpful" | "recent")}
						className="rounded border border-gray-300 px-3 py-1 text-sm focus:border-temu-500 focus:outline-none"
					>
						<option value="helpful">Most Helpful</option>
						<option value="recent">Most Recent</option>
					</select>
				</div>
			)}

			{/* Reviews List */}
			{reviews.length > 0 ? (
				<div className="space-y-4">
					{sortedReviews.map((review) => (
						<div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
							<div className="flex items-start justify-between mb-2">
								<div>
									<div className="flex items-center gap-2 mb-1">
										<StarRating rating={review.rating} size="sm" />
										<span className="font-semibold text-gray-900 text-sm">{review.authorName}</span>
										{review.isVerifiedPurchase && (
											<span className="inline-flex items-center gap-1 text-xs text-green-600">
												<CheckCircle size={12} />
												Verified
											</span>
										)}
									</div>
									<p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
								</div>
							</div>
							<h5 className="font-semibold text-gray-900 mb-1">{review.title}</h5>
							<p className="text-gray-700 text-sm mb-3">{review.content}</p>
							<div className="flex items-center gap-4">
								<button
									onClick={() => handleHelpful(review.id)}
									disabled={votedReviews.has(review.id)}
									className={`flex items-center gap-1 text-xs transition ${
										votedReviews.has(review.id)
											? "text-temu-600"
											: "text-gray-500 hover:text-gray-700"
									}`}
								>
									<ThumbsUp size={14} className={votedReviews.has(review.id) ? "fill-current" : ""} />
									Helpful ({review.helpfulCount})
								</button>
								<button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
									<Flag size={14} />
									Report
								</button>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-8 text-gray-500">
					<p className="mb-3">No reviews yet</p>
					<button
						onClick={() => setShowWriteReview(true)}
						className="text-temu-600 hover:text-temu-700 font-semibold text-sm"
					>
						Be the first to review!
					</button>
				</div>
			)}

			{/* Load More */}
			{hasMore && (
				<button
					onClick={handleLoadMore}
					disabled={isLoadingMore}
					className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
				>
					{isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
					{isLoadingMore ? "Loading..." : "Load More Reviews"}
				</button>
			)}
		</div>
	);
}
