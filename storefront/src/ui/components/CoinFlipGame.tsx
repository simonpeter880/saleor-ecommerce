"use client";

import { useState, useEffect } from "react";
import { Coins, TrendingUp, TrendingDown, Trophy, AlertCircle } from "lucide-react";

interface CoinFlipGameProps {
	onWin?: (points: number) => void;
	onLose?: (points: number) => void;
}

export function CoinFlipGame({ onWin, onLose }: CoinFlipGameProps) {
	const [userPoints, setUserPoints] = useState(0);
	const [betAmount, setBetAmount] = useState(10);
	const [selectedSide, setSelectedSide] = useState<"heads" | "tails" | null>(null);
	const [isFlipping, setIsFlipping] = useState(false);
	const [result, setResult] = useState<"heads" | "tails" | null>(null);
	const [won, setWon] = useState<boolean | null>(null);
	const [streak, setStreak] = useState(0);
	const [totalWins, setTotalWins] = useState(0);
	const [totalLosses, setTotalLosses] = useState(0);

	useEffect(() => {
		// Load user points
		const points = parseInt(localStorage.getItem("userPoints") || "100");
		setUserPoints(points);

		// Load game stats
		const stats = JSON.parse(localStorage.getItem("coinFlipStats") || "{}");
		setStreak(stats.streak || 0);
		setTotalWins(stats.wins || 0);
		setTotalLosses(stats.losses || 0);
	}, []);

	const flipCoin = () => {
		if (!selectedSide || isFlipping || betAmount > userPoints || betAmount < 5) return;

		setIsFlipping(true);
		setResult(null);
		setWon(null);

		// Determine result (50/50 chance)
		const coinResult = Math.random() < 0.5 ? "heads" : "tails";

		// Animate for 2 seconds
		setTimeout(() => {
			setResult(coinResult);
			const didWin = coinResult === selectedSide;
			setWon(didWin);
			setIsFlipping(false);

			// Update points
			let newPoints: number;
			let newStreak: number;
			let newWins = totalWins;
			let newLosses = totalLosses;

			if (didWin) {
				newPoints = userPoints + betAmount;
				newStreak = streak + 1;
				newWins++;
				onWin?.(betAmount);
			} else {
				newPoints = userPoints - betAmount;
				newStreak = 0;
				newLosses++;
				onLose?.(betAmount);
			}

			setUserPoints(newPoints);
			setStreak(newStreak);
			setTotalWins(newWins);
			setTotalLosses(newLosses);

			// Save to localStorage
			localStorage.setItem("userPoints", String(newPoints));
			localStorage.setItem("coinFlipStats", JSON.stringify({
				streak: newStreak,
				wins: newWins,
				losses: newLosses,
			}));

			// Reset selection after a delay
			setTimeout(() => {
				setSelectedSide(null);
				setResult(null);
				setWon(null);
			}, 3000);
		}, 2000);
	};

	const betOptions = [5, 10, 25, 50, 100];

	return (
		<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
			{/* Header */}
			<div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Coins size={28} />
						<div>
							<h2 className="text-xl font-black">Coin Flip</h2>
							<p className="text-yellow-100 text-sm">Double or nothing!</p>
						</div>
					</div>
					<div className="bg-white/20 px-4 py-2 rounded-full">
						<span className="font-bold">{userPoints} pts</span>
					</div>
				</div>
			</div>

			{/* Game Area */}
			<div className="p-6">
				{/* Coin */}
				<div className="flex justify-center mb-8">
					<div
						className={`relative w-32 h-32 rounded-full shadow-xl ${
							isFlipping ? "animate-coin-flip" : ""
						}`}
						style={{
							transformStyle: "preserve-3d",
							background: result === "heads"
								? "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
								: result === "tails"
									? "linear-gradient(135deg, #C0C0C0 0%, #808080 100%)"
									: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
						}}
					>
						<div className="absolute inset-0 flex items-center justify-center">
							{!isFlipping && result && (
								<span className="text-3xl font-black text-white drop-shadow-lg">
									{result === "heads" ? "H" : "T"}
								</span>
							)}
							{!isFlipping && !result && (
								<span className="text-2xl font-bold text-white/80">?</span>
							)}
							{isFlipping && (
								<Coins className="text-white animate-spin" size={48} />
							)}
						</div>
					</div>
				</div>

				{/* Result Display */}
				{won !== null && (
					<div className={`text-center mb-6 p-4 rounded-xl ${
						won ? "bg-green-100" : "bg-red-100"
					}`}>
						<div className="flex items-center justify-center gap-2">
							{won ? (
								<>
									<TrendingUp className="text-green-600" size={24} />
									<span className="text-xl font-black text-green-600">
										You Won +{betAmount} points!
									</span>
								</>
							) : (
								<>
									<TrendingDown className="text-red-600" size={24} />
									<span className="text-xl font-black text-red-600">
										You Lost -{betAmount} points
									</span>
								</>
							)}
						</div>
					</div>
				)}

				{/* Side Selection */}
				<div className="mb-6">
					<label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
						Choose your side:
					</label>
					<div className="flex gap-4 justify-center">
						<button
							onClick={() => setSelectedSide("heads")}
							disabled={isFlipping}
							className={`flex-1 max-w-32 py-4 rounded-xl font-bold text-lg transition-all ${
								selectedSide === "heads"
									? "bg-yellow-500 text-white ring-4 ring-yellow-300"
									: "bg-gray-100 text-gray-700 hover:bg-yellow-100"
							} ${isFlipping ? "opacity-50 cursor-not-allowed" : ""}`}
						>
							Heads
						</button>
						<button
							onClick={() => setSelectedSide("tails")}
							disabled={isFlipping}
							className={`flex-1 max-w-32 py-4 rounded-xl font-bold text-lg transition-all ${
								selectedSide === "tails"
									? "bg-gray-500 text-white ring-4 ring-gray-300"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							} ${isFlipping ? "opacity-50 cursor-not-allowed" : ""}`}
						>
							Tails
						</button>
					</div>
				</div>

				{/* Bet Amount */}
				<div className="mb-6">
					<label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
						Bet amount:
					</label>
					<div className="flex gap-2 justify-center flex-wrap">
						{betOptions.map((amount) => (
							<button
								key={amount}
								onClick={() => setBetAmount(amount)}
								disabled={isFlipping || amount > userPoints}
								className={`px-4 py-2 rounded-lg font-semibold transition-all ${
									betAmount === amount
										? "bg-orange-500 text-white"
										: amount > userPoints
											? "bg-gray-100 text-gray-400 cursor-not-allowed"
											: "bg-gray-100 text-gray-700 hover:bg-orange-100"
								}`}
							>
								{amount}
							</button>
						))}
					</div>
				</div>

				{/* Low Points Warning */}
				{userPoints < 5 && (
					<div className="mb-6 p-4 bg-red-50 rounded-xl flex items-center gap-3">
						<AlertCircle className="text-red-500" size={20} />
						<p className="text-sm text-red-700">
							Not enough points to play. Earn more through daily check-ins or the spin wheel!
						</p>
					</div>
				)}

				{/* Flip Button */}
				<button
					onClick={flipCoin}
					disabled={!selectedSide || isFlipping || betAmount > userPoints || userPoints < 5}
					className={`w-full py-4 rounded-xl font-black text-lg transition-all ${
						!selectedSide || isFlipping || betAmount > userPoints || userPoints < 5
							? "bg-gray-300 text-gray-500 cursor-not-allowed"
							: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl"
					}`}
				>
					{isFlipping ? "Flipping..." : `Flip for ${betAmount} points`}
				</button>
			</div>

			{/* Stats */}
			<div className="bg-gray-50 p-4 border-t">
				<div className="grid grid-cols-3 gap-4 text-center">
					<div>
						<div className="text-xl font-black text-green-600">{totalWins}</div>
						<div className="text-xs text-gray-500">Wins</div>
					</div>
					<div>
						<div className="text-xl font-black text-red-600">{totalLosses}</div>
						<div className="text-xs text-gray-500">Losses</div>
					</div>
					<div>
						<div className="flex items-center justify-center gap-1">
							<Trophy className="text-yellow-500" size={16} />
							<span className="text-xl font-black text-yellow-600">{streak}</span>
						</div>
						<div className="text-xs text-gray-500">Streak</div>
					</div>
				</div>
			</div>

			{/* CSS for coin flip animation */}
			<style jsx>{`
				@keyframes coinFlip {
					0% { transform: rotateY(0deg); }
					25% { transform: rotateY(360deg); }
					50% { transform: rotateY(720deg); }
					75% { transform: rotateY(1080deg); }
					100% { transform: rotateY(1440deg); }
				}
				.animate-coin-flip {
					animation: coinFlip 2s ease-out;
				}
			`}</style>
		</div>
	);
}
