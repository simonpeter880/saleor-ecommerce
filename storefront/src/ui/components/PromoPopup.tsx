"use client";

import { useState, useEffect } from "react";
import { X, Gift, Clock, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

interface PromoOffer {
	id: string;
	title: string;
	subtitle: string;
	discount: string;
	code?: string;
	expiresIn?: number; // hours
	bgColor: string;
	ctaText: string;
	ctaLink: string;
}

const promoOffers: PromoOffer[] = [
	{
		id: "flash-sale",
		title: "Flash Sale!",
		subtitle: "Limited time electronics deals",
		discount: "Up to 70% OFF",
		expiresIn: 6,
		bgColor: "from-red-500 to-orange-500",
		ctaText: "Shop Now",
		ctaLink: "/channel-pln/deals",
	},
	{
		id: "new-user",
		title: "New User Special",
		subtitle: "Get extra discount on first order",
		discount: "15% OFF",
		code: "WELCOME15",
		bgColor: "from-purple-500 to-pink-500",
		ctaText: "Claim Now",
		ctaLink: "/channel-pln/register",
	},
	{
		id: "free-shipping",
		title: "Free Shipping Week",
		subtitle: "No minimum purchase required",
		discount: "FREE SHIPPING",
		expiresIn: 48,
		bgColor: "from-blue-500 to-cyan-500",
		ctaText: "Shop Now",
		ctaLink: "/channel-pln/products",
	},
];

export function PromoPopup({ channel }: { channel: string }) {
	const [isVisible, setIsVisible] = useState(false);
	const [currentOffer, setCurrentOffer] = useState<PromoOffer | null>(null);
	const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

	useEffect(() => {
		// Check if popup was dismissed recently
		const lastDismissed = localStorage.getItem("promoPopupDismissed");
		const dismissedTime = lastDismissed ? parseInt(lastDismissed) : 0;
		const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);

		// Show popup if it hasn't been dismissed in the last 6 hours
		if (hoursSinceDismissed > 6) {
			// Random offer
			const offer = promoOffers[Math.floor(Math.random() * promoOffers.length)];
			setCurrentOffer(offer);

			// Delay showing popup
			setTimeout(() => {
				setIsVisible(true);
			}, 3000);

			// Set countdown if applicable
			if (offer.expiresIn) {
				const endTime = Date.now() + offer.expiresIn * 60 * 60 * 1000;
				localStorage.setItem("promoEndTime", String(endTime));
			}
		}
	}, []);

	useEffect(() => {
		if (!currentOffer?.expiresIn) return;

		const updateTimer = () => {
			const endTime = parseInt(localStorage.getItem("promoEndTime") || String(Date.now()));
			const diff = endTime - Date.now();

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
	}, [currentOffer]);

	const handleDismiss = () => {
		setIsVisible(false);
		localStorage.setItem("promoPopupDismissed", String(Date.now()));
	};

	if (!isVisible || !currentOffer) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={handleDismiss}
			/>

			{/* Popup */}
			<div className="relative max-w-md w-full animate-bounce-in">
				{/* Close Button */}
				<button
					onClick={handleDismiss}
					className="absolute -top-3 -right-3 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
				>
					<X size={20} className="text-gray-600" />
				</button>

				{/* Card */}
				<div className={`bg-gradient-to-br ${currentOffer.bgColor} rounded-2xl overflow-hidden shadow-2xl`}>
					{/* Top Section */}
					<div className="p-8 text-white text-center">
						{/* Icon */}
						<div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
							{currentOffer.id === "flash-sale" ? (
								<Zap size={40} />
							) : (
								<Gift size={40} />
							)}
						</div>

						{/* Title */}
						<h2 className="text-3xl font-black mb-2">{currentOffer.title}</h2>
						<p className="text-white/80 mb-4">{currentOffer.subtitle}</p>

						{/* Discount */}
						<div className="inline-block bg-white text-gray-900 px-6 py-3 rounded-full font-black text-2xl shadow-lg">
							{currentOffer.discount}
						</div>

						{/* Coupon Code */}
						{currentOffer.code && (
							<div className="mt-4 bg-white/10 border-2 border-dashed border-white/50 rounded-xl p-3">
								<p className="text-sm text-white/70 mb-1">Use code:</p>
								<p className="font-mono font-bold text-xl tracking-wider">
									{currentOffer.code}
								</p>
							</div>
						)}

						{/* Countdown */}
						{currentOffer.expiresIn && (
							<div className="mt-4 flex items-center justify-center gap-2 text-white/90">
								<Clock size={18} />
								<span className="font-semibold">
									Ends in: {String(timeLeft.hours).padStart(2, "0")}:
									{String(timeLeft.minutes).padStart(2, "0")}:
									{String(timeLeft.seconds).padStart(2, "0")}
								</span>
							</div>
						)}
					</div>

					{/* CTA Section */}
					<div className="bg-white p-6">
						<Link
							href={currentOffer.ctaLink.replace("channel-pln", channel)}
							onClick={handleDismiss}
							className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white font-bold py-4 px-6 rounded-xl hover:bg-gray-800 transition-colors"
						>
							{currentOffer.ctaText}
							<ArrowRight size={20} />
						</Link>

						<button
							onClick={handleDismiss}
							className="w-full mt-3 text-gray-500 text-sm hover:text-gray-700"
						>
							No thanks, I'll pay full price
						</button>
					</div>
				</div>
			</div>

			{/* Animation styles */}
			<style jsx>{`
				@keyframes bounce-in {
					0% {
						opacity: 0;
						transform: scale(0.8) translateY(20px);
					}
					50% {
						transform: scale(1.02);
					}
					100% {
						opacity: 1;
						transform: scale(1) translateY(0);
					}
				}
				.animate-bounce-in {
					animation: bounce-in 0.4s ease-out forwards;
				}
			`}</style>
		</div>
	);
}
