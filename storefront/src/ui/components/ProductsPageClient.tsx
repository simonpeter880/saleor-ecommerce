"use client";

import { useState, useEffect } from "react";
import { ProductList } from "./ProductList";
import { ViewToggle } from "./ViewToggle";
import { SortBy } from "./SortBy";
import { type ProductListItemFragment } from "@/gql/graphql";

interface ProductsPageClientProps {
	products: readonly ProductListItemFragment[];
	channel: string;
}

export function ProductsPageClient({ products, channel }: ProductsPageClientProps) {
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	// Persist view preference
	useEffect(() => {
		const savedView = localStorage.getItem("productViewMode");
		if (savedView === "grid" || savedView === "list") {
			setViewMode(savedView);
		}
	}, []);

	const handleViewChange = (view: "grid" | "list") => {
		setViewMode(view);
		localStorage.setItem("productViewMode", view);
	};

	return (
		<>
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
				<h1 className="text-2xl font-bold">All Products</h1>
				<div className="flex items-center gap-4">
					<ViewToggle view={viewMode} onChange={handleViewChange} />
					<SortBy />
				</div>
			</div>
			<ProductList products={products} viewMode={viewMode} channel={channel} />
		</>
	);
}
