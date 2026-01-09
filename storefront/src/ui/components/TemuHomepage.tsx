"use client";

import { TemuProductCard } from "./TemuProductCard";
import { RecentlyViewed } from "./RecentlyViewed";
import { ChevronRight, Zap, Gift, TrendingUp, Clock } from "lucide-react";
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

interface TemuHomepageProps {
	products: Product[];
	channel: string;
}

export function TemuHomepage({ products, channel }: TemuHomepageProps) {
	return (
		<div className="bg-gray-50 min-h-screen pb-20 md:pb-0">
			{/* Hero Banner Section */}
			<div className="bg-gradient-to-r from-temu-500 via-temu-600 to-temu-700 text-white">
				<div className="mx-auto max-w-7xl px-4 py-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
						<div>
							<h1 className="text-4xl md:text-5xl font-black mb-4">
								Shop Like a Billionaire
							</h1>
							<p className="text-xl mb-6 opacity-90">
								Incredible deals on electronics. Save up to 90% today!
							</p>
							<div className="flex gap-4">
								<Link
									href={`/${channel}/deals`}
									className="bg-white text-temu-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
								>
									Shop Deals
								</Link>
								<Link
									href={`/${channel}/new`}
									className="border-2 border-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors"
								>
									What's New
								</Link>
							</div>
						</div>
						<div className="hidden md:block">
							<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
								<div className="text-6xl font-black mb-2">90% OFF</div>
								<div className="text-xl mb-4">Limited Time Offer</div>
								<div className="flex gap-2 text-center">
									<div className="bg-white/20 rounded-lg p-3 flex-1">
										<div className="text-2xl font-bold">12</div>
										<div className="text-xs opacity-75">HOURS</div>
									</div>
									<div className="bg-white/20 rounded-lg p-3 flex-1">
										<div className="text-2xl font-bold">34</div>
										<div className="text-xs opacity-75">MINS</div>
									</div>
									<div className="bg-white/20 rounded-lg p-3 flex-1">
										<div className="text-2xl font-bold">56</div>
										<div className="text-xs opacity-75">SECS</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Promotional Badges */}
			<div className="bg-white border-b border-gray-200">
				<div className="mx-auto max-w-7xl px-4 py-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="flex items-center gap-3">
							<div className="bg-temu-100 p-2 rounded-full">
								<Zap className="text-temu-600" size={24} />
							</div>
							<div>
								<div className="font-bold text-sm">Free Shipping</div>
								<div className="text-xs text-gray-500">On orders $50+</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="bg-temu-100 p-2 rounded-full">
								<Gift className="text-temu-600" size={24} />
							</div>
							<div>
								<div className="font-bold text-sm">Daily Deals</div>
								<div className="text-xs text-gray-500">Save up to 90%</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="bg-temu-100 p-2 rounded-full">
								<TrendingUp className="text-temu-600" size={24} />
							</div>
							<div>
								<div className="font-bold text-sm">Price Match</div>
								<div className="text-xs text-gray-500">Best prices guaranteed</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="bg-temu-100 p-2 rounded-full">
								<Clock className="text-temu-600" size={24} />
							</div>
							<div>
								<div className="font-bold text-sm">24/7 Support</div>
								<div className="text-xs text-gray-500">Always here to help</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-4 py-6">
				{/* Recently Viewed Section */}
				<RecentlyViewed channel={channel} limit={5} />

				{/* Flash Deals Section */}
				<section className="mb-8">
					<div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl p-6 text-white mb-4">
						<div className="flex items-center justify-between">
							<div>
								<div className="flex items-center gap-2 mb-2">
									<Zap className="animate-pulse" size={28} />
									<h2 className="text-3xl font-black">FLASH DEALS</h2>
								</div>
								<p className="text-sm opacity-90">Limited time offers - Grab them before they're gone!</p>
							</div>
							<div className="hidden md:flex gap-2">
								<div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2 text-center">
									<div className="text-2xl font-bold">02</div>
									<div className="text-xs">Hours</div>
								</div>
								<div className="text-2xl font-bold">:</div>
								<div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2 text-center">
									<div className="text-2xl font-bold">45</div>
									<div className="text-xs">Mins</div>
								</div>
								<div className="text-2xl font-bold">:</div>
								<div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2 text-center">
									<div className="text-2xl font-bold">32</div>
									<div className="text-xs">Secs</div>
								</div>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
						{products.slice(0, 6).map((product) => (
							<TemuProductCard key={product.id} product={product} channel={channel} />
						))}
					</div>
					<div className="text-center mt-4">
						<Link
							href={`/${channel}/flash-deals`}
							className="inline-flex items-center gap-2 text-temu-600 font-bold hover:gap-3 transition-all"
						>
							View All Flash Deals
							<ChevronRight size={20} />
						</Link>
					</div>
				</section>

				{/* Category Spotlight Banners */}
				<section className="mb-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Link
							href={`/${channel}/categories/mobile-phones-mobile-technology`}
							className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl overflow-hidden group h-48"
						>
							<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
							<div className="relative p-6 text-white h-full flex flex-col justify-between">
								<div>
									<div className="text-sm font-bold mb-1">HOT DEALS</div>
									<div className="text-3xl font-black">Mobile Phones</div>
								</div>
								<div className="flex items-center gap-2 font-bold">
									<span>Shop Now</span>
									<ChevronRight className="group-hover:translate-x-1 transition-transform" />
								</div>
							</div>
						</Link>

						<Link
							href={`/${channel}/categories/computers-laptops-workstations`}
							className="relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl overflow-hidden group h-48"
						>
							<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
							<div className="relative p-6 text-white h-full flex flex-col justify-between">
								<div>
									<div className="text-sm font-bold mb-1">UP TO 60% OFF</div>
									<div className="text-3xl font-black">Computers</div>
								</div>
								<div className="flex items-center gap-2 font-bold">
									<span>Shop Now</span>
									<ChevronRight className="group-hover:translate-x-1 transition-transform" />
								</div>
							</div>
						</Link>

						<Link
							href={`/${channel}/categories/gaming-esports`}
							className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-2xl overflow-hidden group h-48"
						>
							<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
							<div className="relative p-6 text-white h-full flex flex-col justify-between">
								<div>
									<div className="text-sm font-bold mb-1">NEW ARRIVALS</div>
									<div className="text-3xl font-black">Gaming</div>
								</div>
								<div className="flex items-center gap-2 font-bold">
									<span>Shop Now</span>
									<ChevronRight className="group-hover:translate-x-1 transition-transform" />
								</div>
							</div>
						</Link>
					</div>
				</section>

				{/* Today's Best Deals */}
				<section className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-2xl font-black text-gray-900">Today's Best Deals</h2>
						<Link
							href={`/${channel}/products`}
							className="text-temu-600 font-bold flex items-center gap-1 hover:gap-2 transition-all"
						>
							View All
							<ChevronRight size={20} />
						</Link>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
						{products.slice(0, 10).map((product) => (
							<TemuProductCard key={product.id} product={product} channel={channel} />
						))}
					</div>
				</section>

				{/* More Products Grid */}
				<section className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-2xl font-black text-gray-900">Recommended For You</h2>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
						{products.map((product) => (
							<TemuProductCard key={product.id} product={product} channel={channel} />
						))}
					</div>
				</section>

				{/* Load More Button */}
				<div className="text-center mt-8">
					<button className="bg-temu-500 text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-temu-600 transition-colors shadow-lg">
						Load More Products
					</button>
				</div>
			</div>
		</div>
	);
}
