"use client";

import { useState, useEffect } from "react";
import { Gift, X } from "lucide-react";
import { SpinWheelModal } from "./SpinWheelModal";
import { Prize } from "./SpinWheel";

export function SpinWheelTrigger() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showFloatingButton, setShowFloatingButton] = useState(true);
	const [hasNewSpin, setHasNewSpin] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [showWelcomePopup, setShowWelcomePopup] = useState(false);

	useEffect(() => {
		// Check if user can spin today
		const lastSpinDate = localStorage.getItem("lastSpinDate");
		const today = new Date().toDateString();
		const canSpin = lastSpinDate !== today;
		setHasNewSpin(canSpin);

		// Check if this is first visit or new day
		const lastVisit = localStorage.getItem("lastVisitDate");
		const isNewVisit = lastVisit !== today;

		if (isNewVisit && canSpin) {
			// Show welcome popup after a short delay
			setTimeout(() => {
				setShowWelcomePopup(true);
			}, 2000);
		}

		localStorage.setItem("lastVisitDate", today);

		// Animate in after mount
		setTimeout(() => setIsVisible(true), 500);
	}, []);

	const handlePrizeClaimed = (prize: Prize) => {
		setHasNewSpin(false);
		console.log("Prize claimed:", prize);
		// Here you could integrate with your rewards system
		// e.g., add points to user account, create coupon, etc.
	};

	const handleCloseWelcomePopup = () => {
		setShowWelcomePopup(false);
	};

	const handleSpinFromWelcome = () => {
		setShowWelcomePopup(false);
		setIsModalOpen(true);
	};

	if (!showFloatingButton) return null;

	return (
		<>
			{/* Welcome Popup */}
			{showWelcomePopup && (
				<div className="fixed inset-0 z-40 flex items-center justify-center p-4">
					<div
						className="absolute inset-0 bg-black/50"
						onClick={handleCloseWelcomePopup}
					/>
					<div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-bounce-in">
						<button
							onClick={handleCloseWelcomePopup}
							className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600"
						>
							<X size={20} />
						</button>

						<div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-pulse">
							<Gift size={40} className="text-white" />
						</div>

						<h3 className="text-xl font-black text-gray-800 mb-2">
							Welcome Back!
						</h3>
						<p className="text-gray-600 mb-4">
							You have a <span className="text-orange-500 font-bold">FREE SPIN</span> waiting for you!
						</p>

						<div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3 mb-4">
							<p className="text-sm text-orange-700">
								Win up to <span className="font-bold">UGX 5,000</span> in credits, discounts, and more!
							</p>
						</div>

						<button
							onClick={handleSpinFromWelcome}
							className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
						>
							Spin Now!
						</button>

						<button
							onClick={handleCloseWelcomePopup}
							className="w-full mt-2 text-gray-500 text-sm hover:text-gray-700"
						>
							Maybe later
						</button>
					</div>
				</div>
			)}

			{/* Floating Button */}
			<div
				className={`fixed bottom-24 right-4 z-30 transition-all duration-500 ${
					isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
				}`}
			>
				<button
					onClick={() => setIsModalOpen(true)}
					className="relative group"
				>
					{/* Pulse ring when new spin available */}
					{hasNewSpin && (
						<div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-75" />
					)}

					{/* Button */}
					<div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
						<Gift size={28} className="text-white animate-wiggle" />

						{/* Badge */}
						{hasNewSpin && (
							<div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
								1
							</div>
						)}
					</div>

					{/* Tooltip */}
					<div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
						{hasNewSpin ? "Free Spin Available!" : "Lucky Wheel"}
						<div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-gray-800" />
					</div>
				</button>
			</div>

			{/* Spin Wheel Modal */}
			<SpinWheelModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onPrizeClaimed={handlePrizeClaimed}
			/>

			{/* Custom animations */}
			<style jsx global>{`
				@keyframes wiggle {
					0%, 100% { transform: rotate(-5deg); }
					50% { transform: rotate(5deg); }
				}
				.animate-wiggle {
					animation: wiggle 0.5s ease-in-out infinite;
				}
				@keyframes bounce-in {
					0% { transform: scale(0.5); opacity: 0; }
					50% { transform: scale(1.05); }
					100% { transform: scale(1); opacity: 1; }
				}
				.animate-bounce-in {
					animation: bounce-in 0.4s ease-out forwards;
				}
			`}</style>
		</>
	);
}
