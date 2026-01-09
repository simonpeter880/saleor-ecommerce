"use client";

import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, Clock, X, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

interface SearchSuggestion {
	id: string;
	name: string;
	slug: string;
	thumbnail?: {
		url?: string;
		alt?: string;
	} | null;
	category?: {
		name: string;
		slug: string;
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
}

interface CategorySuggestion {
	id: string;
	name: string;
	slug: string;
}

interface LiveSearchBarProps {
	channel: string;
}

const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY_ITEMS = 5;

function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}

function getSearchHistory(): string[] {
	if (typeof window === "undefined") return [];
	try {
		const history = localStorage.getItem(SEARCH_HISTORY_KEY);
		return history ? (JSON.parse(history) as string[]) : [];
	} catch {
		return [];
	}
}

function saveSearchHistory(query: string): void {
	if (typeof window === "undefined") return;
	try {
		const history = getSearchHistory();
		const newHistory = [query, ...history.filter((h) => h !== query)].slice(0, MAX_HISTORY_ITEMS);
		localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
	} catch {
		// Ignore storage errors
	}
}

function clearSearchHistory(): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.removeItem(SEARCH_HISTORY_KEY);
	} catch {
		// Ignore storage errors
	}
}

function formatPrice(amount: number, currency: string): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount);
}

