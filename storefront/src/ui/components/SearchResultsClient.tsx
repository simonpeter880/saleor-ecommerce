"use client";

import { useState } from "react";
import { SearchFilters } from "./SearchFilters";
import { SearchResultCard } from "./SearchResultCard";
import { Pagination } from "./Pagination";
import { Search } from "lucide-react";

interface Category {
	id: string;
	name: string;
	slug: string;
}

interface Product {
	id: string;
	name: string;
	slug: string;
	isAvailable?: boolean | null;
	thumbnail?: {
		url?: string;
		alt?: string | null;
	} | null;
	pricing?: {
		priceRange?: {
			start?: {
				gross: {
					amount: number;
					currency: string;
				};
			} | null;
		} | null;
	} | null;
	category?: {
		name: string;
		slug?: string;
	} | null;
	description?: string | null;
}

interface PageInfo {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor?: string | null;
	endCursor?: string | null;
}

interface SearchResultsClientProps {
	products: Product[];
	totalCount: number;
	pageInfo: PageInfo;
	categories: Category[];
	selectedCategories: string[];
	minPrice?: number;
	maxPrice?: number;
	currentSort: string;
	searchQuery: string;
	minRating?: number;
	inStockOnly?: boolean;
	channel: string;
	activeFiltersCount: number;
}

export function SearchResultsClient({
	products,
	totalCount,
	pageInfo,
	categories,
	selectedCategories,
	minPrice,
	maxPrice,
	currentSort,
	searchQuery,
	minRating,
	inStockOnly,
	channel,
	activeFiltersCount,
}: SearchResultsClientProps) {
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	return (
		<>
			{/* Filters Section */}
			<SearchFilters
				categories={categories}
				selectedCategories={selectedCategories}
				minPrice={minPrice}
				maxPrice={maxPrice}
				currentSort={currentSort}
				searchQuery={searchQuery}
				minRating={minRating}
				inStockOnly={inStockOnly}
				viewMode={viewMode}
				onViewModeChange={setViewMode}
			/>

			{totalCount > 0 ? (
				<div>
					{/* Products Grid/List */}
					<div
						className={
							viewMode === "grid"
								? "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5"
								: "flex flex-col gap-4"
						}
					>
						{products.map((product) => (
							<SearchResultCard
								key={product.id}
								product={product}
								channel={channel}
								searchQuery={searchQuery}
								viewMode={viewMode}
							/>
						))}
					</div>

					{/* Pagination */}
					<div className="mt-8">
						<Pagination pageInfo={pageInfo} />
					</div>
				</div>
			) : (
				<div className="rounded-lg border border-gray-200 bg-white py-16 text-center">
					<div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
						<Search className="text-gray-400" size={32} />
					</div>
					<h2 className="mb-2 text-2xl font-bold text-gray-900">No results found</h2>
					<p className="mb-6 text-gray-600">
						We couldn&apos;t find any products matching &quot;{searchQuery}&quot;
						{activeFiltersCount > 0 && " with the selected filters"}
					</p>
					<p className="text-sm text-gray-500">
						Try checking your spelling, using more general terms, or removing some filters
					</p>
				</div>
			)}
		</>
	);
}
