"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/contexts/ToastContext";

export interface ComparisonProduct {
	id: string;
	name: string;
	slug: string;
	thumbnail?: string;
	price?: number;
	currency?: string;
	category?: string;
	description?: string;
	isAvailable?: boolean;
	variants?: Array<{
		id: string;
		name: string;
		quantityAvailable?: number | null;
	}>;
}

const STORAGE_KEY = "techhub_comparison";
const MAX_ITEMS = 4;

export function useProductComparison() {
	const { success, info, warning } = useToast();
	const [comparisonProducts, setComparisonProducts] = useState<ComparisonProduct[]>([]);

	// Load from localStorage on mount
	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const items: ComparisonProduct[] = JSON.parse(stored);
				setComparisonProducts(items);
			}
		} catch (error) {
			console.error("Failed to load comparison products:", error);
		}
	}, []);

	// Add product to comparison
	const addToComparison = useCallback((product: ComparisonProduct) => {
		try {
			let wasAdded = false;
			setComparisonProducts((prev) => {
				// Check if already in comparison
				if (prev.some((p) => p.id === product.id)) {
					info("Already in Comparison", "This product is already in your comparison list");
					return prev;
				}

				// Check if limit reached
				if (prev.length >= MAX_ITEMS) {
					warning("Comparison Limit Reached", `You can only compare up to ${MAX_ITEMS} products at a time`);
					return prev;
				}

				const updated = [...prev, product];
				localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				wasAdded = true;
				return updated;
			});

			if (wasAdded) {
				success("Added to Comparison", `${product.name} added to comparison`);
			}

			return wasAdded;
		} catch (error) {
			console.error("Failed to add to comparison:", error);
			return false;
		}
	}, [success, info, warning]);

	// Remove product from comparison
	const removeFromComparison = useCallback((productId: string) => {
		try {
			let productName = "";
			setComparisonProducts((prev) => {
				const product = prev.find((p) => p.id === productId);
				if (product) {
					productName = product.name;
				}
				const updated = prev.filter((p) => p.id !== productId);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
				return updated;
			});
			if (productName) {
				info("Removed from Comparison", `${productName} removed from comparison`);
			}
		} catch (error) {
			console.error("Failed to remove from comparison:", error);
		}
	}, [info]);

	// Clear all comparison products
	const clearComparison = useCallback(() => {
		try {
			const count = comparisonProducts.length;
			localStorage.removeItem(STORAGE_KEY);
			setComparisonProducts([]);
			if (count > 0) {
				success("Comparison Cleared", `Removed ${count} product${count === 1 ? '' : 's'} from comparison`);
			}
		} catch (error) {
			console.error("Failed to clear comparison:", error);
		}
	}, [comparisonProducts.length, success]);

	// Check if product is in comparison
	const isInComparison = useCallback(
		(productId: string) => {
			return comparisonProducts.some((p) => p.id === productId);
		},
		[comparisonProducts]
	);

	return {
		comparisonProducts,
		addToComparison,
		removeFromComparison,
		clearComparison,
		isInComparison,
		count: comparisonProducts.length,
		canAddMore: comparisonProducts.length < MAX_ITEMS,
		maxItems: MAX_ITEMS,
	};
}
