"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
	theme: Theme;
	actualTheme: "light" | "dark";
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "techhub_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("system");
	const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");
	const [mounted, setMounted] = useState(false);

	// Get system preference
	const getSystemTheme = (): "light" | "dark" => {
		if (typeof window === "undefined") return "light";
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	};

	// Calculate actual theme based on preference
	const calculateActualTheme = (themePreference: Theme): "light" | "dark" => {
		if (themePreference === "system") {
			return getSystemTheme();
		}
		return themePreference;
	};

	// Load theme from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY) as Theme;
		const initialTheme = stored || "system";
		setThemeState(initialTheme);
		setActualTheme(calculateActualTheme(initialTheme));
		setMounted(true);
	}, []);

	// Listen for system theme changes
	useEffect(() => {
		if (typeof window === "undefined") return;

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = () => {
			if (theme === "system") {
				setActualTheme(getSystemTheme());
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme]);

	// Apply theme to document
	useEffect(() => {
		if (!mounted) return;

		const root = document.documentElement;

		if (actualTheme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
	}, [actualTheme, mounted]);

	const setTheme = (newTheme: Theme) => {
		setThemeState(newTheme);
		setActualTheme(calculateActualTheme(newTheme));
		localStorage.setItem(STORAGE_KEY, newTheme);
	};

	const toggleTheme = () => {
		const newTheme = actualTheme === "light" ? "dark" : "light";
		setTheme(newTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, actualTheme, setTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
