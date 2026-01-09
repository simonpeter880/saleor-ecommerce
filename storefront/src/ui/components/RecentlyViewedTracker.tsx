"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";

interface RecentlyViewedTrackerProps {
	product: {
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
	};
}

export function RecentlyViewedTracker({ product }: RecentlyViewedTrackerProps) {
	const { addProduct } = useRecentlyViewed();

	useEffect(() => {
		addProduct(product);
	}, [product.id]); // Only re-run if product ID changes

	return null; // This component doesn't render anything
}
