"use client";

import Link from "next/link";
import { useState } from "react";

interface SubCategory {
	name: string;
	href: string;
	icon?: string;
}

interface Category {
	name: string;
	href: string;
	featured?: boolean;
	subcategories?: SubCategory[];
}

const electronicsCategories: Category[] = [
	{
		name: "Mobile Phones",
		href: "/categories/mobile-phones-mobile-technology",
		featured: true,
		subcategories: [
			{ name: "Mobile Phones", href: "/categories/mobile-phones", icon: "📱" },
			{ name: "Mobile Accessories", href: "/categories/mobile-accessories", icon: "🔌" },
		],
	},
	{
		name: "Computers & Laptops",
		href: "/categories/computers-laptops-workstations",
		featured: true,
		subcategories: [
			{ name: "Laptops", href: "/categories/laptops", icon: "💻" },
			{ name: "Desktop Computers", href: "/categories/desktop-computers", icon: "🖥️" },
			{ name: "Workstations", href: "/categories/workstations", icon: "⚙️" },
		],
	},
	{
		name: "PC Components",
		href: "/categories/computer-components-pc-hardware",
		featured: true,
		subcategories: [
			{ name: "Processing & Core", href: "/categories/processing-core-components", icon: "🔧" },
			{ name: "Memory & Storage", href: "/categories/memory-storage", icon: "💾" },
			{ name: "Graphics & Display", href: "/categories/graphics-display", icon: "🖼️" },
			{ name: "Power & Cooling", href: "/categories/power-cooling", icon: "❄️" },
			{ name: "Cases & Accessories", href: "/categories/cases-accessories", icon: "📦" },
		],
	},
	{
		name: "Gaming & Esports",
		href: "/categories/gaming-esports",
		featured: true,
		subcategories: [
			{ name: "Gaming Consoles", href: "/categories/gaming-consoles", icon: "🎮" },
			{ name: "Gaming PCs & Laptops", href: "/categories/gaming-pcs-laptops", icon: "🖥️" },
			{ name: "Gaming Accessories", href: "/categories/gaming-accessories", icon: "🕹️" },
		],
	},
	{
		name: "Tablets & E-Readers",
		href: "/categories/tablets-e-readers",
		subcategories: [
			{ name: "Tablets", href: "/categories/tablets", icon: "📲" },
			{ name: "E-Readers", href: "/categories/e-readers", icon: "📖" },
			{ name: "Tablet Accessories", href: "/categories/tablet-accessories", icon: "🔌" },
		],
	},
	{
		name: "Audio & Sound",
		href: "/categories/audio-sound-music-equipment",
		subcategories: [
			{ name: "Personal Audio", href: "/categories/personal-audio", icon: "🎧" },
			{ name: "Speakers", href: "/categories/speakers", icon: "🔊" },
			{ name: "Professional Audio", href: "/categories/professional-audio", icon: "🎤" },
		],
	},
	{
		name: "TVs & Entertainment",
		href: "/categories/tvs-video-home-entertainment",
		subcategories: [
			{ name: "Televisions", href: "/categories/televisions", icon: "📺" },
			{ name: "Video Devices", href: "/categories/video-devices", icon: "🎬" },
			{ name: "Home Theater", href: "/categories/home-theater", icon: "🎞️" },
		],
	},
	{
		name: "Smart Home & IoT",
		href: "/categories/smart-home-iot",
		subcategories: [
			{ name: "Smart Living", href: "/categories/smart-living", icon: "🏠" },
			{ name: "Smart Security", href: "/categories/smart-security", icon: "🔒" },
			{ name: "Home Automation", href: "/categories/home-automation", icon: "⚡" },
		],
	},
];

export function MegaMenu() {
	const [activeCategory, setActiveCategory] = useState<string | null>(null);

	return (
		<nav className="relative border-b border-neutral-200 bg-white">
			<div className="mx-auto max-w-7xl px-8">
				<div className="flex items-center justify-between py-4">
					{/* Categories Menu */}
					<div className="flex items-center gap-8">
						<button
							className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
							onMouseEnter={() => setActiveCategory("all")}
						>
							<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
							All Categories
						</button>

						{/* Top-level navigation */}
						<div className="hidden items-center gap-6 lg:flex">
							<Link
								href="/deals"
								className="font-medium text-neutral-700 transition hover:text-blue-600"
							>
								Deals
							</Link>
							<Link
								href="/new-arrivals"
								className="font-medium text-neutral-700 transition hover:text-blue-600"
							>
								New Arrivals
							</Link>
							<Link
								href="/brands"
								className="font-medium text-neutral-700 transition hover:text-blue-600"
							>
								Brands
							</Link>
							<Link
								href="/guides"
								className="font-medium text-neutral-700 transition hover:text-blue-600"
							>
								Buying Guides
							</Link>
						</div>
					</div>

					{/* Right side actions */}
					<div className="flex items-center gap-4">
						<button className="text-neutral-700 transition hover:text-blue-600">
							<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</button>
						<button className="text-neutral-700 transition hover:text-blue-600">
							<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
						</button>
						<button className="relative text-neutral-700 transition hover:text-blue-600">
							<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
							<span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
								3
							</span>
						</button>
					</div>
				</div>
			</div>

			{/* Mega Menu Dropdown */}
			{activeCategory === "all" && (
				<div
					className="absolute left-0 right-0 top-full z-50 border-t border-neutral-200 bg-white shadow-xl"
					onMouseLeave={() => setActiveCategory(null)}
				>
					<div className="mx-auto max-w-7xl px-8 py-8">
						<div className="grid gap-8 lg:grid-cols-4">
							{electronicsCategories.map((category) => (
								<div key={category.name}>
									<Link
										href={category.href}
										className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900 hover:text-blue-600"
									>
										{category.name}
										{category.featured && (
											<span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600">
												Popular
											</span>
										)}
									</Link>
									{category.subcategories && (
										<ul className="space-y-2">
											{category.subcategories.map((sub) => (
												<li key={sub.name}>
													<Link
														href={sub.href}
														className="flex items-center gap-2 text-sm text-neutral-600 transition hover:text-blue-600"
													>
														{sub.icon && <span className="text-base">{sub.icon}</span>}
														{sub.name}
													</Link>
												</li>
											))}
										</ul>
									)}
								</div>
							))}
						</div>

						{/* Featured Banner */}
						<div className="mt-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-lg font-semibold">Special Holiday Deals</h3>
									<p className="mt-1 text-sm text-blue-100">
										Up to 40% off on selected electronics
									</p>
								</div>
								<Link
									href="/deals"
									className="rounded-lg bg-white px-6 py-2 font-semibold text-blue-600 transition hover:bg-blue-50"
								>
									Shop Now
								</Link>
							</div>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
