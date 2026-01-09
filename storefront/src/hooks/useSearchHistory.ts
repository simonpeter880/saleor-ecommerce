"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "techhub_search_history";
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
	query: string;
	timestamp: number;
}

export function useSearchHistory() {
	const [history, setHistory] = useState<SearchHistoryItem[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	// Load from localStorage on mount
	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored) as SearchHistoryItem[];
				// Filter out old entries (older than 30 days)
				const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
				const filtered = parsed.filter((item) => item.timestamp > thirtyDaysAgo);
				setHistory(filtered);
			}
		} catch (error) {
			console.error("Failed to load search history:", error);
		}
		setIsLoaded(true);
	}, []);

	// Save to localStorage when history changes
	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
		}
	}, [history, isLoaded]);

	const addToHistory = useCallback((query: string) => {
		const trimmedQuery = query.trim().toLowerCase();
		if (!trimmedQuery || trimmedQuery.length < 2) return;

		setHistory((prev) => {
			// Remove duplicate if exists
			const filtered = prev.filter(
				(item) => item.query.toLowerCase() !== trimmedQuery
			);
			// Add new entry at the beginning
			const newHistory = [
				{ query: trimmedQuery, timestamp: Date.now() },
				...filtered,
			].slice(0, MAX_HISTORY_ITEMS);
			return newHistory;
		});
	}, []);

	const removeFromHistory = useCallback((query: string) => {
		setHistory((prev) =>
			prev.filter((item) => item.query.toLowerCase() !== query.toLowerCase())
		);
	}, []);

	const clearHistory = useCallback(() => {
		setHistory([]);
	}, []);

	return {
		history,
		isLoaded,
		addToHistory,
		removeFromHistory,
		clearHistory,
	};
}
