"use client";

import { useState } from "react";
import { Gamepad2, Coins, Target, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CoinFlipGame } from "./CoinFlipGame";
import { ScratchCard } from "./ScratchCard";

type GameType = "coin-flip" | "scratch-card" | null;

export function MiniGamesPage({ channel }: { channel: string }) {
	const [activeGame, setActiveGame] = useState<GameType>(null);

	const games = [
		{
			id: "coin-flip",
			title: "Coin Flip",
			description: "Double or nothing! Bet your points and flip the coin.",
			icon: <Coins size={32} />,
			color: "from-yellow-500 to-orange-500",
		},
		{
			id: "scratch-card",
			title: "Scratch & Win",
			description: "Scratch cards to reveal hidden prizes. 3 free cards daily!",
			icon: <Target size={32} />,
			color: "from-green-500 to-teal-500",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
			{/* Hero Section */}
			<div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<div className="flex items-center justify-center gap-3 mb-4">
						<Gamepad2 size={40} className="animate-bounce" />
						<h1 className="text-4xl font-black">Mini Games</h1>
					</div>
					<p className="text-purple-100 text-lg max-w-xl mx-auto">
						Play fun mini games to earn extra points and prizes!
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-4xl mx-auto px-4 py-12">
				{!activeGame ? (
					/* Game Selection */
					<>
						<h2 className="text-2xl font-black text-gray-800 mb-6">Choose a Game</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{games.map((game) => (
								<button
									key={game.id}
									onClick={() => setActiveGame(game.id as GameType)}
									className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 text-left"
								>
									<div className={`bg-gradient-to-br ${game.color} p-8 text-white`}>
										<div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
											{game.icon}
										</div>
										<h3 className="text-xl font-black text-center">{game.title}</h3>
									</div>
									<div className="p-4 text-center">
										<p className="text-gray-500">{game.description}</p>
										<div className={`mt-4 bg-gradient-to-r ${game.color} text-white font-semibold py-2 px-6 rounded-lg inline-block`}>
											Play Now
										</div>
									</div>
								</button>
							))}
						</div>

						{/* Back to Games Hub */}
						<div className="mt-12 text-center">
							<Link
								href={`/${channel}/games`}
								className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700"
							>
								<ArrowLeft size={20} />
								Back to Games Hub
							</Link>
						</div>
					</>
				) : (
					/* Active Game */
					<>
						<button
							onClick={() => setActiveGame(null)}
							className="flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 mb-6"
						>
							<ArrowLeft size={20} />
							Back to Games
						</button>

						{activeGame === "coin-flip" && <CoinFlipGame />}
						{activeGame === "scratch-card" && <ScratchCard />}
					</>
				)}
			</div>
		</div>
	);
}
