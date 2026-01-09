"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X, Check, Star, Grid, List, Package } from "lucide-react";
import { PriceRangeSlider } from "./PriceRangeSlider";

interface Category {
	id: string;
	name: string;
	slug: string;
}

interface SearchFiltersProps {
	categories: Category[];
	selectedCategories: string[];
	minPrice?: number;
	maxPrice?: number;
	currentSort: string;
	searchQuery: string;
	minRating?: number;
	inStockOnly?: boolean;
	viewMode?: "grid" | "list";
	onViewModeChange?: (mode: "grid" | "list") => void;
}

const sortOptions = [
	{ value: "relevance", label: "Relevance" },
	{ value: "price-low", label: "Price: Low to High" },
	{ value: "price-high", label: "Price: High to Low" },
	{ value: "name-asc", label: "Name: A to Z" },
	{ value: "name-desc", label: "Name: Z to A" },
	{ value: "rating", label: "Highest Rated" },
	{ value: "newest", label: "Newest First" },
];

const ratingOptions = [
	{ value: 4, label: "4★ & up" },
	{ value: 3, label: "3★ & up" },
	{ value: 2, label: "2★ & up" },
	{ value: 1, label: "1★ & up" },
];

export function SearchFilters({
	categories,
	selectedCategories,
	minPrice,
	maxPrice,
	currentSort,
	searchQuery,
	minRating,
	inStockOnly,
	viewMode = "grid",
	onViewModeChange,
}: SearchFiltersProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [showFilters, setShowFilters] = useState(false);
	const [showSortDropdown, setShowSortDropdown] = useState(false);
	const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
	const [showRatingDropdown, setShowRatingDropdown] = useState(false);
	const [localMinPrice, setLocalMinPrice] = useState(minPrice?.toString() || "");
	const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice?.toString() || "");

	const buildUrl = useCallback(
		(updates: Record<string, string | string[] | undefined>) => {
			const params = new URLSearchParams(searchParams.toString());

			// Remove pagination when filters change
			params.delete("cursor");
			params.delete("direction");

			Object.entries(updates).forEach(([key, value]) => {
				params.delete(key);
				if (value !== undefined) {
					if (Array.isArray(value)) {
						value.forEach((v) => params.append(key, v));
					} else if (value !== "") {
						params.set(key, value);
					}
				}
			});

			return `?${params.toString()}`;
		},
		[searchParams],
	);

	const handleSortChange = (sort: string) => {
		const url = buildUrl({ sort: sort === "relevance" ? undefined : sort });
		router.push(url);
		setShowSortDropdown(false);
	};

	const handleCategoryToggle = (categoryId: string) => {
		const newCategories = selectedCategories.includes(categoryId)
			? selectedCategories.filter((id) => id !== categoryId)
			: [...selectedCategories, categoryId];

		const url = buildUrl({
			categories: newCategories.length > 0 ? newCategories : undefined,
		});
		router.push(url);
	};

	const handlePriceApply = () => {
		const url = buildUrl({
			minPrice: localMinPrice || undefined,
			maxPrice: localMaxPrice || undefined,
		});
		router.push(url);
	};

	const handleRatingChange = (rating: number | undefined) => {
		const url = buildUrl({
			minRating: rating?.toString(),
		});
		router.push(url);
		setShowRatingDropdown(false);
	};

	const handleInStockToggle = () => {
		const url = buildUrl({
			inStock: inStockOnly ? undefined : "true",
		});
		router.push(url);
	};

	const handleClearFilters = () => {
		const url = buildUrl({
			categories: undefined,
			minPrice: undefined,
			maxPrice: undefined,
			sort: undefined,
			minRating: undefined,
			inStock: undefined,
		});
		setLocalMinPrice("");
		setLocalMaxPrice("");
		router.push(url);
	};

	const activeFiltersCount =
		selectedCategories.length +
		(minPrice !== undefined ? 1 : 0) +
		(maxPrice !== undefined ? 1 : 0) +
		(minRating !== undefined ? 1 : 0) +
		(inStockOnly ? 1 : 0);

	return (
		<div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-3">
					{/* Filter Toggle Button */}
					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
							showFilters || activeFiltersCount > 0
								? "border-temu-500 bg-temu-50 text-temu-600"
								: "border-gray-200 hover:border-gray-300"
						}`}
					>
						<SlidersHorizontal size={18} />
						<span className="font-medium">Filters</span>
						{activeFiltersCount > 0 && (
							<span className="rounded-full bg-temu-500 px-2 py-0.5 text-xs font-bold text-white">
								{activeFiltersCount}
							</span>
						)}
					</button>

					{/* Category Dropdown */}
					<div className="relative">
						<button
							onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
							className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
								selectedCategories.length > 0
									? "border-temu-500 bg-temu-50 text-temu-600"
									: "border-gray-200 hover:border-gray-300"
							}`}
						>
							<span className="text-sm font-medium">
								{selectedCategories.length > 0
									? `Categories (${selectedCategories.length})`
									: "All Categories"}
							</span>
							<ChevronDown
								size={16}
								className={`transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`}
							/>
						</button>

						{showCategoryDropdown && (
							<>
								<div className="fixed inset-0 z-10" onClick={() => setShowCategoryDropdown(false)} />
								<div className="absolute left-0 z-20 mt-2 max-h-80 w-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
									{categories.length > 0 ? (
										categories.map((category) => (
											<button
												key={category.id}
												onClick={() => handleCategoryToggle(category.id)}
												className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-gray-50"
											>
												<span>{category.name}</span>
												{selectedCategories.includes(category.id) && (
													<Check size={16} className="text-temu-500" />
												)}
											</button>
										))
									) : (
										<div className="px-4 py-3 text-sm text-gray-500">No categories available</div>
									)}
								</div>
							</>
						)}
					</div>

					{/* Rating Dropdown */}
					<div className="relative">
						<button
							onClick={() => setShowRatingDropdown(!showRatingDropdown)}
							className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
								minRating !== undefined
									? "border-temu-500 bg-temu-50 text-temu-600"
									: "border-gray-200 hover:border-gray-300"
							}`}
						>
							<Star size={16} className={minRating ? "fill-yellow-400 text-yellow-400" : ""} />
							<span className="text-sm font-medium">
								{minRating !== undefined ? `${minRating}★ & up` : "Rating"}
							</span>
							<ChevronDown
								size={16}
								className={`transition-transform ${showRatingDropdown ? "rotate-180" : ""}`}
							/>
						</button>

						{showRatingDropdown && (
							<>
								<div className="fixed inset-0 z-10" onClick={() => setShowRatingDropdown(false)} />
								<div className="absolute left-0 z-20 mt-2 w-36 rounded-lg border border-gray-200 bg-white shadow-lg">
									<button
										onClick={() => handleRatingChange(undefined)}
										className={`w-full px-4 py-2 text-left text-sm first:rounded-t-lg hover:bg-gray-50 ${
											minRating === undefined ? "bg-temu-50 font-medium text-temu-600" : ""
										}`}
									>
										Any Rating
									</button>
									{ratingOptions.map((option) => (
										<button
											key={option.value}
											onClick={() => handleRatingChange(option.value)}
											className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm last:rounded-b-lg hover:bg-gray-50 ${
												minRating === option.value ? "bg-temu-50 font-medium text-temu-600" : ""
											}`}
										>
											<Star size={14} className="fill-yellow-400 text-yellow-400" />
											{option.label}
										</button>
									))}
								</div>
							</>
						)}
					</div>

					{/* In Stock Toggle */}
					<button
						onClick={handleInStockToggle}
						className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
							inStockOnly
								? "border-green-500 bg-green-50 text-green-600"
								: "border-gray-200 hover:border-gray-300"
						}`}
					>
						<Package size={16} />
						<span className="text-sm font-medium">In Stock</span>
						{inStockOnly && <Check size={14} />}
					</button>

					{/* Clear Filters */}
					{activeFiltersCount > 0 && (
						<button
							onClick={handleClearFilters}
							className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
						>
							<X size={14} />
							Clear all
						</button>
					)}
				</div>

				{/* View Mode Toggle & Sort */}
				<div className="flex items-center gap-3">
					{/* View Mode */}
					{onViewModeChange && (
						<div className="flex items-center rounded-lg border border-gray-200 p-1">
							<button
								onClick={() => onViewModeChange("grid")}
								className={`p-1.5 rounded transition-colors ${
									viewMode === "grid" ? "bg-temu-500 text-white" : "text-gray-500 hover:text-gray-700"
								}`}
								title="Grid view"
							>
								<Grid size={18} />
							</button>
							<button
								onClick={() => onViewModeChange("list")}
								className={`p-1.5 rounded transition-colors ${
									viewMode === "list" ? "bg-temu-500 text-white" : "text-gray-500 hover:text-gray-700"
								}`}
								title="List view"
							>
								<List size={18} />
							</button>
						</div>
					)}

						{/* Sort Dropdown */}
					<div className="relative">
						<button
							onClick={() => setShowSortDropdown(!showSortDropdown)}
							className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 transition-colors hover:border-gray-300"
						>
							<span className="text-sm font-medium">
								Sort: {sortOptions.find((o) => o.value === currentSort)?.label || "Relevance"}
							</span>
							<ChevronDown
								size={16}
								className={`transition-transform ${showSortDropdown ? "rotate-180" : ""}`}
							/>
						</button>

						{showSortDropdown && (
							<>
								<div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
								<div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
									{sortOptions.map((option) => (
										<button
											key={option.value}
											onClick={() => handleSortChange(option.value)}
											className={`w-full px-4 py-2 text-left text-sm first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 ${
												currentSort === option.value ? "bg-temu-50 font-medium text-temu-600" : ""
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

			{/* Expanded Filters Panel */}
			{showFilters && (
				<div className="mt-4 border-t border-gray-200 pt-4">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{/* Price Range Filter with Slider */}
						<div className="sm:col-span-2">
							<label className="mb-3 block text-sm font-bold text-gray-900 dark:text-gray-100">Price Range</label>
							<PriceRangeSlider
								min={0}
								max={50000}
								value={[
									localMinPrice ? parseInt(localMinPrice, 10) : 0,
									localMaxPrice ? parseInt(localMaxPrice, 10) : 50000,
								]}
								onChange={(value) => {
									setLocalMinPrice(value[0] > 0 ? value[0].toString() : "");
									setLocalMaxPrice(value[1] < 50000 ? value[1].toString() : "");
								}}
								step={100}
								currency="PLN "
							/>
							<div className="mt-3 flex items-center gap-2">
								<input
									type="number"
									placeholder="Min"
									value={localMinPrice}
									onChange={(e) => setLocalMinPrice(e.target.value)}
									className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-temu-500 focus:ring-1 focus:ring-temu-500"
								/>
								<span className="text-gray-400">-</span>
								<input
									type="number"
									placeholder="Max"
									value={localMaxPrice}
									onChange={(e) => setLocalMaxPrice(e.target.value)}
									className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-temu-500 focus:ring-1 focus:ring-temu-500"
								/>
								<button
									onClick={handlePriceApply}
									className="whitespace-nowrap rounded-lg bg-temu-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-temu-600"
								>
									Apply
								</button>
							</div>
						</div>

						{/* Selected Categories Display */}
						{selectedCategories.length > 0 && (
							<div className="sm:col-span-2">
								<label className="mb-2 block text-sm font-medium text-gray-700">Selected Categories</label>
								<div className="flex flex-wrap gap-2">
									{selectedCategories.map((categoryId) => {
										const category = categories.find((c) => c.id === categoryId);
										if (!category) return null;
										return (
											<span
												key={categoryId}
												className="inline-flex items-center gap-1 rounded-full bg-temu-50 px-3 py-1 text-sm text-temu-700"
											>
												{category.name}
												<button
													onClick={() => handleCategoryToggle(categoryId)}
													className="hover:text-temu-900"
												>
													<X size={14} />
												</button>
											</span>
										);
									})}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