export function LiveSearchBar({ channel }: LiveSearchBarProps) {
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
	const [categories, setCategories] = useState<CategorySuggestion[]>([]);
	const [history, setHistory] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [isPending, startTransition] = useTransition();

	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const debouncedQuery = useDebounce(query, 300);

	// Load search history on mount
	useEffect(() => {
		setHistory(getSearchHistory());
	}, []);

	// Fetch suggestions when debounced query changes
	useEffect(() => {
		if (debouncedQuery.length < 2) {
			setSuggestions([]);
			setCategories([]);
			return;
		}

		const fetchSuggestions = async () => {
			setIsLoading(true);
			try {
				const response = await fetch("/api/search-suggestions", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ query: debouncedQuery, channel }),
				});

				if (response.ok) {
					const data = (await response.json()) as {
						products?: SearchSuggestion[];
						categories?: CategorySuggestion[];
					};
					setSuggestions(data.products || []);
					setCategories(data.categories || []);
				}
			} catch (error) {
				console.error("Failed to fetch suggestions:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchSuggestions();
	}, [debouncedQuery, channel]);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSearch = useCallback(
		(searchQuery: string) => {
			if (searchQuery.trim().length > 0) {
				saveSearchHistory(searchQuery.trim());
				setHistory(getSearchHistory());
				setIsOpen(false);
				startTransition(() => {
					router.push(
						`/${encodeURIComponent(channel)}/search?query=${encodeURIComponent(searchQuery.trim())}`,
					);
				});
			}
		},
		[channel, router],
	);

	const handleProductClick = useCallback(
		(product: SearchSuggestion) => {
			saveSearchHistory(product.name);
			setHistory(getSearchHistory());
			setIsOpen(false);
			startTransition(() => {
				router.push(`/${encodeURIComponent(channel)}/products/${product.slug}`);
			});
		},
		[channel, router],
	);

	const handleCategoryClick = useCallback(
		(category: CategorySuggestion) => {
			setIsOpen(false);
			startTransition(() => {
				router.push(`/${encodeURIComponent(channel)}/categories/${category.slug}`);
			});
		},
		[channel, router],
	);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		const totalItems = suggestions.length + categories.length + (query.length >= 2 ? 1 : 0);

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
				break;
			case "ArrowUp":
				e.preventDefault();
				setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
				break;
			case "Enter":
				e.preventDefault();
				if (selectedIndex === -1 || selectedIndex === 0) {
					handleSearch(query);
				} else if (selectedIndex <= suggestions.length) {
					handleProductClick(suggestions[selectedIndex - 1]);
				} else {
					handleCategoryClick(categories[selectedIndex - suggestions.length - 1]);
				}
				break;
			case "Escape":
				setIsOpen(false);
				inputRef.current?.blur();
				break;
		}
	};

	const handleClearHistory = () => {
		clearSearchHistory();
		setHistory([]);
	};

	const showDropdown = isOpen && (query.length >= 2 || history.length > 0);
	const hasResults = suggestions.length > 0 || categories.length > 0;

	return (
		<div ref={containerRef} className="relative w-full lg:w-80">
			<div className="group relative flex items-center">
				<label className="w-full">
					<span className="sr-only">search for products</span>
					<input
						ref={inputRef}
						type="text"
						value={query}
						onChange={(e) => {
							setQuery(e.target.value);
							setSelectedIndex(-1);
						}}
						onFocus={() => setIsOpen(true)}
						onKeyDown={handleKeyDown}
						placeholder="Search for products..."
						autoComplete="off"
						className="h-10 w-full rounded-md border border-neutral-300 bg-white px-4 py-2 pr-10 text-sm text-black placeholder:text-neutral-500 focus:border-black focus:ring-black"
					/>
				</label>
				<div className="absolute inset-y-0 right-0">
					{isLoading || isPending ? (
						<div className="inline-flex aspect-square w-10 items-center justify-center">
							<Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
						</div>
					) : query.length > 0 ? (
						<button
							type="button"
							onClick={() => {
								setQuery("");
								inputRef.current?.focus();
							}}
							className="inline-flex aspect-square w-10 items-center justify-center text-neutral-500 hover:text-neutral-700"
						>
							<X className="h-4 w-4" />
						</button>
					) : (
						<button
							type="button"
							onClick={() => handleSearch(query)}
							className="inline-flex aspect-square w-10 items-center justify-center text-neutral-500 hover:text-neutral-700"
						>
							<SearchIcon className="h-5 w-5" />
						</button>
					)}
				</div>
			</div>

			{/* Dropdown */}
			{showDropdown && (
				<div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[70vh] overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
					{/* Search for query */}
					{query.length >= 2 && (
						<button
							onClick={() => handleSearch(query)}
							className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 ${
								selectedIndex === 0 ? "bg-neutral-50" : ""
							}`}
						>
							<SearchIcon className="h-4 w-4 text-neutral-400" />
							<span className="flex-1 text-sm">
								Search for &quot;<span className="font-medium">{query}</span>&quot;
							</span>
							<ArrowRight className="h-4 w-4 text-neutral-400" />
						</button>
					)}

					{/* Loading state */}
					{isLoading && query.length >= 2 && (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
						</div>
					)}

					{/* Product suggestions */}
					{!isLoading && suggestions.length > 0 && (
						<div className="border-t border-neutral-100">
							<div className="px-4 py-2 text-xs font-medium uppercase text-neutral-500">Products</div>
							{suggestions.map((product, index) => (
								<button
									key={product.id}
									onClick={() => handleProductClick(product)}
									className={`flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-neutral-50 ${
										selectedIndex === index + 1 ? "bg-neutral-50" : ""
									}`}
								>
									{product.thumbnail?.url ? (
										<Image
											src={product.thumbnail.url}
											alt={product.thumbnail.alt || product.name}
											width={40}
											height={40}
											className="h-10 w-10 rounded object-cover"
										/>
									) : (
										<div className="flex h-10 w-10 items-center justify-center rounded bg-neutral-100">
											<SearchIcon className="h-4 w-4 text-neutral-400" />
										</div>
									)}
									<div className="min-w-0 flex-1">
										<div className="truncate text-sm font-medium text-neutral-900">{product.name}</div>
										{product.category && (
											<div className="truncate text-xs text-neutral-500">{product.category.name}</div>
										)}
									</div>
									{product.pricing?.priceRange?.start?.gross && (
										<div className="text-sm font-medium text-temu-600">
											{formatPrice(
												product.pricing.priceRange.start.gross.amount,
												product.pricing.priceRange.start.gross.currency,
											)}
										</div>
									)}
								</button>
							))}
						</div>
					)}

					{/* Category suggestions */}
					{!isLoading && categories.length > 0 && (
						<div className="border-t border-neutral-100">
							<div className="px-4 py-2 text-xs font-medium uppercase text-neutral-500">Categories</div>
							{categories.map((category, index) => (
								<button
									key={category.id}
									onClick={() => handleCategoryClick(category)}
									className={`flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-neutral-50 ${
										selectedIndex === suggestions.length + index + 1 ? "bg-neutral-50" : ""
									}`}
								>
									<TrendingUp className="h-4 w-4 text-neutral-400" />
									<span className="text-sm">{category.name}</span>
								</button>
							))}
						</div>
					)}

					{/* No results */}
					{!isLoading && query.length >= 2 && !hasResults && (
						<div className="px-4 py-6 text-center text-sm text-neutral-500">
							No products found for &quot;{query}&quot;
						</div>
					)}

					{/* Search history */}
					{query.length < 2 && history.length > 0 && (
						<div>
							<div className="flex items-center justify-between px-4 py-2">
								<span className="text-xs font-medium uppercase text-neutral-500">Recent Searches</span>
								<button
									onClick={handleClearHistory}
									className="text-xs text-neutral-400 hover:text-neutral-600"
								>
									Clear
								</button>
							</div>
							{history.map((item, index) => (
								<button
									key={index}
									onClick={() => {
										setQuery(item);
										handleSearch(item);
									}}
									className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-neutral-50"
								>
									<Clock className="h-4 w-4 text-neutral-400" />
									<span className="text-sm">{item}</span>
								</button>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
