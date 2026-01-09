"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface RecentlyViewedProduct {
	id: string;
	name: string;
	slug: string;
	thumbnail?: {
		url: string;
		alt?: string;
	};
	pricing?: {
		priceRange?: {
			start?: {
				gross: {
					amount: number;
					currency: string;
				};
			};
		};
	};
	category?: {
		name: string;
		slug: string;
	};
	viewedAt: number;
}

interface RecentlyViewedContextType {
	products: RecentlyViewedProduct[];
	addProduct: (product: Omit<RecentlyViewedProduct, "viewedAt">) => void;
	clearProducts: () => void;
	getProducts: (limit?: number) => RecentlyViewedProduct[];
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const STORAGE_KEY = "techhub_recently_viewed";
const MAX_PRODUCTS = 20;

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
	const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	// Load from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				// Clean old entries (older than 30 days)
				const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
				const filtered = parsed.filter(
					(p: RecentlyViewedProduct) => p.viewedAt > thirtyDaysAgo
				);
				setProducts(filtered);
			} catch (error) {
				console.error("Error loading recently viewed:", error);
			}
		}
		setIsLoaded(true);
	}, []);

	// Save to localStorage whenever products change
	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
		}
	}, [products, isLoaded]);

	const addProduct = (product: Omit<RecentlyViewedProduct, "viewedAt">) => {
		setProducts((prev) => {
			// Remove if already exists
			const filtered = prev.filter((p) => p.id !== product.id);
			// Add to beginning with timestamp
			const updated = [
				{ ...product, viewedAt: Date.now() },
				...filtered,
			].slice(0, MAX_PRODUCTS);
			return updated;
		});
	};

	const clearProducts = () => {
		setProducts([]);
	};

	const getProducts = (limit: number = 10) => {
		return products.slice(0, limit);
	};

	return (
		<RecentlyViewedContext.Provider
			value={{
				products,
				addProduct,
				clearProducts,
				getProducts,
			}}
		>
			{children}
		</RecentlyViewedContext.Provider>
	);
}

export function useRecentlyViewed() {
	const context = useContext(RecentlyViewedContext);
	if (context === undefined) {
		throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
	}
	return context;
}
