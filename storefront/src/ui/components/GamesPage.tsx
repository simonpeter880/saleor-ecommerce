"use client";

import { useState, useEffect } from "react";
import { Gift, Star, Trophy, Clock, Coins, Target, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { SpinWheelModal } from "./SpinWheelModal";
import { Prize } from "./SpinWheel";

interface GameCard {
	id: string;
	title: string;
	description: string;
	icon: React.ReactNode;
	color: string;
	available: boolean;
	action: () => void;
	href?: string;
	badge?: string;
}

export function GamesPage({ channel }: { channel: string }) {
	const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
	const [canSpin, setCanSpin] = useState(false);
	const [wonPrizes, setWonPrizes] = useState<Prize[]>([]);
	const [totalPoints, setTotalPoints] = useState(0);

	useEffect(() => {
		// Check spin availability
		const lastSpinDate = localStorage.getItem("lastSpinDate");
		const today = new Date().toDateString();
		setCanSpin(lastSpinDate !== today);

		// Load won prizes
		const prizes = JSON.parse(localStorage.getItem("wonPrizes") || "[]");
		setWonPrizes(prizes);

		// Calculate total points from prizes
		const points = prizes
			.filter((p: Prize) => p.type === "points")
			.reduce((sum: number, p: Prize) => sum + p.value, 0);
		setTotalPoints(points);
	}, [isSpinWheelOpen]);

	const handlePrizeClaimed = (prize: Prize) => {
		console.log("Prize claimed:", prize);
	};

	const games: GameCard[] = [
		{
			id: "spin-wheel",
			title: "Lucky Wheel",
			description: "Spin to win coupons, points, and free shipping!",
			icon: <Gift size={32} />,
			color: "from-orange-500 to-red-500",
			available: true,
			action: () => setIsSpinWheelOpen(true),
			badge: canSpin ? "Free Spin!" : undefined,
		},
		{
			id: "daily-checkin",
			title: "Daily Check-in",
			description: "Log in daily to earn bonus points and rewards.",
			icon: <Calendar size={32} />,
			color: "from-blue-500 to-purple-500",
			available: true,
			action: () => {},
			href: `/${channel}/checkin`,
			badge: "New!",
		},
		{
			id: "coin-flip",
			title: "Coin Flip",
			description: "Double or nothing! Flip coins to multiply your points.",
			icon: <Coins size={32} />,
			color: "from-yellow-500 to-orange-500",
			available: true,
			action: () => {},
			href: `/${channel}/minigames`,
			badge: "New!",
		},
		{
			id: "scratch-card",
			title: "Scratch & Win",
			description: "Scratch cards to reveal hidden prizes.",
			icon: <Target size={32} />,
			color: "from-green-500 to-teal-500",
			available: true,
			action: () => {},
			href: `/${channel}/minigames`,
			badge: "New!",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
			{/* Hero Section */}
			<div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12 px-4">
				<div className="max-w-6xl mx-auto text-center">
					<div className="flex items-center justify-center gap-3 mb-4">
						<Trophy size={40} className="animate-bounce" />
						<h1 className="text-4xl font-black">Games & Rewards</h1>
						<Trophy size={40} className="animate-bounce" />
					</div>
					<p className="text-orange-100 text-lg max-w-2xl mx-auto">
						Play games to win amazing prizes, coupons, and rewards. The more you play, the more you win!
					</p>
				</div>
			</div>

			{/* Stats Bar */}
			<div className="bg-white shadow-md border-b">
				<div className="max-w-6xl mx-auto px-4 py-4">
					<div className="flex flex-wrap justify-center gap-8">
						<div className="text-center">
							<div className="flex items-center gap-2 text-orange-500">
								<Star size={24} />
								<span className="text-2xl font-black">{totalPoints}</span>
							</div>
							<p className="text-sm text-gray-500">Points Earned</p>
						</div>
						<div className="text-center">
							<div className="flex items-center gap-2 text-green-500">
								<Gift size={24} />
								<span className="text-2xl font-black">{wonPrizes.length}</span>
							</div>
							<p className="text-sm text-gray-500">Prizes Won</p>
						</div>
						<div className="text-center">
							<div className="flex items-center gap-2 text-blue-500">
								<Clock size={24} />
								<span className="text-2xl font-black">{canSpin ? 1 : 0}</span>
							</div>
							<p className="text-sm text-gray-500">Free Spins</p>
						</div>
					</div>
				</div>
			</div>

			{/* Games Grid */}
			<div className="max-w-6xl mx-auto px-4 py-12">
				<h2 className="text-2xl font-black text-gray-800 mb-6">Available Games</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{games.map((game) => {
						const CardContent = (
							<>
								{/* Badge */}
								{game.badge && (
									<div
										className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded-full z-10 ${
											game.badge === "Coming Soon"
												? "bg-gray-200 text-gray-600"
												: "bg-green-500 text-white animate-pulse"
										}`}
									>
										{game.badge}
									</div>
								)}

								{/* Icon */}
								<div className={`bg-gradient-to-br ${game.color} p-6 text-white`}>
									<div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
										{game.icon}
									</div>
								</div>

								{/* Content */}
								<div className="p-4 text-center">
									<h3 className="font-bold text-gray-800 mb-1">{game.title}</h3>
									<p className="text-sm text-gray-500">{game.description}</p>

									{game.available && (
										<div
											className={`mt-4 w-full bg-gradient-to-r ${game.color} text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity`}
										>
											Play Now
										</div>
									)}
								</div>
							</>
						);

						if (game.href && game.available) {
							return (
								<Link
									key={game.id}
									href={game.href}
									className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer block"
								>
									{CardContent}
								</Link>
							);
						}

						return (
							<div
								key={game.id}
								className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all ${
									game.available
										? "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
										: "opacity-75"
								}`}
								onClick={game.available ? game.action : undefined}
							>
								{CardContent}
							</div>
						);
					})}
				</div>
			</div>

			{/* Recent Prizes */}
			{wonPrizes.length > 0 && (
				<div className="max-w-6xl mx-auto px-4 pb-12">
					<h2 className="text-2xl font-black text-gray-800 mb-6">Your Recent Prizes</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{wonPrizes.slice(-6).reverse().map((prize: any, index) => (
							<div
								key={index}
								className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4"
							>
								<div
									className="w-12 h-12 rounded-full flex items-center justify-center text-white"
									style={{ backgroundColor: prize.color }}
								>
									<Gift size={24} />
								</div>
								<div className="flex-1">
									<p className="font-bold text-gray-800">{prize.label}</p>
									<p className="text-sm text-gray-500">
										Won {new Date(prize.wonAt).toLocaleDateString()}
									</p>
								</div>
								{!prize.claimed && (
									<span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
										Active
									</span>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{/* How to Earn More */}
			<div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-12 px-4">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-2xl font-black text-center mb-8">Earn More Rewards</h2>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						<div className="text-center">
							<div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
								<Gift size={28} />
							</div>
							<h3 className="font-bold mb-1">Daily Spins</h3>
							<p className="text-sm text-blue-100">Come back daily for free spins</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
								<Star size={28} />
							</div>
							<h3 className="font-bold mb-1">Write Reviews</h3>
							<p className="text-sm text-blue-100">50 points per product review</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
								<Users size={28} />
							</div>
							<h3 className="font-bold mb-1">Refer Friends</h3>
							<p className="text-sm text-blue-100">500 points per referral</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
								<Coins size={28} />
							</div>
							<h3 className="font-bold mb-1">Shop & Earn</h3>
							<p className="text-sm text-blue-100">1 point per UGX 1,000 spent</p>
						</div>
					</div>

					<div className="text-center mt-8">
						<Link
							href={`/${channel}/account/rewards`}
							className="inline-block bg-white text-purple-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors"
						>
							View All Rewards
						</Link>
					</div>
				</div>
			</div>

			{/* Spin Wheel Modal */}
			<SpinWheelModal
				isOpen={isSpinWheelOpen}
				onClose={() => setIsSpinWheelOpen(false)}
				onPrizeClaimed={handlePrizeClaimed}
			/>
		</div>
	);
}
