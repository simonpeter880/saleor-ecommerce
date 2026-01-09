"use client";

import { useState, useEffect } from "react";
import { X, Gift, PartyPopper, Copy, Check, Clock } from "lucide-react";
import { SpinWheel, Prize } from "./SpinWheel";

interface SpinWheelModalProps {
	isOpen: boolean;
	onClose: () => void;
	onPrizeClaimed: (prize: Prize) => void;
}

export function SpinWheelModal({ isOpen, onClose, onPrizeClaimed }: SpinWheelModalProps) {
	const [wonPrize, setWonPrize] = useState<Prize | null>(null);
	const [showConfetti, setShowConfetti] = useState(false);
	const [copied, setCopied] = useState(false);
	const [spinsLeft, setSpinsLeft] = useState(1);
	const [hasSpun, setHasSpun] = useState(false);

	useEffect(() => {
		// Check localStorage for daily spin status
		const lastSpinDate = localStorage.getItem("lastSpinDate");
		const today = new Date().toDateString();

		if (lastSpinDate === today) {
			setSpinsLeft(0);
			setHasSpun(true);
		} else {
			setSpinsLeft(1);
			setHasSpun(false);
		}
	}, [isOpen]);

	const handleSpinComplete = (prize: Prize) => {
		setWonPrize(prize);
		setShowConfetti(true);
		setSpinsLeft(0);
		setHasSpun(true);

		// Save spin date
		localStorage.setItem("lastSpinDate", new Date().toDateString());

		// Save won prize to localStorage
		const wonPrizes = JSON.parse(localStorage.getItem("wonPrizes") || "[]");
		wonPrizes.push({
			...prize,
			wonAt: new Date().toISOString(),
			claimed: false,
		});
		localStorage.setItem("wonPrizes", JSON.stringify(wonPrizes));

		// Notify parent
		onPrizeClaimed(prize);

		// Stop confetti after a few seconds
		setTimeout(() => setShowConfetti(false), 3000);
	};

	const generateCouponCode = (prize: Prize): string => {
		const prefix = prize.type === "discount" ? "SAVE" : prize.type === "points" ? "POINTS" : "GIFT";
		const random = Math.random().toString(36).substring(2, 8).toUpperCase();
		return `${prefix}${prize.value}${random}`;
	};

	const copyCode = (code: string) => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleClose = () => {
		setWonPrize(null);
		setShowConfetti(false);
		onClose();
	};

	const getTimeUntilNextSpin = (): string => {
		const now = new Date();
		const tomorrow = new Date(now);
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0, 0, 0, 0);

		const diff = tomorrow.getTime() - now.getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

		return `${hours}h ${minutes}m`;
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/70 backdrop-blur-sm"
				onClick={handleClose}
			/>

			{/* Confetti */}
			{showConfetti && (
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					{[...Array(50)].map((_, i) => (
						<div
							key={i}
							className="absolute animate-confetti"
							style={{
								left: `${Math.random() * 100}%`,
								top: "-20px",
								animationDelay: `${Math.random() * 2}s`,
								animationDuration: `${2 + Math.random() * 2}s`,
							}}
						>
							<div
								className="w-3 h-3 rounded-sm"
								style={{
									backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#FF9F43", "#A29BFE"][
										Math.floor(Math.random() * 8)
									],
									transform: `rotate(${Math.random() * 360}deg)`,
								}}
							/>
						</div>
					))}
				</div>
			)}

			{/* Modal */}
			<div className="relative bg-gradient-to-b from-orange-50 to-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
				{/* Close button */}
				<button
					onClick={handleClose}
					className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all"
				>
					<X size={20} className="text-gray-600" />
				</button>

				{/* Header */}
				<div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-3xl text-center">
					<div className="flex items-center justify-center gap-2 mb-2">
						<Gift className="animate-bounce" size={28} />
						<h2 className="text-2xl font-black">Lucky Spin!</h2>
						<Gift className="animate-bounce" size={28} />
					</div>
					<p className="text-orange-100 text-sm">
						Spin the wheel for a chance to win amazing prizes!
					</p>
				</div>

				{/* Content */}
				<div className="p-6">
					{!wonPrize ? (
						<>
							{/* Spins left indicator */}
							<div className="text-center mb-4">
								{spinsLeft > 0 ? (
									<div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
										<Gift size={18} />
										You have {spinsLeft} free spin{spinsLeft > 1 ? "s" : ""} today!
									</div>
								) : (
									<div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold">
										<Clock size={18} />
										Next spin in: {getTimeUntilNextSpin()}
									</div>
								)}
							</div>

							{/* Wheel */}
							<SpinWheel
								onSpinComplete={handleSpinComplete}
								disabled={spinsLeft === 0}
							/>

							{/* Instructions */}
							<div className="mt-6 text-center text-sm text-gray-500">
								<p>Tap the center button to spin!</p>
								<p className="mt-1">Come back tomorrow for another free spin.</p>
							</div>
						</>
					) : (
						/* Prize Won Screen */
						<div className="text-center py-6">
							<PartyPopper className="mx-auto text-yellow-500 mb-4" size={64} />
							<h3 className="text-2xl font-black text-gray-800 mb-2">
								Congratulations!
							</h3>
							<p className="text-gray-600 mb-6">You won:</p>

							{/* Prize display */}
							<div
								className="inline-block px-8 py-4 rounded-2xl text-white font-bold text-xl mb-6 shadow-lg"
								style={{ backgroundColor: wonPrize.color }}
							>
								{wonPrize.label}
							</div>

							{/* Coupon code */}
							{(wonPrize.type === "discount" || wonPrize.type === "coupon" || wonPrize.type === "freeShipping") && (
								<div className="bg-gray-100 rounded-xl p-4 mb-6">
									<p className="text-sm text-gray-500 mb-2">Your coupon code:</p>
									<div className="flex items-center justify-center gap-2">
										<code className="bg-white px-4 py-2 rounded-lg font-mono text-lg font-bold text-gray-800 border-2 border-dashed border-gray-300">
											{generateCouponCode(wonPrize)}
										</code>
										<button
											onClick={() => copyCode(generateCouponCode(wonPrize))}
											className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
										>
											{copied ? <Check size={20} /> : <Copy size={20} />}
										</button>
									</div>
									<p className="text-xs text-gray-400 mt-2">
										Valid for 7 days. Min. purchase may apply.
									</p>
								</div>
							)}

							{/* Points display */}
							{wonPrize.type === "points" && (
								<div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mb-6">
									<p className="text-gray-700">
										<span className="font-bold text-2xl text-orange-600">{wonPrize.value}</span> points
										have been added to your account!
									</p>
								</div>
							)}

							{/* Credits display */}
							{wonPrize.type === "credits" && (
								<div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl p-4 mb-6">
									<p className="text-gray-700">
										<span className="font-bold text-2xl text-green-600">UGX {wonPrize.value.toLocaleString()}</span> credits
										have been added to your account!
									</p>
								</div>
							)}

							{/* Action buttons */}
							<div className="flex gap-3">
								<button
									onClick={handleClose}
									className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors"
								>
									Close
								</button>
								<button
									onClick={() => {
										handleClose();
										window.location.href = "/channel-pln/";
									}}
									className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-colors"
								>
									Start Shopping
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="bg-gray-50 px-6 py-4 rounded-b-3xl text-center text-xs text-gray-400">
					<p>Prizes are subject to terms and conditions. Points expire after 90 days.</p>
				</div>
			</div>

			{/* Add confetti animation styles */}
			<style jsx>{`
				@keyframes confetti {
					0% {
						transform: translateY(0) rotate(0deg);
						opacity: 1;
					}
					100% {
						transform: translateY(100vh) rotate(720deg);
						opacity: 0;
					}
				}
				.animate-confetti {
					animation: confetti 3s ease-out forwards;
				}
			`}</style>
		</div>
	);
}
