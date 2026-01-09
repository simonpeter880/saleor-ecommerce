"use client";

import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { TemuProductCard } from "./TemuProductCard";
import { Clock } from "lucide-react";

interface RecentlyViewedProps {
	channel: string;
	limit?: number;
	excludeProductId?: string;
}

export function RecentlyViewed({
	channel,
	limit = 5,
	excludeProductId,
}: RecentlyViewedProps) {
	const { getProducts } = useRecentlyViewed();

	// Get products, excluding the current one if specified
	let products = getProducts(limit + 1);
	if (excludeProductId) {
		products = products.filter((p) => p.id !== excludeProductId);
	}
	products = products.slice(0, limit);

	if (products.length === 0) {
		return null;
	}

	return (
		<section className="mb-8">
			<div className="flex items-center gap-2 mb-6">
				<Clock className="text-temu-500" size={24} />
				<h2 className="text-2xl font-black text-gray-900">Recently Viewed</h2>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{products.map((product) => (
					<TemuProductCard
						key={product.id}
						product={{
							id: product.id,
							name: product.name,
							slug: product.slug,
							thumbnail: product.thumbnail,
							pricing: product.pricing,
							category: product.category ? { name: product.category.name } : undefined,
						}}
						channel={channel}
					/>
				))}
			</div>
		</section>
	);
}
