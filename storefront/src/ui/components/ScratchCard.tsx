"use client";

import { useState, useRef, useEffect } from "react";
import { Gift, Sparkles, RefreshCw } from "lucide-react";

interface Prize {
	id: string;
	label: string;
	value: number;
	type: "points" | "discount" | "freeShipping" | "nothing";
	probability: number;
}

const prizes: Prize[] = [
	{ id: "1", label: "50 Points", value: 50, type: "points", probability: 30 },
	{ id: "2", label: "100 Points", value: 100, type: "points", probability: 20 },
	{ id: "3", label: "5% Off", value: 5, type: "discount", probability: 15 },
	{ id: "4", label: "10% Off", value: 10, type: "discount", probability: 10 },
	{ id: "5", label: "Free Shipping", value: 0, type: "freeShipping", probability: 5 },
	{ id: "6", label: "Try Again", value: 0, type: "nothing", probability: 20 },
];

export function ScratchCard() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isScratching, setIsScratching] = useState(false);
	const [scratchPercent, setScratchPercent] = useState(0);
	const [prize, setPrize] = useState<Prize | null>(null);
	const [revealed, setRevealed] = useState(false);
	const [canPlay, setCanPlay] = useState(true);
	const [cardsLeft, setCardsLeft] = useState(3);

	useEffect(() => {
		// Check daily limit
		const lastPlayDate = localStorage.getItem("scratchCardDate");
		const today = new Date().toDateString();

		if (lastPlayDate === today) {
			const remaining = parseInt(localStorage.getItem("scratchCardsLeft") || "0");
			setCardsLeft(remaining);
			setCanPlay(remaining > 0);
		} else {
			localStorage.setItem("scratchCardDate", today);
			localStorage.setItem("scratchCardsLeft", "3");
			setCardsLeft(3);
			setCanPlay(true);
		}

		initializeCard();
	}, []);

	const selectPrize = (): Prize => {
		const total = prizes.reduce((sum, p) => sum + p.probability, 0);
		let random = Math.random() * total;

		for (const p of prizes) {
			random -= p.probability;
			if (random <= 0) return p;
		}
		return prizes[prizes.length - 1];
	};

	const initializeCard = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set canvas size
		canvas.width = 280;
		canvas.height = 160;

		// Draw scratch surface
		const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
		gradient.addColorStop(0, "#C0C0C0");
		gradient.addColorStop(0.5, "#D4D4D4");
		gradient.addColorStop(1, "#A8A8A8");

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Add texture pattern
		ctx.fillStyle = "#B0B0B0";
		for (let i = 0; i < 50; i++) {
			ctx.fillRect(
				Math.random() * canvas.width,
				Math.random() * canvas.height,
				Math.random() * 10 + 2,
				2
			);
		}

		// Add "SCRATCH HERE" text
		ctx.fillStyle = "#888";
		ctx.font = "bold 18px sans-serif";
		ctx.textAlign = "center";
		ctx.fillText("SCRATCH HERE", canvas.width / 2, canvas.height / 2);

		// Select prize
		setPrize(selectPrize());
	};

	const handleScratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		if (!canPlay || revealed) return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const rect = canvas.getBoundingClientRect();
		let x: number, y: number;

		if ("touches" in e) {
			x = e.touches[0].clientX - rect.left;
			y = e.touches[0].clientY - rect.top;
		} else {
			x = e.clientX - rect.left;
			y = e.clientY - rect.top;
		}

		// Scale coordinates
		x = (x / rect.width) * canvas.width;
		y = (y / rect.height) * canvas.height;

		// Scratch effect
		ctx.globalCompositeOperation = "destination-out";
		ctx.beginPath();
		ctx.arc(x, y, 20, 0, Math.PI * 2);
		ctx.fill();

		// Calculate scratch percentage
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		let scratched = 0;
		for (let i = 3; i < imageData.data.length; i += 4) {
			if (imageData.data[i] === 0) scratched++;
		}
		const percent = (scratched / (canvas.width * canvas.height)) * 100;
		setScratchPercent(percent);

		// Auto-reveal at 50%
		if (percent > 50 && !revealed) {
			revealPrize();
		}
	};

	const revealPrize = () => {
		setRevealed(true);

		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
		}

		// Update cards left
		const remaining = cardsLeft - 1;
		setCardsLeft(remaining);
		localStorage.setItem("scratchCardsLeft", String(remaining));

		if (remaining <= 0) {
			setCanPlay(false);
		}

		// Award prize
		if (prize && prize.type !== "nothing") {
			if (prize.type === "points") {
				const currentPoints = parseInt(localStorage.getItem("userPoints") || "0");
				localStorage.setItem("userPoints", String(currentPoints + prize.value));
			}

			// Save won prize
			const wonPrizes = JSON.parse(localStorage.getItem("scratchWins") || "[]");
			wonPrizes.push({
				...prize,
				wonAt: new Date().toISOString(),
			});
			localStorage.setItem("scratchWins", JSON.stringify(wonPrizes));
		}
	};

	const resetCard = () => {
		if (!canPlay) return;
		setRevealed(false);
		setScratchPercent(0);
		initializeCard();
	};

	return (
		<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
			{/* Header */}
			<div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Gift size={28} />
						<div>
							<h2 className="text-xl font-black">Scratch & Win</h2>
							<p className="text-green-100 text-sm">Scratch to reveal your prize!</p>
						</div>
					</div>
					<div className="bg-white/20 px-4 py-2 rounded-full">
						<span className="font-bold">{cardsLeft} cards left</span>
					</div>
				</div>
			</div>

			{/* Scratch Area */}
			<div className="p-6">
				<div className="relative mx-auto w-[280px] h-[160px] rounded-xl overflow-hidden shadow-lg border-4 border-yellow-400">
					{/* Prize Background */}
					<div className={`absolute inset-0 flex items-center justify-center ${
						prize?.type === "nothing" ? "bg-gray-100" : "bg-gradient-to-br from-yellow-100 to-orange-100"
					}`}>
						{prize && (
							<div className="text-center">
								<Sparkles className={`mx-auto mb-2 ${
									prize.type === "nothing" ? "text-gray-400" : "text-yellow-500"
								}`} size={32} />
								<div className={`text-2xl font-black ${
									prize.type === "nothing" ? "text-gray-500" : "text-orange-600"
								}`}>
									{prize.label}
								</div>
								{prize.type !== "nothing" && (
									<p className="text-sm text-orange-500 mt-1">Congratulations!</p>
								)}
							</div>
						)}
					</div>

					{/* Canvas Overlay */}
					<canvas
						ref={canvasRef}
						className="absolute inset-0 cursor-pointer touch-none"
						onMouseDown={() => setIsScratching(true)}
						onMouseUp={() => setIsScratching(false)}
						onMouseLeave={() => setIsScratching(false)}
						onMouseMove={(e) => isScratching && handleScratch(e)}
						onTouchStart={() => setIsScratching(true)}
						onTouchEnd={() => setIsScratching(false)}
						onTouchMove={handleScratch}
					/>
				</div>

				{/* Progress */}
				{!revealed && (
					<div className="mt-4">
						<div className="flex justify-between text-sm text-gray-500 mb-1">
							<span>Scratch progress</span>
							<span>{Math.round(scratchPercent)}%</span>
						</div>
						<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all"
								style={{ width: `${scratchPercent}%` }}
							/>
						</div>
					</div>
				)}

				{/* New Card Button */}
				{revealed && canPlay && (
					<button
						onClick={resetCard}
						className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all"
					>
						<RefreshCw size={20} />
						Get New Card ({cardsLeft} left)
					</button>
				)}

				{/* No Cards Left */}
				{!canPlay && (
					<div className="mt-6 text-center p-4 bg-gray-100 rounded-xl">
						<p className="text-gray-600">
							No more cards today! Come back tomorrow for 3 new scratch cards.
						</p>
					</div>
				)}
			</div>

			{/* Instructions */}
			<div className="bg-gray-50 p-4 border-t">
				<p className="text-sm text-gray-500 text-center">
					Scratch the silver area to reveal your prize. 3 free cards per day!
				</p>
			</div>
		</div>
	);
}
