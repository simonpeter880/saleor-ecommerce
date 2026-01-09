"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

interface FilterOption {
	id: string;
	label: string;
	count?: number;
}

interface FilterGroup {
	id: string;
	title: string;
	type: "checkbox" | "radio" | "range" | "color";
	options?: FilterOption[];
	min?: number;
	max?: number;
	colors?: string[];
}

interface FunctionalProductFiltersProps {
	categories?: Array<{ id: string; name: string; slug: string; products?: { totalCount: number } }>;
	priceRange?: { min: number; max: number };
	channel: string;
}

export function FunctionalProductFilters({
	categories = [],
	priceRange = { min: 0, max: 10000000 },
	channel,
}: FunctionalProductFiltersProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isOpen, setIsOpen] = useState(true);

	// Parse current filters from URL
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedPriceMin, setSelectedPriceMin] = useState(priceRange.min);
	const [selectedPriceMax, setSelectedPriceMax] = useState(priceRange.max);
	const [selectedSort, setSelectedSort] = useState(searchParams.get("sort") || "");

	useEffect(() => {
		// Initialize from URL params
		const categoryParam = searchParams.get("category");
		if (categoryParam) {
			setSelectedCategories(categoryParam.split(","));
		}

		const minPrice = searchParams.get("minPrice");
		const maxPrice = searchParams.get("maxPrice");
		if (minPrice) setSelectedPriceMin(parseInt(minPrice));
		if (maxPrice) setSelectedPriceMax(parseInt(maxPrice));
	}, [searchParams]);

	const applyFilters = () => {
		const params = new URLSearchParams(searchParams.toString());

		// Category filter
		if (selectedCategories.length > 0) {
			params.set("category", selectedCategories.join(","));
		} else {
			params.delete("category");
		}

		// Price filter
		if (selectedPriceMin > priceRange.min) {
			params.set("minPrice", selectedPriceMin.toString());
		} else {
			params.delete("minPrice");
		}

		if (selectedPriceMax < priceRange.max) {
			params.set("maxPrice", selectedPriceMax.toString());
		} else {
			params.delete("maxPrice");
		}

		// Sort
		if (selectedSort) {
			params.set("sort", selectedSort);
		} else {
			params.delete("sort");
		}

		// Navigate with new params
		router.push(`?${params.toString()}`);
		setIsOpen(false); // Close on mobile
	};

	const clearFilters = () => {
		setSelectedCategories([]);
		setSelectedPriceMin(priceRange.min);
		setSelectedPriceMax(priceRange.max);
		setSelectedSort("");
		router.push(window.location.pathname);
	};

	const toggleCategory = (categorySlug: string) => {
		setSelectedCategories((prev) =>
			prev.includes(categorySlug)
				? prev.filter((slug) => slug !== categorySlug)
				: [...prev, categorySlug],
		);
	};

	const getActiveFilterCount = () => {
		let count = 0;
		if (selectedCategories.length > 0) count += selectedCategories.length;
		if (selectedPriceMin > priceRange.min) count++;
		if (selectedPriceMax < priceRange.max) count++;
		return count;
	};

	const filterGroups: FilterGroup[] = [
		{
			id: "category",
			title: "Category",
			type: "checkbox",
			options: categories.map((cat) => ({
				id: cat.slug,
				label: cat.name,
				count: cat.products?.totalCount,
			})),
		},
		{
			id: "price",
			title: "Price Range (UGX)",
			type: "range",
			min: priceRange.min,
			max: priceRange.max,
		},
	];

	return (
		<aside className="w-full">
			{/* Mobile Toggle */}
			<div className="mb-4 flex items-center justify-between lg:hidden">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
				>
					<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
						/>
					</svg>
					Filters
					{getActiveFilterCount() > 0 && (
						<span className="rounded-full bg-temu-500 px-2 py-0.5 text-xs text-white font-bold">
							{getActiveFilterCount()}
						</span>
					)}
				</button>
			</div>

			{/* Filters Panel */}
			<div
				className={`rounded-xl border border-gray-200 bg-white shadow-sm ${isOpen ? "block" : "hidden lg:block"}`}
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-gray-200 p-4">
					<h3 className="font-bold text-gray-900">Filters</h3>
					{getActiveFilterCount() > 0 && (
						<button
							onClick={clearFilters}
							className="text-sm font-semibold text-temu-600 hover:text-temu-700"
						>
							Clear All
						</button>
					)}
				</div>

				{/* Filter Groups */}
				<div className="divide-y divide-gray-200">
					{filterGroups.map((group) => (
						<div key={group.id} className="p-4">
							<h4 className="mb-3 font-bold text-gray-900">{group.title}</h4>

							{/* Checkbox Filters */}
							{group.type === "checkbox" && group.options && (
								<div className="space-y-2">
									{group.options.map((option) => (
										<label
											key={option.id}
											className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
										>
											<input
												type="checkbox"
												checked={selectedCategories.includes(option.id)}
												onChange={() => toggleCategory(option.id)}
												className="h-4 w-4 rounded border-gray-300 text-temu-600 focus:ring-temu-500"
											/>
											<span className="flex-1">{option.label}</span>
											{option.count !== undefined && (
												<span className="text-gray-500">({option.count})</span>
											)}
										</label>
									))}
								</div>
							)}

							{/* Price Range Filter */}
							{group.type === "range" && (
								<div className="space-y-3">
									<div className="flex items-center justify-between text-sm">
										<span className="text-gray-600 font-semibold">
											UGX {selectedPriceMin.toLocaleString()}
										</span>
										<span className="text-gray-600 font-semibold">
											UGX {selectedPriceMax.toLocaleString()}
										</span>
									</div>
									<input
										type="range"
										min={group.min}
										max={group.max}
										value={selectedPriceMax}
										onChange={(e) => setSelectedPriceMax(parseInt(e.target.value))}
										className="w-full accent-temu-600"
									/>
									<div className="grid grid-cols-2 gap-2">
										<input
											type="number"
											value={selectedPriceMin}
											onChange={(e) => setSelectedPriceMin(parseInt(e.target.value) || group.min!)}
											placeholder="Min"
											className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-temu-500 focus:ring-2 focus:ring-temu-200 focus:outline-none"
										/>
										<input
											type="number"
											value={selectedPriceMax}
											onChange={(e) => setSelectedPriceMax(parseInt(e.target.value) || group.max!)}
											placeholder="Max"
											className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-temu-500 focus:ring-2 focus:ring-temu-200 focus:outline-none"
										/>
									</div>
								</div>
							)}
						</div>
					))}
				</div>

				{/* Apply Button */}
				<div className="border-t border-gray-200 p-4">
					<button
						onClick={applyFilters}
						className="w-full rounded-lg bg-gradient-to-r from-temu-500 to-temu-600 px-4 py-2.5 font-bold text-white transition hover:from-temu-600 hover:to-temu-700 shadow-md"
					>
						Apply Filters
					</button>
				</div>
			</div>

			{/* Active Filters Display */}
			{getActiveFilterCount() > 0 && (
				<div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
					<div className="mb-3 flex items-center justify-between">
						<h4 className="text-sm font-bold text-gray-900">Active Filters</h4>
						<button
							onClick={clearFilters}
							className="text-xs font-semibold text-temu-600 hover:text-temu-700"
						>
							Clear All
						</button>
					</div>
					<div className="flex flex-wrap gap-2">
						{selectedCategories.map((categorySlug) => {
							const category = categories.find((c) => c.slug === categorySlug);
							return (
								<span
									key={categorySlug}
									className="flex items-center gap-2 rounded-full bg-temu-100 px-3 py-1.5 text-sm font-semibold text-temu-700"
								>
									{category?.name || categorySlug}
									<button
										onClick={() => {
											toggleCategory(categorySlug);
											setTimeout(applyFilters, 100);
										}}
										className="hover:text-temu-900"
									>
										<X size={14} />
									</button>
								</span>
							);
						})}
						{selectedPriceMin > priceRange.min && (
							<span className="flex items-center gap-2 rounded-full bg-temu-100 px-3 py-1.5 text-sm font-semibold text-temu-700">
								Min: UGX {selectedPriceMin.toLocaleString()}
								<button
									onClick={() => {
										setSelectedPriceMin(priceRange.min);
										setTimeout(applyFilters, 100);
									}}
									className="hover:text-temu-900"
								>
									<X size={14} />
								</button>
							</span>
						)}
						{selectedPriceMax < priceRange.max && (
							<span className="flex items-center gap-2 rounded-full bg-temu-100 px-3 py-1.5 text-sm font-semibold text-temu-700">
								Max: UGX {selectedPriceMax.toLocaleString()}
								<button
									onClick={() => {
										setSelectedPriceMax(priceRange.max);
										setTimeout(applyFilters, 100);
									}}
									className="hover:text-temu-900"
								>
									<X size={14} />
								</button>
							</span>
						)}
					</div>
				</div>
			)}
		</aside>
	);
}
