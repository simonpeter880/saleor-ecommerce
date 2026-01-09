"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, ArrowUpDown } from "lucide-react";

export type SortOption =
	| "featured"
	| "newest"
	| "price-asc"
	| "price-desc"
	| "name-asc"
	| "name-desc"
	| "rating"
	| "popular"
	| "discount";

interface SortConfig {
	value: SortOption;
	label: string;
	description: string;
}

const SORT_OPTIONS: SortConfig[] = [
	{
		value: "featured",
		label: "Featured",
		description: "Hand-picked products for you",
	},
	{
		value: "popular",
		label: "Most Popular",
		description: "Bestsellers and trending items",
	},
	{
		value: "newest",
		label: "Newest First",
		description: "Recently added products",
	},
	{
		value: "price-asc",
		label: "Price: Low to High",
		description: "Best budget options first",
	},
	{
		value: "price-desc",
		label: "Price: High to Low",
		description: "Premium products first",
	},
	{
		value: "rating",
		label: "Highest Rated",
		description: "Top reviewed products",
	},
	{
		value: "discount",
		label: "Biggest Discount",
		description: "Best deals and savings",
	},
	{
		value: "name-asc",
		label: "Name: A to Z",
		description: "Alphabetical order",
	},
	{
		value: "name-desc",
		label: "Name: Z to A",
		description: "Reverse alphabetical",
	},
];

interface AdvancedSortingProps {
	defaultSort?: SortOption;
	className?: string;
}

