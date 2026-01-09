"use client";

import { useState, useEffect, useCallback } from "react";

interface RecentlyViewedProduct {
	id: string;
	name: string;
	slug: string;
	thumbnail?: string;
	price?: number;
	currency?: string;
	category?: string;
	viewedAt: number;
}

const STORAGE_KEY = "techhub_recently_viewed";
const MAX_ITEMS = 20;
const EXPIRY_DAYS = 30;

export function useRecentlyViewed() {
	const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProduct[]>([]);

	// Load from localStorage on mount
	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const items: RecentlyViewedProduct[] = JSON.parse(stored);
				const now = Date.now();
				const expiryTime = EXPIRY_DAYS * 24 * 60 * 60 * 1000;

				// Filter out expired items
				const validItems = items.filter((item) => now - item.viewedAt < expiryTime);
				setRecentlyViewed(validItems);

				// Update storage if items were filtered
				if (validItems.length !== items.length) {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(validItems));
				}
			}
		} catch (error) {
			console.error("Failed to load recently viewed products:", error);
		}
	}, []);

	// Add a product to recently viewed
	const addToRecentlyViewed = useCallback((product: Omit<RecentlyViewedProduct, "viewedAt">) => {
		try {
			setRecentlyViewed((prev) => {
				// Remove if already exists
				const filtered = prev.filter((item) => item.id !== product.id);

				// Add to beginning with current timestamp
				const updated = [{ ...product, viewedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS);

				// Save to localStorage
				localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

				return updated;
			});
		} catch (error) {
			console.error("Failed to add to recently viewed:", error);
		}
	}, []);

	// Remove a product from recently viewed
	const removeFromRecentlyViewed = useCallback((productId: string) => {
		try {
			setRecentlyViewed((prev) => {
				const updated = prev.filter((item) => item.id !== productId);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
		} catch (error) {
			console.error("Failed to remove from recently viewed:", error);
		}
	}, []);

	// Clear all recently viewed
	const clearRecentlyViewed = useCallback(() => {
		try {
			localStorage.removeItem(STORAGE_KEY);
			setRecentlyViewed([]);
		} catch (error) {
			console.error("Failed to clear recently viewed:", error);
		}
	}, []);

	return {
		recentlyViewed,
		addToRecentlyViewed,
		removeFromRecentlyViewed,
		clearRecentlyViewed,
	};
}
