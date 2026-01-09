"use client";

import { useState, useMemo } from "react";
import { ChevronDown, SlidersHorizontal, X, Grid3X3, LayoutGrid } from "lucide-react";
import { TemuProductCard } from "./TemuProductCard";

interface Product {
	id: string;
	name: string;
	slug: string;
	isAvailable?: boolean | null;
	thumbnail?: {
		url?: string;
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
		slug?: string;
	};
	variants?: Array<{
		id: string;
		quantityAvailable?: number | null;
	}> | null;
}

interface ProductSortFilterProps {
	products: Product[];
	channel: string;
	showFilters?: boolean;
}

type SortOption = "relevance" | "price-low" | "price-high" | "name-asc" | "name-desc";
type GridSize = "small" | "large";

export function ProductSortFilter({ products, channel, showFilters = true }: ProductSortFilterProps) {
	const [sortBy, setSortBy] = useState<SortOption>("relevance");
	const [showSortDropdown, setShowSortDropdown] = useState(false);
	const [showFilterPanel, setShowFilterPanel] = useState(false);
	const [gridSize, setGridSize] = useState<GridSize>("small");

	// Filters
	const [inStockOnly, setInStockOnly] = useState(false);
	const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: Infinity });

	// Calculate price range from products
	const { minPrice, maxPrice } = useMemo(() => {
		const prices = products
			.map((p) => p.pricing?.priceRange?.start?.gross.amount ?? 0)
			.filter((p) => p > 0);
		return {
			minPrice: Math.min(...prices, 0),
			maxPrice: Math.max(...prices, 10000000),
		};
	}, [products]);

	// Filter and sort products
	const filteredAndSortedProducts = useMemo(() => {
		let result = [...products];

		// Apply filters
		if (inStockOnly) {
			result = result.filter((p) => {
				const totalStock = p.variants?.reduce((sum, v) => sum + (v.quantityAvailable ?? 0), 0) ?? 0;
				return p.isAvailable !== false && totalStock > 0;
			});
		}

		if (priceRange.min > 0 || priceRange.max < Infinity) {
			result = result.filter((p) => {
				const price = p.pricing?.priceRange?.start?.gross.amount ?? 0;
				return price >= priceRange.min && price <= priceRange.max;
			});
		}

		// Apply sorting
		switch (sortBy) {
			case "price-low":
				result.sort((a, b) => {
					const priceA = a.pricing?.priceRange?.start?.gross.amount ?? 0;
					const priceB = b.pricing?.priceRange?.start?.gross.amount ?? 0;
					return priceA - priceB;
				});
				break;
			case "price-high":
				result.sort((a, b) => {
					const priceA = a.pricing?.priceRange?.start?.gross.amount ?? 0;
					const priceB = b.pricing?.priceRange?.start?.gross.amount ?? 0;
					return priceB - priceA;
				});
				break;
			case "name-asc":
				result.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case "name-desc":
				result.sort((a, b) => b.name.localeCompare(a.name));
				break;
			default:
				// Keep original order for relevance
				break;
		}

		return result;
	}, [products, sortBy, inStockOnly, priceRange]);

	const sortOptions: { value: SortOption; label: string }[] = [
		{ value: "relevance", label: "Relevance" },
		{ value: "price-low", label: "Price: Low to High" },
		{ value: "price-high", label: "Price: High to Low" },
		{ value: "name-asc", label: "Name: A to Z" },
		{ value: "name-desc", label: "Name: Z to A" },
	];

	const activeFiltersCount = (inStockOnly ? 1 : 0) + (priceRange.min > 0 || priceRange.max < maxPrice ? 1 : 0);

	const clearFilters = () => {
		setInStockOnly(false);
		setPriceRange({ min: 0, max: Infinity });
	};

	return (
		<div>
			{/* Toolbar */}
			<div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-lg border border-gray-200">
				<div className="flex items-center gap-4">
					{/* Filter Button */}
					{showFilters && (
						<button
							onClick={() => setShowFilterPanel(!showFilterPanel)}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
								showFilterPanel || activeFiltersCount > 0
									? "bg-temu-50 border-temu-500 text-temu-600"
									: "border-gray-200 hover:border-gray-300"
							}`}
						>
							<SlidersHorizontal size={18} />
							<span className="font-medium">Filters</span>
							{activeFiltersCount > 0 && (
								<span className="bg-temu-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
									{activeFiltersCount}
								</span>
							)}
						</button>
					)}

					{/* Results Count */}
					<span className="text-sm text-gray-600">
						{filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? "product" : "products"}
					</span>
				</div>

				<div className="flex items-center gap-4">
					{/* Grid Size Toggle */}
					<div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded-lg p-1">
						<button
							onClick={() => setGridSize("small")}
							className={`p-2 rounded ${gridSize === "small" ? "bg-gray-100" : "hover:bg-gray-50"}`}
							title="Small grid"
						>
							<Grid3X3 size={18} />
						</button>
						<button
							onClick={() => setGridSize("large")}
							className={`p-2 rounded ${gridSize === "large" ? "bg-gray-100" : "hover:bg-gray-50"}`}
							title="Large grid"
						>
							<LayoutGrid size={18} />
						</button>
					</div>

					{/* Sort Dropdown */}
					<div className="relative">
						<button
							onClick={() => setShowSortDropdown(!showSortDropdown)}
							className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
						>
							<span className="text-sm font-medium">
								Sort: {sortOptions.find((o) => o.value === sortBy)?.label}
							</span>
							<ChevronDown size={16} className={`transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
						</button>

						{showSortDropdown && (
							<>
								<div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
								<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
									{sortOptions.map((option) => (
										<button
											key={option.value}
											onClick={() => {
												setSortBy(option.value);
												setShowSortDropdown(false);
											}}
											className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
												sortBy === option.value ? "bg-temu-50 text-temu-600 font-medium" : ""
											}`}
										>
											{option.label}
										</button>
									))}
								</div>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Filter Panel */}
			{showFilterPanel && showFilters && (
				<div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-gray-900">Filters</h3>
						{activeFiltersCount > 0 && (
							<button
								onClick={clearFilters}
								className="text-sm text-temu-600 hover:underline flex items-center gap-1"
							>
								<X size={14} />
								Clear all
							</button>
						)}
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{/* In Stock Filter */}
						<div>
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									checked={inStockOnly}
									onChange={(e) => setInStockOnly(e.target.checked)}
									className="w-4 h-4 text-temu-500 border-gray-300 rounded focus:ring-temu-500"
								/>
								<span className="text-sm font-medium">In Stock Only</span>
							</label>
						</div>

						{/* Price Range Filter */}
						<div className="sm:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
							<div className="flex items-center gap-2">
								<input
									type="number"
									placeholder="Min"
									value={priceRange.min || ""}
									onChange={(e) =>
										setPriceRange((prev) => ({
											...prev,
											min: Number(e.target.value) || 0,
										}))
									}
									className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-temu-500 focus:ring-1 focus:ring-temu-500"
								/>
								<span className="text-gray-400">-</span>
								<input
									type="number"
									placeholder="Max"
									value={priceRange.max === Infinity ? "" : priceRange.max}
									onChange={(e) =>
										setPriceRange((prev) => ({
											...prev,
											max: Number(e.target.value) || Infinity,
										}))
									}
									className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-temu-500 focus:ring-1 focus:ring-temu-500"
								/>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Product Grid */}
			{filteredAndSortedProducts.length > 0 ? (
				<div
					className={`grid gap-4 ${
						gridSize === "large"
							? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
							: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
					}`}
				>
					{filteredAndSortedProducts.map((product) => (
						<TemuProductCard key={product.id} product={product} channel={channel} />
					))}
				</div>
			) : (
				<div className="text-center py-16 bg-white rounded-lg border border-gray-200">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
						<SlidersHorizontal className="text-gray-400" size={32} />
					</div>
					<h3 className="text-xl font-bold text-gray-900 mb-2">No products match your filters</h3>
					<p className="text-gray-600 mb-4">Try adjusting your filters to find what you&apos;re looking for</p>
					<button
						onClick={clearFilters}
						className="px-6 py-2 bg-temu-500 text-white rounded-full font-medium hover:bg-temu-600 transition-colors"
					>
						Clear Filters
					</button>
				</div>
			)}
		</div>
	);
}