export function AdvancedSorting({
	defaultSort = "featured",
	className = "",
}: AdvancedSortingProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isOpen, setIsOpen] = useState(false);

	const currentSort = (searchParams.get("sort") as SortOption) || defaultSort;
	const currentConfig = SORT_OPTIONS.find((opt) => opt.value === currentSort) || SORT_OPTIONS[0];

	const handleSortChange = (sortValue: SortOption) => {
		const params = new URLSearchParams(searchParams.toString());

		if (sortValue === defaultSort) {
			params.delete("sort");
		} else {
			params.set("sort", sortValue);
		}

		router.push(`?${params.toString()}`);
		setIsOpen(false);
	};

	return (
		<div className={`relative ${className}`}>
			{/* Sort Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-temu-500 hover:bg-temu-50 transition-all font-medium text-gray-700"
			>
				<ArrowUpDown size={18} className="text-temu-600" />
				<span className="hidden sm:inline">Sort:</span>
				<span className="font-semibold">{currentConfig.label}</span>
				<ChevronDown
					size={18}
					className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 z-10"
						onClick={() => setIsOpen(false)}
					/>

					{/* Menu */}
					<div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
						{/* Header */}
						<div className="bg-gradient-to-r from-temu-500 to-temu-600 text-white px-4 py-3">
							<div className="flex items-center gap-2">
								<SlidersHorizontal size={18} />
								<h3 className="font-bold">Sort Products</h3>
							</div>
						</div>

						{/* Options */}
						<div className="max-h-96 overflow-y-auto">
							{SORT_OPTIONS.map((option) => (
								<button
									key={option.value}
									onClick={() => handleSortChange(option.value)}
									className={`w-full text-left px-4 py-3 hover:bg-temu-50 transition-colors border-b border-gray-100 last:border-b-0 ${
										currentSort === option.value
											? "bg-temu-50 border-l-4 border-l-temu-500"
											: ""
									}`}
								>
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<div className="font-semibold text-gray-900">
												{option.label}
											</div>
											<div className="text-xs text-gray-600 mt-0.5">
												{option.description}
											</div>
										</div>
										{currentSort === option.value && (
											<div className="ml-2 text-temu-600">
												<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
													<path
														fillRule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clipRule="evenodd"
													/>
												</svg>
											</div>
										)}
									</div>
								</button>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
}

/**
 * Mobile-Optimized Sort Sheet
 * Better UX for mobile devices
 */
export function MobileSortSheet({
	defaultSort = "featured",
	isOpen,
	onClose,
}: {
	defaultSort?: SortOption;
	isOpen: boolean;
	onClose: () => void;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentSort = (searchParams.get("sort") as SortOption) || defaultSort;

	const handleSortChange = (sortValue: SortOption) => {
		const params = new URLSearchParams(searchParams.toString());

		if (sortValue === defaultSort) {
			params.delete("sort");
		} else {
			params.set("sort", sortValue);
		}

		router.push(`?${params.toString()}`);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 md:hidden">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black bg-opacity-50"
				onClick={onClose}
			/>

			{/* Sheet */}
			<div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
				{/* Handle */}
				<div className="flex justify-center pt-3 pb-2">
					<div className="w-12 h-1 bg-gray-300 rounded-full" />
				</div>

				{/* Header */}
				<div className="px-6 py-4 border-b border-gray-200">
					<h3 className="text-lg font-bold text-gray-900">Sort Products</h3>
				</div>

				{/* Options */}
				<div className="max-h-[60vh] overflow-y-auto">
					{SORT_OPTIONS.map((option) => (
						<button
							key={option.value}
							onClick={() => handleSortChange(option.value)}
							className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
								currentSort === option.value ? "bg-temu-50" : ""
							}`}
						>
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<div className="font-semibold text-gray-900">
										{option.label}
									</div>
									<div className="text-sm text-gray-600 mt-1">
										{option.description}
									</div>
								</div>
								{currentSort === option.value && (
									<div className="ml-3 text-temu-600">
										<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								)}
							</div>
						</button>
					))}
				</div>

				{/* Close Button */}
				<div className="p-4 border-t border-gray-200">
					<button
						onClick={onClose}
						className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}

/**
 * Utility function to sort products based on selected option
 */
export function sortProducts<T extends Record<string, any>>(
	products: T[],
	sortOption: SortOption
): T[] {
	const sorted = [...products];

	switch (sortOption) {
		case "price-asc":
			return sorted.sort((a, b) => {
				const priceA = a.pricing?.priceRange?.start?.gross?.amount || 0;
				const priceB = b.pricing?.priceRange?.start?.gross?.amount || 0;
				return priceA - priceB;
			});

		case "price-desc":
			return sorted.sort((a, b) => {
				const priceA = a.pricing?.priceRange?.start?.gross?.amount || 0;
				const priceB = b.pricing?.priceRange?.start?.gross?.amount || 0;
				return priceB - priceA;
			});

		case "name-asc":
			return sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

		case "name-desc":
			return sorted.sort((a, b) => (b.name || "").localeCompare(a.name || ""));

		case "rating":
			return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));

		case "newest":
			return sorted.sort((a, b) => {
				const dateA = new Date(a.created || a.createdAt || 0).getTime();
				const dateB = new Date(b.created || b.createdAt || 0).getTime();
				return dateB - dateA;
			});

		case "popular":
			// Sort by sales or views (would need actual data)
			// For now, use a combination of rating and review count
			return sorted.sort((a, b) => {
				const scoreA = (a.rating || 0) * (a.reviewCount || 1);
				const scoreB = (b.rating || 0) * (b.reviewCount || 1);
				return scoreB - scoreA;
			});

		case "discount":
			// Sort by discount percentage
			return sorted.sort((a, b) => {
				const discountA = getDiscountPercentage(a);
				const discountB = getDiscountPercentage(b);
				return discountB - discountA;
			});

		case "featured":
		default:
			// Keep original order (featured products curated by admin)
			return sorted;
	}
}

/**
 * Helper function to calculate discount percentage
 */
function getDiscountPercentage(product: any): number {
	const originalPrice = product.pricing?.priceRange?.start?.undiscounted?.gross?.amount;
	const currentPrice = product.pricing?.priceRange?.start?.gross?.amount;

	if (!originalPrice || !currentPrice || originalPrice <= currentPrice) {
		return 0;
	}

	return ((originalPrice - currentPrice) / originalPrice) * 100;
}
