"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, TrendingUp, X, ArrowRight, Loader2 } from "lucide-react";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";

interface SearchResult {
	id: string;
	name: string;
	slug: string;
	thumbnail?: string;
	price?: number;
	currency?: string;
	category?: string;
}

interface SearchAutocompleteProps {
	channel: string;
	initialQuery?: string;
	placeholder?: string;
	className?: string;
}

// Popular/trending searches (could be fetched from analytics in production)
const TRENDING_SEARCHES = [
	"iPhone 15",
	"Samsung Galaxy",
	"Wireless Earbuds",
	"Gaming Laptop",
	"Smart Watch",
	"MacBook Pro",
	"PlayStation 5",
	"4K TV",
];

export function SearchAutocomplete({
	channel,
	initialQuery = "",
	placeholder = "Search electronics...",
	className = "",
}: SearchAutocompleteProps) {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const [query, setQuery] = useState(initialQuery);
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [results, setResults] = useState<SearchResult[]>([]);
	const [activeIndex, setActiveIndex] = useState(-1);

	const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();

	// Debounced search
	useEffect(() => {
		if (query.length < 2) {
			setResults([]);
			return;
		}

		const timer = setTimeout(async () => {
			setIsLoading(true);
			try {
				const response = await fetch(
					`/api/search-suggestions?q=${encodeURIComponent(query)}&channel=${channel}`
				);
				if (response.ok) {
					const data = await response.json();
					setResults(data.products || []);
				}
			} catch (error) {
				console.error("Search error:", error);
			} finally {
				setIsLoading(false);
			}
		}, 300);

		return () => clearTimeout(timer);
	}, [query, channel]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				inputRef.current &&
				!inputRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSearch = useCallback(
		(searchQuery: string) => {
			const trimmed = searchQuery.trim();
			if (!trimmed) return;

			addToHistory(trimmed);
			setIsOpen(false);
			router.push(`/${channel}/search?query=${encodeURIComponent(trimmed)}`);
		},
		[channel, router, addToHistory]
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleSearch(query);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		const items = getDropdownItems();
		const totalItems = items.length;

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setActiveIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
				break;
			case "ArrowUp":
				e.preventDefault();
				setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
				break;
			case "Enter":
				e.preventDefault();
				if (activeIndex >= 0 && items[activeIndex]) {
					if (items[activeIndex].type === "product") {
						router.push(`/${channel}/products/${items[activeIndex].slug}`);
					} else {
						handleSearch(items[activeIndex].text);
					}
				} else {
					handleSearch(query);
				}
				break;
			case "Escape":
				setIsOpen(false);
				inputRef.current?.blur();
				break;
		}
	};

	const getDropdownItems = () => {
		const items: Array<{
			type: "history" | "trending" | "product" | "suggestion";
			text: string;
			slug?: string;
			data?: SearchResult;
		}> = [];

		// If there's a query, show results
		if (query.length >= 2) {
			// Product results
			results.forEach((product) => {
				items.push({
					type: "product",
					text: product.name,
					slug: product.slug,
					data: product,
				});
			});

			// Add "search for" suggestion
			if (query.trim()) {
				items.push({
					type: "suggestion",
					text: query.trim(),
				});
			}
		} else {
			// Show history first
			history.slice(0, 5).forEach((item) => {
				items.push({
					type: "history",
					text: item.query,
				});
			});

			// Then trending
			TRENDING_SEARCHES.slice(0, 5).forEach((term) => {
				if (!history.some((h) => h.query.toLowerCase() === term.toLowerCase())) {
					items.push({
						type: "trending",
						text: term,
					});
				}
			});
		}

		return items.slice(0, 10);
	};

	const dropdownItems = getDropdownItems();
	const showDropdown = isOpen && (dropdownItems.length > 0 || isLoading);

	return (
		<div className={`relative ${className}`}>
			<form onSubmit={handleSubmit} className="relative">
				<input
					ref={inputRef}
					type="text"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setActiveIndex(-1);
					}}
					onFocus={() => setIsOpen(true)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					className="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2 sm:py-3 border-2 border-gray-200 rounded-full focus:border-temu-500 focus:outline-none text-sm"
					autoComplete="off"
				/>
				<button
					type="submit"
					className="absolute right-1 top-1 bottom-1 px-3 sm:px-6 bg-temu-500 text-white rounded-full hover:bg-temu-600 transition-colors"
				>
					{isLoading ? (
						<Loader2 size={16} className="animate-spin sm:w-[18px] sm:h-[18px]" />
					) : (
						<Search size={16} className="sm:w-[18px] sm:h-[18px]" />
					)}
				</button>
			</form>

			{/* Dropdown */}
			{showDropdown && (
				<div
					ref={dropdownRef}
					className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
				>
					{/* Loading state */}
					{isLoading && query.length >= 2 && (
						<div className="p-4 text-center text-gray-500">
							<Loader2 className="animate-spin mx-auto mb-2" size={24} />
							<p className="text-sm">Searching...</p>
						</div>
					)}

					{/* Results */}
					{!isLoading && dropdownItems.length > 0 && (
						<>
							{/* History Section */}
							{query.length < 2 && history.length > 0 && (
								<div className="border-b border-gray-100">
									<div className="flex items-center justify-between px-4 py-2 bg-gray-50">
										<span className="text-xs font-medium text-gray-500 uppercase">
											Recent Searches
										</span>
										<button
											onClick={(e) => {
												e.preventDefault();
												clearHistory();
											}}
											className="text-xs text-gray-400 hover:text-gray-600"
										>
											Clear all
										</button>
									</div>
									{dropdownItems
										.filter((item) => item.type === "history")
										.map((item, index) => (
											<div
												key={`history-${item.text}`}
												className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
													activeIndex === index ? "bg-temu-50" : "hover:bg-gray-50"
												}`}
												onClick={() => handleSearch(item.text)}
											>
												<div className="flex items-center gap-3">
													<Clock size={16} className="text-gray-400" />
													<span className="text-sm">{item.text}</span>
												</div>
												<button
													onClick={(e) => {
														e.stopPropagation();
														removeFromHistory(item.text);
													}}
													className="p-1 hover:bg-gray-200 rounded-full"
												>
													<X size={14} className="text-gray-400" />
												</button>
											</div>
										))}
								</div>
							)}

							{/* Trending Section */}
							{query.length < 2 &&
								dropdownItems.some((item) => item.type === "trending") && (
									<div className="border-b border-gray-100">
										<div className="px-4 py-2 bg-gray-50">
											<span className="text-xs font-medium text-gray-500 uppercase">
												Trending Searches
											</span>
										</div>
										{dropdownItems
											.filter((item) => item.type === "trending")
											.map((item, index) => {
												const itemIndex =
													dropdownItems.filter((i) => i.type === "history").length +
													dropdownItems
														.filter((i) => i.type === "trending")
														.indexOf(item);
												return (
													<div
														key={`trending-${item.text}`}
														className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
															activeIndex === itemIndex ? "bg-temu-50" : "hover:bg-gray-50"
														}`}
														onClick={() => handleSearch(item.text)}
													>
														<TrendingUp size={16} className="text-temu-500" />
														<span className="text-sm">{item.text}</span>
													</div>
												);
											})}
									</div>
								)}

							{/* Product Results */}
							{query.length >= 2 && results.length > 0 && (
								<div>
									<div className="px-4 py-2 bg-gray-50">
										<span className="text-xs font-medium text-gray-500 uppercase">
											Products
										</span>
									</div>
									{dropdownItems
										.filter((item) => item.type === "product")
										.map((item, index) => (
											<div
												key={`product-${item.data?.id}`}
												className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
													activeIndex === index ? "bg-temu-50" : "hover:bg-gray-50"
												}`}
												onClick={() =>
													router.push(`/${channel}/products/${item.slug}`)
												}
											>
												{item.data?.thumbnail ? (
													<ProductImageWrapper
														src={item.data.thumbnail}
														alt={item.text}
														width={40}
														height={40}
														className="w-10 h-10 object-cover rounded-lg"
													/>
												) : (
													<div className="w-10 h-10 bg-gray-100 rounded-lg" />
												)}
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 truncate">
														{item.text}
													</p>
													{item.data?.category && (
														<p className="text-xs text-gray-500">{item.data.category}</p>
													)}
												</div>
												{item.data?.price && (
													<span className="text-sm font-bold text-secondary-500">
														{item.data.currency} {item.data.price.toLocaleString()}
													</span>
												)}
											</div>
										))}
								</div>
							)}

							{/* Search suggestion */}
							{query.length >= 2 && (
								<div
									className={`flex items-center gap-3 px-4 py-3 border-t border-gray-100 cursor-pointer transition-colors ${
										activeIndex === dropdownItems.length - 1
											? "bg-temu-50"
											: "hover:bg-gray-50"
									}`}
									onClick={() => handleSearch(query)}
								>
									<Search size={16} className="text-temu-500" />
									<span className="text-sm">
										Search for "<strong>{query}</strong>"
									</span>
									<ArrowRight size={16} className="text-gray-400 ml-auto" />
								</div>
							)}
						</>
					)}

					{/* No results */}
					{!isLoading && query.length >= 2 && results.length === 0 && (
						<div className="p-6 text-center">
							<Search size={32} className="mx-auto mb-2 text-gray-300" />
							<p className="text-sm text-gray-500">No products found for "{query}"</p>
							<p className="text-xs text-gray-400 mt-1">
								Press Enter to search anyway
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
