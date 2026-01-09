"use client";

import { createContext, useContext, ReactNode } from "react";
import { useWishlist } from "@/hooks/useWishlist";

interface WishlistContextType {
	items: Array<{
		id: string;
		productId: string;
		variantId?: string;
		addedAt: string;
	}>;
	isLoading: boolean;
	isInWishlist: (productId: string, variantId?: string) => boolean;
	addToWishlist: (productId: string, variantId?: string) => Promise<void>;
	removeFromWishlist: (productId: string, variantId?: string) => Promise<void>;
	toggleWishlist: (productId: string, variantId?: string) => Promise<void>;
	clearWishlist: () => void;
	itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
	const wishlist = useWishlist();

	return (
		<WishlistContext.Provider value={wishlist}>
			{children}
		</WishlistContext.Provider>
	);
}

export function useWishlistContext(): WishlistContextType {
	const context = useContext(WishlistContext);
	if (!context) {
		throw new Error("useWishlistContext must be used within a WishlistProvider");
	}
	return context;
}
