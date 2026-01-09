"use client";

import { useState, useEffect, useCallback } from "react";

export interface ProductReview {
	id: string;
	productId: string;
	userId: string;
	userName: string;
	userEmail: string;
	rating: number;
	title: string;
	comment: string;
	images?: string[];
	verified: boolean;
	helpful: number;
	notHelpful: number;
	createdAt: number;
}

interface ReviewStats {
	averageRating: number;
	totalReviews: number;
	ratingDistribution: {
		5: number;
		4: number;
		3: number;
		2: number;
		1: number;
	};
}

const STORAGE_KEY = "techhub_product_reviews";

function getAllReviews(): ProductReview[] {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch (error) {
		console.error("Failed to load reviews:", error);
		return [];
	}
}

function saveReviews(reviews: ProductReview[]): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
	} catch (error) {
		console.error("Failed to save reviews:", error);
	}
}

export function useProductReviews(productId: string) {
	const [reviews, setReviews] = useState<ProductReview[]>([]);
	const [stats, setStats] = useState<ReviewStats>({
		averageRating: 0,
		totalReviews: 0,
		ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
	});

	// Load reviews for this product
	useEffect(() => {
		const allReviews = getAllReviews();
		const productReviews = allReviews.filter((r) => r.productId === productId);

		// Sort by date (newest first)
		productReviews.sort((a, b) => b.createdAt - a.createdAt);

		setReviews(productReviews);

		// Calculate stats
		if (productReviews.length > 0) {
			const total = productReviews.length;
			const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
			const average = sum / total;

			const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
			productReviews.forEach((r) => {
				distribution[r.rating as keyof typeof distribution]++;
			});

			setStats({
				averageRating: Math.round(average * 10) / 10,
				totalReviews: total,
				ratingDistribution: distribution,
			});
		} else {
			setStats({
				averageRating: 0,
				totalReviews: 0,
				ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
			});
		}
	}, [productId]);

	// Add a new review
	const addReview = useCallback(
		(review: Omit<ProductReview, "id" | "helpful" | "notHelpful" | "createdAt">) => {
			const newReview: ProductReview = {
				...review,
				id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				helpful: 0,
				notHelpful: 0,
				createdAt: Date.now(),
			};

			const allReviews = getAllReviews();
			allReviews.push(newReview);
			saveReviews(allReviews);

			// Update local state
			setReviews((prev) => [newReview, ...prev]);

			return newReview;
		},
		[]
	);

	// Mark review as helpful/not helpful
	const voteReview = useCallback((reviewId: string, helpful: boolean) => {
		const allReviews = getAllReviews();
		const reviewIndex = allReviews.findIndex((r) => r.id === reviewId);

		if (reviewIndex !== -1) {
			if (helpful) {
				allReviews[reviewIndex].helpful++;
			} else {
				allReviews[reviewIndex].notHelpful++;
			}

			saveReviews(allReviews);
			setReviews((prev) =>
				prev.map((r) =>
					r.id === reviewId
						? {
								...r,
								helpful: helpful ? r.helpful + 1 : r.helpful,
								notHelpful: !helpful ? r.notHelpful + 1 : r.notHelpful,
						  }
						: r
				)
			);
		}
	}, []);

	// Filter reviews by rating
	const filterByRating = useCallback(
		(rating: number | null) => {
			const allReviews = getAllReviews();
			const productReviews = allReviews.filter((r) => r.productId === productId);

			if (rating === null) {
				return productReviews.sort((a, b) => b.createdAt - a.createdAt);
			}

			return productReviews
				.filter((r) => r.rating === rating)
				.sort((a, b) => b.createdAt - a.createdAt);
		},
		[productId]
	);

	return {
		reviews,
		stats,
		addReview,
		voteReview,
		filterByRating,
	};
}
