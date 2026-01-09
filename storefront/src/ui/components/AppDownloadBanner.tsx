"use client";

import { useState, useEffect } from "react";
import { X, Smartphone, Star, Download, Gift } from "lucide-react";

export function AppDownloadBanner() {
	const [isVisible, setIsVisible] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		// Check if mobile device
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);

		// Check if banner was dismissed
		const dismissed = localStorage.getItem("appBannerDismissed");
		const dismissedTime = dismissed ? parseInt(dismissed) : 0;
		const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

		// Show banner if not dismissed in the last 7 days
		if (daysSinceDismissed > 7) {
			setTimeout(() => setIsVisible(true), 5000);
		}

		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const handleDismiss = () => {
		setIsVisible(false);
		localStorage.setItem("appBannerDismissed", String(Date.now()));
	};

	const handleDownload = () => {
		// Detect platform and redirect
		const userAgent = navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod/.test(userAgent)) {
			window.open("https://apps.apple.com/app/techhub", "_blank");
		} else {
			window.open("https://play.google.com/store/apps/details?id=com.techhub", "_blank");
		}
		handleDismiss();
	};

	if (!isVisible) return null;

	// Mobile sticky banner at bottom
	if (isMobile) {
		return (
			<div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-2xl animate-slide-up">
				<button
					onClick={handleDismiss}
					className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
				>
					<X size={18} />
				</button>

				<div className="flex items-center gap-4">
					{/* App Icon */}
					<div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
						<span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
							TH
						</span>
					</div>

					{/* Info */}
					<div className="flex-1 min-w-0">
						<h3 className="font-bold text-sm">TechHub App</h3>
						<div className="flex items-center gap-1 text-xs text-purple-200">
							<Star size={12} className="fill-yellow-400 text-yellow-400" />
							<span>4.8</span>
							<span className="mx-1">•</span>
							<span>Free</span>
						</div>
						<p className="text-xs text-purple-200 mt-0.5">
							Get UGX 5,000 off first order!
						</p>
					</div>

					{/* Download Button */}
					<button
						onClick={handleDownload}
						className="bg-white text-purple-600 font-bold px-4 py-2 rounded-lg text-sm hover:bg-purple-100 transition-colors flex-shrink-0"
					>
						Get App
					</button>
				</div>

				<style jsx>{`
					@keyframes slide-up {
						from {
							transform: translateY(100%);
						}
						to {
							transform: translateY(0);
						}
					}
					.animate-slide-up {
						animation: slide-up 0.3s ease-out forwards;
					}
				`}</style>
			</div>
		);
	}

	// Desktop floating banner
	return (
		<div className="fixed bottom-6 left-6 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden max-w-sm animate-slide-in">
			{/* Close button */}
			<button
				onClick={handleDismiss}
				className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
			>
				<X size={18} className="text-gray-400" />
			</button>

			{/* Header */}
			<div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
						<Smartphone className="text-purple-600" size={28} />
					</div>
					<div>
						<h3 className="font-bold">Download Our App</h3>
						<p className="text-sm text-purple-200">Shop smarter on mobile</p>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="p-4">
				{/* Benefits */}
				<div className="space-y-2 mb-4">
					<div className="flex items-center gap-2 text-sm">
						<Gift className="text-green-500" size={16} />
						<span className="text-gray-700">UGX 5,000 off first app order</span>
					</div>
					<div className="flex items-center gap-2 text-sm">
						<Star className="text-yellow-500" size={16} />
						<span className="text-gray-700">Exclusive app-only deals</span>
					</div>
					<div className="flex items-center gap-2 text-sm">
						<Download className="text-blue-500" size={16} />
						<span className="text-gray-700">Faster checkout experience</span>
					</div>
				</div>

				{/* Store Buttons */}
				<div className="flex gap-2">
					<button
						onClick={() => window.open("https://apps.apple.com/app/techhub", "_blank")}
						className="flex-1 bg-black text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
					>
						<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
							<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
						</svg>
						<span className="text-xs font-medium">App Store</span>
					</button>
					<button
						onClick={() => window.open("https://play.google.com/store/apps/details?id=com.techhub", "_blank")}
						className="flex-1 bg-black text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
					>
						<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
							<path d="M3 20.5v-17c0-.59.34-1.11.84-1.35l9.66 9.35-9.66 9.35c-.5-.24-.84-.76-.84-1.35m13.28-5.21l-2.38-1.38-2.78 2.69 2.78 2.69 2.38-1.38c.51-.29.82-.84.82-1.31s-.31-1.02-.82-1.31m-10.6-9.79l8.1 8.1-8.1 8.1v-16.2m9.04 8.6l2.14-1.24-2.14-1.24-2.14 1.24 2.14 1.24z"/>
						</svg>
						<span className="text-xs font-medium">Google Play</span>
					</button>
				</div>

				{/* QR Code suggestion */}
				<p className="text-xs text-gray-400 text-center mt-3">
					Or scan QR code on our mobile site
				</p>
			</div>

			<style jsx>{`
				@keyframes slide-in {
					from {
						transform: translateX(-100%);
						opacity: 0;
					}
					to {
						transform: translateX(0);
						opacity: 1;
					}
				}
				.animate-slide-in {
					animation: slide-in 0.4s ease-out forwards;
				}
			`}</style>
		</div>
	);
}
