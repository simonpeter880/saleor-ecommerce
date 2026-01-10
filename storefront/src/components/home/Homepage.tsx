"use client";

import { ProductCard } from "@/ui/components/ProductCard";
import { RecentlyViewed } from "@/ui/components/RecentlyViewed";
import { ShieldCheck, Truck, RefreshCw, HeadphonesIcon } from "lucide-react";
import Link from "next/link";

interface Product {
	id: string;
	name: string;
	slug: string;
	thumbnail?: {
		url?: string;
		alt?: string;
	};
	pricing?: {
		priceRange?: {
			start?: {
				gross: {
					amount: number;
					currency: string;
				};
			};
		};
	};
	category?: {
		name: string;
	};
}

interface HomepageProps {
	products: Product[];
	channel: string;
}

export function Homepage({ products, channel }: HomepageProps) {
	return (
		<div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
			{/* Hero Section - Professional, not promotional */}
			<div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 text-white">
				<div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
						<div>
							<h1 className="text-3xl md:text-5xl font-bold mb-4">
								Quality Electronics at Great Prices
							</h1>
							<p className="text-lg md:text-xl mb-6 opacity-90">
								Discover the latest smartphones, laptops, tablets, and gaming gear from trusted brands.
							</p>
							<div className="flex flex-wrap gap-4">
								<Link
									href={`/${channel}/products`}
									className="bg-white text-primary-700 px-6 md:px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
								>
									Shop Now
								</Link>
								<Link
									href={`/${channel}/categories`}
									className="border-2 border-white px-6 md:px-8 py-3 rounded-md font-semibold hover:bg-white/10 transition-colors"
								>
									Browse Categories
								</Link>
							</div>
						</div>
						<div className="hidden md:block">
							<div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
								<h2 className="text-2xl font-bold mb-4">Why Shop With Us?</h2>
								<ul className="space-y-3">
									<li className="flex items-center gap-3">
										<ShieldCheck size={20} className="flex-shrink-0" />
										<span>1-Year Warranty on All Products</span>
									</li>
									<li className="flex items-center gap-3">
										<Truck size={20} className="flex-shrink-0" />
										<span>Free Shipping Over $50</span>
									</li>
									<li className="flex items-center gap-3">
										<RefreshCw size={20} className="flex-shrink-0" />
										<span>30-Day Easy Returns</span>
									</li>
									<li className="flex items-center gap-3">
										<HeadphonesIcon size={20} className="flex-shrink-0" />
										<span>24/7 Customer Support</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Trust Badges - Professional benefits */}
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
				<div className="mx-auto max-w-7xl px-4 py-6">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="flex items-center gap-3">
							<div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-lg">
								<Truck className="text-primary-600 dark:text-primary-400" size={24} />
							</div>
							<div>
								<div className="font-semibold text-sm">Free Shipping</div>
								<div className="text-xs text-gray-600 dark:text-gray-400">On orders $50+</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-lg">
								<ShieldCheck className="text-primary-600 dark:text-primary-400" size={24} />
							</div>
							<div>
								<div className="font-semibold text-sm">Secure Payment</div>
								<div className="text-xs text-gray-600 dark:text-gray-400">100% protected</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-lg">
								<RefreshCw className="text-primary-600 dark:text-primary-400" size={24} />
							</div>
							<div>
								<div className="font-semibold text-sm">Easy Returns</div>
								<div className="text-xs text-gray-600 dark:text-gray-400">30-day policy</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-lg">
								<HeadphonesIcon className="text-primary-600 dark:text-primary-400" size={24} />
							</div>
							<div>
								<div className="font-semibold text-sm">Support 24/7</div>
								<div className="text-xs text-gray-600 dark:text-gray-400">Always here to help</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Featured Products Section */}
			<div className="mx-auto max-w-7xl px-4 py-12">
				<div className="mb-8">
					<h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
						Featured Products
					</h2>
					<p className="text-gray-600 dark:text-gray-400">
						Discover our most popular electronics
					</p>
				</div>

				{/* Product Grid */}
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} channel={channel} />
					))}
				</div>

				{/* View All Link */}
				<div className="mt-12 text-center">
					<Link
						href={`/${channel}/products`}
						className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
					>
						View All Products
						<span>→</span>
					</Link>
				</div>
			</div>

			{/* Recently Viewed Section */}
			<div className="mx-auto max-w-7xl px-4 py-12">
				<RecentlyViewed channel={channel} />
			</div>

			{/* Categories Section - Optional */}
			<div className="bg-white dark:bg-gray-800 py-12">
				<div className="mx-auto max-w-7xl px-4">
					<h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
						Shop by Category
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<Link
							href={`/${channel}/categories/mobile-phones-mobile-technology`}
							className="group bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
						>
							<div className="text-center">
								<div className="text-4xl mb-3">📱</div>
								<h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
									Mobile Phones
								</h3>
							</div>
						</Link>
						<Link
							href={`/${channel}/categories/computers-laptops-workstations`}
							className="group bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
						>
							<div className="text-center">
								<div className="text-4xl mb-3">💻</div>
								<h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
									Laptops
								</h3>
							</div>
						</Link>
						<Link
							href={`/${channel}/categories/tablets-e-readers`}
							className="group bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
						>
							<div className="text-center">
								<div className="text-4xl mb-3">📱</div>
								<h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
									Tablets
								</h3>
							</div>
						</Link>
						<Link
							href={`/${channel}/categories/gaming-esports`}
							className="group bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
						>
							<div className="text-center">
								<div className="text-4xl mb-3">🎮</div>
								<h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
									Gaming
								</h3>
							</div>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
