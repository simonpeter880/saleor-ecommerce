"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/contexts/ToastContext";
import { addToWishlist as addToWishlistAPI, removeFromWishlist as removeFromWishlistAPI } from "@/app/account-queries";
import { getCurrentUser } from "@/lib/auth-utils";

interface WishlistItem {
	id: string;
	productId: string;
	variantId?: string;
	addedAt: string;
}

interface UseWishlistReturn {
	items: WishlistItem[];
	isLoading: boolean;
	isInWishlist: (productId: string, variantId?: string) => boolean;
	addToWishlist: (productId: string, variantId?: string) => Promise<void>;
	removeFromWishlist: (productId: string, variantId?: string) => Promise<void>;
	toggleWishlist: (productId: string, variantId?: string) => Promise<void>;
	clearWishlist: () => void;
	itemCount: number;
}

const STORAGE_KEY = "techhub_wishlist_guest";

export function useWishlist(): UseWishlistReturn {
	const [items, setItems] = useState<WishlistItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const { success, info, error: showError } = useToast();

	// Check authentication status and load wishlist on mount
	useEffect(() => {
		async function loadWishlist() {
			try {
				// Check if user is authenticated
				const user = await getCurrentUser();
				setIsAuthenticated(!!user);

				if (user) {
					// For authenticated users, wishlist is managed by backend
					// Items are fetched server-side in account/wishlist page
					// This hook only manages optimistic UI updates
					setItems([]);
				} else {
					// For guest users, use localStorage
					const stored = localStorage.getItem(STORAGE_KEY);
					if (stored) {
						setItems(JSON.parse(stored) as WishlistItem[]);
					}
				}
			} catch (err) {
				console.error("Failed to load wishlist:", err);
				// Fallback to localStorage
				const stored = localStorage.getItem(STORAGE_KEY);
				if (stored) {
					setItems(JSON.parse(stored) as WishlistItem[]);
				}
			} finally {
				setIsLoading(false);
			}
		}

		loadWishlist();
	}, []);

	// Save to localStorage for guest users only
	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
		}
	}, [items, isLoading, isAuthenticated]);

	const isInWishlist = useCallback(
		(productId: string, variantId?: string): boolean => {
			return items.some(
				(item) =>
					item.productId === productId &&
					(variantId ? item.variantId === variantId : true)
			);
		},
		[items]
	);

	const addToWishlist = useCallback(
		async (productId: string, variantId?: string): Promise<void> => {
			if (isInWishlist(productId, variantId)) return;

			const newItem: WishlistItem = {
				id: `${productId}-${variantId || "default"}-${Date.now()}`,
				productId,
				variantId,
				addedAt: new Date().toISOString(),
			};

			// Optimistic update
			setItems((prev) => [...prev, newItem]);

			if (isAuthenticated) {
				// Sync with backend for authenticated users
				try {
					const result = await addToWishlistAPI(productId);
					if (result.success) {
						success("Added to wishlist!", "Item saved to your account");
					} else {
						// Revert optimistic update on error
						setItems((prev) => prev.filter((item) => item.id !== newItem.id));
						showError("Failed to add to wishlist", result.errors?.[0] || "Please try again");
					}
				} catch (err) {
					// Revert optimistic update on error
					setItems((prev) => prev.filter((item) => item.id !== newItem.id));
					showError("Failed to add to wishlist", "Please try again");
					console.error("Error adding to wishlist:", err);
				}
			} else {
				// Guest user - localStorage only
				success("Added to wishlist!", "Sign in to save across devices");
			}
		},
		[isInWishlist, isAuthenticated, success, showError]
	);

	const removeFromWishlist = useCallback(
		async (productId: string, variantId?: string): Promise<void> => {
			// Store removed items for potential revert
			const removedItems = items.filter(
				(item) =>
					item.productId === productId &&
					(variantId ? item.variantId === variantId : true)
			);

			// Optimistic update
			setItems((prev) =>
				prev.filter(
					(item) =>
						!(
							item.productId === productId &&
							(variantId ? item.variantId === variantId : true)
						)
				)
			);

			if (isAuthenticated) {
				// Sync with backend for authenticated users
				try {
					const result = await removeFromWishlistAPI(productId);
					if (result.success) {
						info("Removed from wishlist", "Item removed from your account");
					} else {
						// Revert optimistic update on error
						setItems((prev) => [...prev, ...removedItems]);
						showError("Failed to remove from wishlist", result.errors?.[0] || "Please try again");
					}
				} catch (err) {
					// Revert optimistic update on error
					setItems((prev) => [...prev, ...removedItems]);
					showError("Failed to remove from wishlist", "Please try again");
					console.error("Error removing from wishlist:", err);
				}
			} else {
				// Guest user - localStorage only
				info("Removed from wishlist", "Item removed");
			}
		},
		[items, isAuthenticated, info, showError]
	);

	const toggleWishlist = useCallback(
		async (productId: string, variantId?: string): Promise<void> => {
			if (isInWishlist(productId, variantId)) {
				await removeFromWishlist(productId, variantId);
			} else {
				await addToWishlist(productId, variantId);
			}
		},
		[isInWishlist, addToWishlist, removeFromWishlist]
	);

	const clearWishlist = useCallback(() => {
		setItems([]);
	}, []);

	return {
		items,
		isLoading,
		isInWishlist,
		addToWishlist,
		removeFromWishlist,
		toggleWishlist,
		clearWishlist,
		itemCount: items.length,
	};
}
