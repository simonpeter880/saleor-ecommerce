"use client";

import { useState, useEffect } from "react";
import { Calendar, Gift, Trophy, Flame, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { DailyCheckin } from "./DailyCheckin";

interface StreakMilestone {
	days: number;
	reward: string;
	icon: React.ReactNode;
	achieved: boolean;
}

export function DailyCheckinPage({ channel }: { channel: string }) {
	const [totalPoints, setTotalPoints] = useState(0);
	const [currentStreak, setCurrentStreak] = useState(0);

	useEffect(() => {
		const points = parseInt(localStorage.getItem("userPoints") || "0");
		setTotalPoints(points);

		const checkinData = localStorage.getItem("dailyCheckin");
		if (checkinData) {
			const data = JSON.parse(checkinData);
			setCurrentStreak(data.currentStreak || 0);
		}
	}, []);

	const milestones: StreakMilestone[] = [
		{ days: 3, reward: "50 Bonus Points", icon: <Star className="text-yellow-500" size={20} />, achieved: currentStreak >= 3 },
		{ days: 7, reward: "5% Off Coupon", icon: <Gift className="text-green-500" size={20} />, achieved: currentStreak >= 7 },
		{ days: 14, reward: "Free Shipping", icon: <Trophy className="text-blue-500" size={20} />, achieved: currentStreak >= 14 },
		{ days: 30, reward: "10% Off Coupon", icon: <Flame className="text-orange-500" size={20} />, achieved: currentStreak >= 30 },
	];

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
			{/* Hero Section */}
			<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<div className="flex items-center justify-center gap-3 mb-4">
						<Calendar size={40} className="animate-bounce" />
						<h1 className="text-4xl font-black">Daily Check-in</h1>
					</div>
					<p className="text-blue-100 text-lg max-w-xl mx-auto">
						Check in every day to earn points, maintain your streak, and unlock exclusive rewards!
					</p>

					{/* Points Display */}
					<div className="mt-6 inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
						<div className="flex items-center gap-2">
							<Star className="text-yellow-300" size={24} />
							<span className="font-bold text-xl">{totalPoints}</span>
							<span className="text-blue-200">points</span>
						</div>
						<div className="w-px h-6 bg-white/30" />
						<div className="flex items-center gap-2">
							<Flame className="text-orange-300" size={24} />
							<span className="font-bold text-xl">{currentStreak}</span>
							<span className="text-blue-200">day streak</span>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-4xl mx-auto px-4 py-12">
				{/* Daily Check-in Card */}
				<DailyCheckin />

				{/* Streak Milestones */}
				<div className="mt-12">
					<h2 className="text-2xl font-black text-gray-800 mb-6">Streak Milestones</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{milestones.map((milestone) => (
							<div
								key={milestone.days}
								className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
									milestone.achieved
										? "bg-green-50 border-green-300"
										: currentStreak > 0 && currentStreak < milestone.days
											? "bg-white border-blue-300"
											: "bg-gray-50 border-gray-200"
								}`}
							>
								<div
									className={`w-12 h-12 rounded-full flex items-center justify-center ${
										milestone.achieved
											? "bg-green-500 text-white"
											: "bg-gray-200 text-gray-500"
									}`}
								>
									{milestone.achieved ? (
										<Trophy size={24} />
									) : (
										<span className="font-bold">{milestone.days}</span>
									)}
								</div>

								<div className="flex-1">
									<div className="flex items-center gap-2">
										{milestone.icon}
										<span className="font-bold text-gray-800">{milestone.days} Day Streak</span>
									</div>
									<p className="text-sm text-gray-500">{milestone.reward}</p>
								</div>

								{milestone.achieved && (
									<span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
										Claimed!
									</span>
								)}

								{!milestone.achieved && currentStreak > 0 && (
									<span className="text-xs text-gray-400">
										{milestone.days - currentStreak} days left
									</span>
								)}
							</div>
						))}
					</div>
				</div>

				{/* How It Works */}
				<div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
					<h2 className="text-2xl font-black text-gray-800 mb-6">How It Works</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
								<Calendar className="text-blue-600" size={28} />
							</div>
							<h3 className="font-bold text-gray-800 mb-2">1. Check In Daily</h3>
							<p className="text-sm text-gray-500">
								Visit this page every day and tap the check-in button to earn points.
							</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
								<Flame className="text-purple-600" size={28} />
							</div>
							<h3 className="font-bold text-gray-800 mb-2">2. Build Your Streak</h3>
							<p className="text-sm text-gray-500">
								Don't miss a day! Consecutive check-ins earn bonus rewards.
							</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
								<Gift className="text-green-600" size={28} />
							</div>
							<h3 className="font-bold text-gray-800 mb-2">3. Earn Rewards</h3>
							<p className="text-sm text-gray-500">
								Use your points for discounts, free shipping, and exclusive deals.
							</p>
						</div>
					</div>
				</div>

				{/* CTA */}
				<div className="mt-12 text-center">
					<Link
						href={`/${channel}/games`}
						className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
					>
						Explore More Games
						<ArrowRight size={20} />
					</Link>
				</div>
			</div>
		</div>
	);
}
