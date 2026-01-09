"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "urql";
import { graphql } from "@/gql";

const CategoryListDocument = graphql(`
	query CategoryListForFilters($first: Int!) {
		categories(first: $first) {
			edges {
				node {
					id
					name
					slug
				}
			}
		}
	}
`);

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

export function ProductFilters() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isOpen, setIsOpen] = useState(true);

	// Fetch categories from backend
	const [{ data: categoryData }] = useQuery({
		query: CategoryListDocument,
		variables: { first: 50 },
	});

	// Parse current filters from URL
	const getFilterFromUrl = useCallback(
		(key: string): string[] => {
			const value = searchParams.get(key);
			return value ? value.split(",") : [];
		},
		[searchParams]
	);

	const getPriceFromUrl = useCallback((): [number, number] => {
		const minPrice = searchParams.get("minPrice");
		const maxPrice = searchParams.get("maxPrice");
		return [
			minPrice ? parseInt(minPrice) : 0,
			maxPrice ? parseInt(maxPrice) : 10000000,
		];
	}, [searchParams]);

	const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
		category: getFilterFromUrl("category"),
		rating: getFilterFromUrl("rating"),
	});
	const [priceRange, setPriceRange] = useState<[number, number]>(getPriceFromUrl());

	// Sync URL params when they change
	useEffect(() => {
		setSelectedFilters({
			category: getFilterFromUrl("category"),
			rating: getFilterFromUrl("rating"),
		});
		setPriceRange(getPriceFromUrl());
	}, [searchParams, getFilterFromUrl, getPriceFromUrl]);

	// Build category filter options from backend data
	const categoryOptions: FilterOption[] =
		categoryData?.categories?.edges?.map((edge) => ({
			id: edge.node.slug,
			label: edge.node.name,
		})) ?? [];

	const filterGroups: FilterGroup[] = [
		{
			id: "category",
			title: "Category",
			type: "checkbox",
			options: categoryOptions,
		},
		{
			id: "price",
			title: "Price Range (UGX)",
			type: "range",
			min: 0,
			max: 10000000,
		},
		{
			id: "rating",
			title: "Customer Rating",
			type: "checkbox",
			options: [
				{ id: "5", label: "5 Stars" },
				{ id: "4", label: "4+ Stars" },
				{ id: "3", label: "3+ Stars" },
			],
		},
	];

	const updateUrl = useCallback(
		(newFilters: Record<string, string[]>, newPriceRange: [number, number]) => {
			const params = new URLSearchParams();

			// Add filter params
			Object.entries(newFilters).forEach(([key, values]) => {
				if (values.length > 0) {
					params.set(key, values.join(","));
				}
			});

			// Add price params
			if (newPriceRange[0] > 0) {
				params.set("minPrice", newPriceRange[0].toString());
			}
			if (newPriceRange[1] < 10000000) {
				params.set("maxPrice", newPriceRange[1].toString());
			}

			const queryString = params.toString();
			router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
		},
		[router, pathname]
	);

	const toggleFilter = (groupId: string, optionId: string) => {
		setSelectedFilters((prev) => {
			const current = prev[groupId] || [];
			const isSelected = current.includes(optionId);
			const newFilters = {
				...prev,
				[groupId]: isSelected
					? current.filter((id) => id !== optionId)
					: [...current, optionId],
			};
			updateUrl(newFilters, priceRange);
			return newFilters;
		});
	};

	const handlePriceChange = (newRange: [number, number]) => {
		setPriceRange(newRange);
	};

	const applyPriceFilter = () => {
		updateUrl(selectedFilters, priceRange);
	};

	const clearFilters = () => {
		setSelectedFilters({});
		setPriceRange([0, 10000000]);
		router.push(pathname, { scroll: false });
	};

	const getActiveFilterCount = () => {
		const filterCount = Object.values(selectedFilters).reduce((sum, filters) => sum + filters.length, 0);
		const priceFiltered = priceRange[0] > 0 || priceRange[1] < 10000000 ? 1 : 0;
		return filterCount + priceFiltered;
	};

	return (
		<aside className="w-full">
			{/* Mobile Toggle */}
			<div className="mb-4 flex items-center justify-between lg:hidden">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 font-semibold text-neutral-700"
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
						<span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
							{getActiveFilterCount()}
						</span>
					)}
				</button>
			</div>

			{/* Filters Panel */}
			<div
				className={`rounded-lg border border-neutral-200 bg-white ${isOpen ? "block" : "hidden lg:block"}`}
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-neutral-200 p-4">
					<h3 className="font-semibold text-neutral-900">Filters</h3>
					{getActiveFilterCount() > 0 && (
						<button
							onClick={clearFilters}
							className="text-sm font-medium text-blue-600 hover:text-blue-700"
						>
							Clear All
						</button>
					)}
				</div>

				{/* Filter Groups */}
				<div className="divide-y divide-neutral-200">
					{filterGroups.map((group) => (
						<div key={group.id} className="p-4">
							<h4 className="mb-3 font-semibold text-neutral-900">{group.title}</h4>

							{/* Checkbox Filters */}
							{group.type === "checkbox" && group.options && (
								<div className="space-y-2 max-h-48 overflow-y-auto">
									{group.options.length === 0 ? (
										<p className="text-sm text-neutral-500">Loading...</p>
									) : (
										group.options.map((option) => (
											<label
												key={option.id}
												className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900"
											>
												<input
													type="checkbox"
													checked={selectedFilters[group.id]?.includes(option.id)}
													onChange={() => toggleFilter(group.id, option.id)}
													className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
												/>
												<span className="flex-1">{option.label}</span>
												{option.count !== undefined && (
													<span className="text-neutral-500">({option.count})</span>
												)}
											</label>
										))
									)}
								</div>
							)}

							{/* Price Range Filter */}
							{group.type === "range" && (
								<div className="space-y-3">
									<div className="flex items-center justify-between text-sm">
										<span className="text-neutral-600">
											UGX {priceRange[0].toLocaleString()}
										</span>
										<span className="text-neutral-600">
											UGX {priceRange[1].toLocaleString()}
										</span>
									</div>
									<input
										type="range"
										min={group.min}
										max={group.max}
										step={100000}
										value={priceRange[1]}
										onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
										className="w-full accent-blue-600"
									/>
									<div className="grid grid-cols-2 gap-2">
										<input
											type="number"
											value={priceRange[0]}
											onChange={(e) =>
												handlePriceChange([parseInt(e.target.value) || 0, priceRange[1]])
											}
											placeholder="Min"
											className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
										/>
										<input
											type="number"
											value={priceRange[1]}
											onChange={(e) =>
												handlePriceChange([priceRange[0], parseInt(e.target.value) || 10000000])
											}
											placeholder="Max"
											className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
										/>
									</div>
									<button
										onClick={applyPriceFilter}
										className="w-full rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200"
									>
										Apply Price
									</button>
								</div>
							)}
						</div>
					))}
				</div>

				{/* Apply Button (Mobile) */}
				<div className="border-t border-neutral-200 p-4 lg:hidden">
					<button
						onClick={() => setIsOpen(false)}
						className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
					>
						Apply Filters
					</button>
				</div>
			</div>

			{/* Active Filters Display */}
			{getActiveFilterCount() > 0 && (
				<div className="mt-4 rounded-lg border border-neutral-200 bg-white p-4">
					<div className="mb-2 flex items-center justify-between">
						<h4 className="text-sm font-semibold text-neutral-900">Active Filters</h4>
						<button
							onClick={clearFilters}
							className="text-xs font-medium text-blue-600 hover:text-blue-700"
						>
							Clear
						</button>
					</div>
					<div className="flex flex-wrap gap-2">
						{Object.entries(selectedFilters).flatMap(([groupId, optionIds]) =>
							optionIds.map((optionId) => {
								const group = filterGroups.find((g) => g.id === groupId);
								const option = group?.options?.find((o) => o.id === optionId);
								return (
									<span
										key={`${groupId}-${optionId}`}
										className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
									>
										{option?.label || optionId}
										<button
											onClick={() => toggleFilter(groupId, optionId)}
											className="ml-1 hover:text-blue-900"
										>
											×
										</button>
									</span>
								);
							})
						)}
						{(priceRange[0] > 0 || priceRange[1] < 10000000) && (
							<span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
								UGX {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
								<button
									onClick={() => {
										const newRange: [number, number] = [0, 10000000];
										setPriceRange(newRange);
										updateUrl(selectedFilters, newRange);
									}}
									className="ml-1 hover:text-blue-900"
								>
									×
								</button>
							</span>
						)}
					</div>
				</div>
			)}
		</aside>
	);
}
