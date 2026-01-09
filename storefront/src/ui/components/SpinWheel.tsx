"use client";

import { useState, useRef } from "react";
import { Gift, Star, Zap, Percent, Coins, Package, Sparkles } from "lucide-react";

export interface Prize {
	id: string;
	label: string;
	shortLabel: string;
	value: number;
	type: "coupon" | "points" | "freeShipping" | "discount" | "credits" | "freeItem";
	color: string;
	probability: number; // Weight for probability (higher = more likely)
	icon: "gift" | "star" | "zap" | "percent" | "coins" | "package";
}

const defaultPrizes: Prize[] = [
	{ id: "1", label: "50 Points", shortLabel: "50 PTS", value: 50, type: "points", color: "#FF6B6B", probability: 25, icon: "star" },
	{ id: "2", label: "10% Off", shortLabel: "10%", value: 10, type: "discount", color: "#4ECDC4", probability: 20, icon: "percent" },
	{ id: "3", label: "100 Points", shortLabel: "100 PTS", value: 100, type: "points", color: "#45B7D1", probability: 15, icon: "star" },
	{ id: "4", label: "Free Shipping", shortLabel: "FREE", value: 0, type: "freeShipping", color: "#96CEB4", probability: 10, icon: "package" },
	{ id: "5", label: "5% Off", shortLabel: "5%", value: 5, type: "discount", color: "#FFEAA7", probability: 30, icon: "percent" },
	{ id: "6", label: "200 Points", shortLabel: "200 PTS", value: 200, type: "points", color: "#DDA0DD", probability: 8, icon: "coins" },
	{ id: "7", label: "UGX 5,000 Credit", shortLabel: "5K", value: 5000, type: "credits", color: "#FF9F43", probability: 5, icon: "zap" },
	{ id: "8", label: "Mystery Gift", shortLabel: "GIFT", value: 0, type: "freeItem", color: "#A29BFE", probability: 2, icon: "gift" },
];

const iconMap = {
	gift: Gift,
	star: Star,
	zap: Zap,
	percent: Percent,
	coins: Coins,
	package: Package,
};

interface SpinWheelProps {
	prizes?: Prize[];
	onSpinComplete: (prize: Prize) => void;
	disabled?: boolean;
}

export function SpinWheel({ prizes = defaultPrizes, onSpinComplete, disabled = false }: SpinWheelProps) {
	const [isSpinning, setIsSpinning] = useState(false);
	const [rotation, setRotation] = useState(0);
	const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
	const wheelRef = useRef<HTMLDivElement>(null);

	const selectPrizeByProbability = (): Prize => {
		const totalWeight = prizes.reduce((sum, prize) => sum + prize.probability, 0);
		let random = Math.random() * totalWeight;

		for (const prize of prizes) {
			random -= prize.probability;
			if (random <= 0) {
				return prize;
			}
		}
		return prizes[0];
	};

	const spin = () => {
		if (isSpinning || disabled) return;

		setIsSpinning(true);
		setSelectedPrize(null);

		// Select winning prize based on probability
		const winningPrize = selectPrizeByProbability();
		const prizeIndex = prizes.findIndex(p => p.id === winningPrize.id);

		// Calculate rotation to land on the winning prize
		const segmentAngle = 360 / prizes.length;
		const prizeAngle = prizeIndex * segmentAngle;

		// Add multiple full rotations + offset to land on prize
		// The pointer is at the top (0 degrees), so we need to rotate to bring the prize to the top
		const fullRotations = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
		const targetRotation = fullRotations * 360 + (360 - prizeAngle - segmentAngle / 2);

		setRotation(prev => prev + targetRotation);

		// Wait for animation to complete
		setTimeout(() => {
			setIsSpinning(false);
			setSelectedPrize(winningPrize);
			onSpinComplete(winningPrize);
		}, 5000);
	};

	const segmentAngle = 360 / prizes.length;

	return (
		<div className="flex flex-col items-center">
			{/* Wheel Container */}
			<div className="relative w-80 h-80 md:w-96 md:h-96">
				{/* Outer glow ring */}
				<div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse opacity-50 blur-md" />

				{/* Pointer */}
				<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
					<div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-yellow-400 drop-shadow-lg" />
				</div>

				{/* Wheel */}
				<div
					ref={wheelRef}
					className="absolute inset-2 rounded-full overflow-hidden shadow-2xl border-8 border-yellow-400"
					style={{
						transform: `rotate(${rotation}deg)`,
						transition: isSpinning ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
					}}
				>
					<svg viewBox="0 0 100 100" className="w-full h-full">
						{prizes.map((prize, index) => {
							const startAngle = index * segmentAngle;
							const endAngle = (index + 1) * segmentAngle;
							const startRad = (startAngle - 90) * (Math.PI / 180);
							const endRad = (endAngle - 90) * (Math.PI / 180);

							const x1 = 50 + 50 * Math.cos(startRad);
							const y1 = 50 + 50 * Math.sin(startRad);
							const x2 = 50 + 50 * Math.cos(endRad);
							const y2 = 50 + 50 * Math.sin(endRad);

							const largeArcFlag = segmentAngle > 180 ? 1 : 0;

							const pathD = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

							// Calculate text position (middle of segment)
							const midAngle = (startAngle + endAngle) / 2 - 90;
							const midRad = midAngle * (Math.PI / 180);
							const textX = 50 + 32 * Math.cos(midRad);
							const textY = 50 + 32 * Math.sin(midRad);

							return (
								<g key={prize.id}>
									<path d={pathD} fill={prize.color} stroke="#fff" strokeWidth="0.5" />
									<text
										x={textX}
										y={textY}
										fill="#fff"
										fontSize="5"
										fontWeight="bold"
										textAnchor="middle"
										dominantBaseline="middle"
										transform={`rotate(${(startAngle + endAngle) / 2}, ${textX}, ${textY})`}
										style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
									>
										{prize.shortLabel}
									</text>
								</g>
							);
						})}
					</svg>
				</div>

				{/* Center button */}
				<button
					onClick={spin}
					disabled={isSpinning || disabled}
					className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full z-10 flex items-center justify-center font-black text-white text-lg shadow-xl transition-all ${
						isSpinning || disabled
							? "bg-gray-400 cursor-not-allowed"
							: "bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:scale-105 cursor-pointer"
					}`}
				>
					{isSpinning ? (
						<Sparkles className="animate-spin" size={32} />
					) : (
						"SPIN"
					)}
				</button>
			</div>

			{/* Prize Legend */}
			<div className="mt-6 grid grid-cols-4 gap-2 text-xs">
				{prizes.map((prize) => {
					const IconComponent = iconMap[prize.icon];
					return (
						<div
							key={prize.id}
							className="flex items-center gap-1 px-2 py-1 rounded-full"
							style={{ backgroundColor: `${prize.color}20` }}
						>
							<div
								className="w-3 h-3 rounded-full flex items-center justify-center"
								style={{ backgroundColor: prize.color }}
							>
								<IconComponent size={8} className="text-white" />
							</div>
							<span className="text-gray-700 font-medium truncate">{prize.shortLabel}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
