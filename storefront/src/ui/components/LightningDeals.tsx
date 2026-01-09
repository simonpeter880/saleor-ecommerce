"use client";

import { useState, useEffect } from "react";
import { Zap, Clock, ShoppingCart, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface LightningDeal {
	id: string;
	name: string;
	image: string;
	originalPrice: number;
	dealPrice: number;
	discount: number;
	stockTotal: number;
	stockClaimed: number;
	endsAt: Date;
}

// Sample lightning deals data
const sampleDeals: LightningDeal[] = [
	{
		id: "1",
		name: "Wireless Bluetooth Earbuds Pro",
		image: "/placeholder-product.jpg",
		originalPrice: 150000,
		dealPrice: 45000,
		discount: 70,
		stockTotal: 100,
		stockClaimed: 78,
		endsAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
	},
	{
		id: "2",
		name: "Smart Watch Series 8",
		image: "/placeholder-product.jpg",
		originalPrice: 350000,
		dealPrice: 175000,
		discount: 50,
		stockTotal: 50,
		stockClaimed: 42,
		endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
	},
	{
		id: "3",
		name: "10000mAh Power Bank",
		image: "/placeholder-product.jpg",
		originalPrice: 80000,
		dealPrice: 28000,
		discount: 65,
		stockTotal: 200,
		stockClaimed: 156,
		endsAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
	},
	{
		id: "4",
		name: "USB-C Fast Charger 65W",
		image: "/placeholder-product.jpg",
		originalPrice: 120000,
		dealPrice: 48000,
		discount: 60,
		stockTotal: 150,
		stockClaimed: 89,
		endsAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
	},
];

function formatPrice(price: number): string {
	return `UGX ${price.toLocaleString()}`;
}

function DealCard({ deal, channel }: { deal: LightningDeal; channel: string }) {
	const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
	const stockPercent = (deal.stockClaimed / deal.stockTotal) * 100;
	const isAlmostGone = stockPercent > 80;

	useEffect(() => {
		const updateTimer = () => {
			const diff = deal.endsAt.getTime() - Date.now();

			if (diff <= 0) {
				setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
				return;
			}

			const hours = Math.floor(diff / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diff % (1000 * 60)) / 1000);

			setTimeLeft({ hours, minutes, seconds });
		};

		updateTimer();
		const interval = setInterval(updateTimer, 1000);

		return () => clearInterval(interval);
	}, [deal.endsAt]);

	return (
		<div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
			{/* Image */}
			<div className="relative aspect-square bg-gray-100">
				<div className="absolute inset-0 flex items-center justify-center text-gray-400">
					<ShoppingCart size={48} />
				</div>

				{/* Discount Badge */}
				<div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg font-bold text-sm flex items-center gap-1">
					<Zap size={14} />
					-{deal.discount}%
				</div>

				{/* Almost Gone Badge */}
				{isAlmostGone && (
					<div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-lg font-bold text-xs animate-pulse">
						Almost Gone!
					</div>
				)}
			</div>

			{/* Content */}
			<div className="p-4">
				{/* Title */}
				<h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
					{deal.name}
				</h3>

				{/* Price */}
				<div className="flex items-baseline gap-2 mb-3">
					<span className="text-xl font-black text-red-600">
						{formatPrice(deal.dealPrice)}
					</span>
					<span className="text-sm text-gray-400 line-through">
						{formatPrice(deal.originalPrice)}
					</span>
				</div>

				{/* Stock Progress */}
				<div className="mb-3">
					<div className="flex justify-between text-xs mb-1">
						<span className="text-gray-500">
							{deal.stockClaimed} claimed
						</span>
						<span className="text-orange-600 font-semibold">
							{deal.stockTotal - deal.stockClaimed} left
						</span>
					</div>
					<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
						<div
							className={`h-full transition-all ${
								isAlmostGone
									? "bg-gradient-to-r from-orange-500 to-red-500"
									: "bg-gradient-to-r from-orange-400 to-orange-500"
							}`}
							style={{ width: `${stockPercent}%` }}
						/>
					</div>
				</div>

				{/* Timer */}
				<div className="flex items-center justify-center gap-1 bg-gray-900 text-white py-2 px-3 rounded-lg text-sm font-mono">
					<Clock size={14} />
					<span>
						{String(timeLeft.hours).padStart(2, "0")}:
						{String(timeLeft.minutes).padStart(2, "0")}:
						{String(timeLeft.seconds).padStart(2, "0")}
					</span>
				</div>
			</div>

			{/* Add to Cart Button */}
			<Link
				href={`/${channel}/products/${deal.id}`}
				className="block bg-gradient-to-r from-orange-500 to-red-500 text-white text-center font-bold py-3 hover:from-orange-600 hover:to-red-600 transition-colors"
			>
				Grab Deal
			</Link>
		</div>
	);
}

export function LightningDeals({ channel }: { channel: string }) {
	const [deals] = useState<LightningDeal[]>(sampleDeals);

	return (
		<section className="py-8 bg-gradient-to-r from-orange-500 to-red-500">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3 text-white">
						<div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
							<Zap size={28} />
						</div>
						<div>
							<h2 className="text-2xl font-black flex items-center gap-2">
								Lightning Deals
								<TrendingUp size={24} className="animate-bounce" />
							</h2>
							<p className="text-orange-100 text-sm">Limited stock at crazy prices!</p>
						</div>
					</div>

					<Link
						href={`/${channel}/deals`}
						className="bg-white text-orange-600 font-bold px-6 py-2 rounded-full hover:bg-orange-100 transition-colors hidden md:block"
					>
						View All Deals
					</Link>
				</div>

				{/* Deals Grid */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{deals.map((deal) => (
						<DealCard key={deal.id} deal={deal} channel={channel} />
					))}
				</div>

				{/* Mobile View All Button */}
				<div className="mt-6 text-center md:hidden">
					<Link
						href={`/${channel}/deals`}
						className="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-full hover:bg-orange-100 transition-colors"
					>
						View All Deals
					</Link>
				</div>
			</div>
		</section>
	);
}
