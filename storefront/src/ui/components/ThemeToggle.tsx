"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";

interface ThemeToggleProps {
	showLabel?: boolean;
	variant?: "icon" | "dropdown";
}

export function ThemeToggle({ showLabel = false, variant = "icon" }: ThemeToggleProps) {
	const [mounted, setMounted] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);

	// Only access theme context after component mounts on client
	useEffect(() => {
		setMounted(true);
	}, []);

	// Return placeholder during SSR/hydration to prevent context errors
	if (!mounted) {
		return (
			<div className="rounded-lg p-2 w-10 h-10" aria-hidden="true">
				{/* Placeholder to prevent layout shift */}
			</div>
		);
	}

	return <ThemeToggleClient showLabel={showLabel} variant={variant} />;
}

function ThemeToggleClient({ showLabel = false, variant = "icon" }: ThemeToggleProps) {
	const [showDropdown, setShowDropdown] = useState(false);
	const { theme, actualTheme, setTheme } = useTheme();

	if (variant === "icon") {
		return (
			<button
				onClick={() => setTheme(actualTheme === "light" ? "dark" : "light")}
				className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
				title={`Switch to ${actualTheme === "light" ? "dark" : "light"} mode`}
				aria-label="Toggle theme"
			>
				{actualTheme === "light" ? (
					<Moon size={20} className="text-gray-700 dark:text-gray-300" />
				) : (
					<Sun size={20} className="text-gray-700 dark:text-gray-300" />
				)}
				{showLabel && (
					<span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
						{actualTheme === "light" ? "Dark" : "Light"} Mode
					</span>
				)}
			</button>
		);
	}

	// Dropdown variant with system option
	const themeOptions = [
		{ value: "light" as const, label: "Light", icon: Sun },
		{ value: "dark" as const, label: "Dark", icon: Moon },
		{ value: "system" as const, label: "System", icon: Monitor },
	];

	const currentIcon =
		theme === "system" ? Monitor : actualTheme === "light" ? Sun : Moon;
	const CurrentIcon = currentIcon;

	return (
		<div className="relative">
			<button
				onClick={() => setShowDropdown(!showDropdown)}
				className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
				aria-label="Theme settings"
			>
				<CurrentIcon size={18} className="text-gray-700 dark:text-gray-300" />
				{showLabel && (
					<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
						{themeOptions.find((o) => o.value === theme)?.label}
					</span>
				)}
			</button>

			{showDropdown && (
				<>
					{/* Backdrop */}
					<div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />

					{/* Dropdown Menu */}
					<div className="absolute right-0 z-20 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
						<div className="p-1">
							{themeOptions.map((option) => {
								const Icon = option.icon;
								const isSelected = theme === option.value;

								return (
									<button
										key={option.value}
										onClick={() => {
											setTheme(option.value);
											setShowDropdown(false);
										}}
										className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
											isSelected
												? "bg-temu-50 text-temu-600 dark:bg-temu-900/20 dark:text-temu-400"
												: "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
										}`}
									>
										<Icon size={16} />
										{option.label}
										{option.value === "system" && (
											<span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
												({actualTheme === "light" ? "Light" : "Dark"})
											</span>
										)}
									</button>
								);
							})}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
