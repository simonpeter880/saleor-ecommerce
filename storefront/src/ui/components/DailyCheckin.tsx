"use client";

import { useState, useEffect } from "react";
import { Calendar, Gift, Star, Zap, Crown, Check, Lock, Flame } from "lucide-react";

interface DayReward {
	day: number;
	points: number;
	bonus?: string;
	icon: "gift" | "star" | "zap" | "crown";
}

const weeklyRewards: DayReward[] = [
	{ day: 1, points: 10, icon: "gift" },
	{ day: 2, points: 15, icon: "star" },
	{ day: 3, points: 20, icon: "gift" },
	{ day: 4, points: 25, icon: "star" },
	{ day: 5, points: 30, icon: "zap" },
	{ day: 6, points: 40, icon: "zap" },
	{ day: 7, points: 100, bonus: "5% Off Coupon", icon: "crown" },
];

const iconMap = {
	gift: Gift,
	star: Star,
	zap: Zap,
	crown: Crown,
};

interface CheckinData {
	lastCheckinDate: string;
	currentStreak: number;
	longestStreak: number;
	totalCheckins: number;
	weekProgress: number[]; // Days checked in this week (1-7)
	weekStartDate: string;
}

export function DailyCheckin() {
	const [checkinData, setCheckinData] = useState<CheckinData | null>(null);
	const [canCheckin, setCanCheckin] = useState(false);
	const [justCheckedIn, setJustCheckedIn] = useState(false);
	const [earnedReward, setEarnedReward] = useState<DayReward | null>(null);

	useEffect(() => {
		loadCheckinData();
	}, []);

	const loadCheckinData = () => {
		const stored = localStorage.getItem("dailyCheckin");
		const today = new Date().toDateString();

		if (stored) {
			const data: CheckinData = JSON.parse(stored);

			// Check if we need to reset the week
			const weekStart = getWeekStartDate();
			if (data.weekStartDate !== weekStart) {
				// New week, reset progress
				data.weekProgress = [];
				data.weekStartDate = weekStart;
			}

			// Check if user already checked in today
			const alreadyCheckedIn = data.lastCheckinDate === today;
			setCanCheckin(!alreadyCheckedIn);

			// Check if streak is broken (missed a day)
			if (!alreadyCheckedIn && data.lastCheckinDate) {
				const lastDate = new Date(data.lastCheckinDate);
				const todayDate = new Date(today);
				const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

				if (diffDays > 1) {
					// Streak broken
					data.currentStreak = 0;
				}
			}

			setCheckinData(data);
		} else {
			// First time user
			const newData: CheckinData = {
				lastCheckinDate: "",
				currentStreak: 0,
				longestStreak: 0,
				totalCheckins: 0,
				weekProgress: [],
				weekStartDate: getWeekStartDate(),
			};
			setCheckinData(newData);
			setCanCheckin(true);
		}
	};

	const getWeekStartDate = (): string => {
		const now = new Date();
		const dayOfWeek = now.getDay();
		const startOfWeek = new Date(now);
		startOfWeek.setDate(now.getDate() - dayOfWeek);
		return startOfWeek.toDateString();
	};

	const getCurrentDayOfWeek = (): number => {
		return new Date().getDay() || 7; // 1-7, where 7 is Sunday
	};

	const handleCheckin = () => {
		if (!canCheckin || !checkinData) return;

		const today = new Date().toDateString();
		const currentDay = getCurrentDayOfWeek();
		const reward = weeklyRewards[currentDay - 1];

		const newData: CheckinData = {
			...checkinData,
			lastCheckinDate: today,
			currentStreak: checkinData.currentStreak + 1,
			longestStreak: Math.max(checkinData.longestStreak, checkinData.currentStreak + 1),
			totalCheckins: checkinData.totalCheckins + 1,
			weekProgress: [...checkinData.weekProgress, currentDay],
		};

		localStorage.setItem("dailyCheckin", JSON.stringify(newData));

		// Add points to rewards
		const currentPoints = parseInt(localStorage.getItem("userPoints") || "0");
		localStorage.setItem("userPoints", String(currentPoints + reward.points));

		// If it's day 7 and completed the week, generate a coupon
		if (currentDay === 7 && reward.bonus) {
			const coupons = JSON.parse(localStorage.getItem("userCoupons") || "[]");
			coupons.push({
				code: `WEEK${Date.now().toString(36).toUpperCase()}`,
				discount: "5%",
				expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
				source: "Weekly Check-in Bonus",
			});
			localStorage.setItem("userCoupons", JSON.stringify(coupons));
		}

		setCheckinData(newData);
		setCanCheckin(false);
		setJustCheckedIn(true);
		setEarnedReward(reward);

		// Reset animation after delay
		setTimeout(() => {
			setJustCheckedIn(false);
			setEarnedReward(null);
		}, 3000);
	};

	if (!checkinData) return null;

	const currentDay = getCurrentDayOfWeek();

	return (
		<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
			{/* Header */}
			<div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Calendar size={28} />
						<div>
							<h2 className="text-xl font-black">Daily Check-in</h2>
							<p className="text-blue-100 text-sm">Check in daily to earn rewards!</p>
						</div>
					</div>

					{/* Streak Counter */}
					<div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
						<Flame className="text-orange-300" size={20} />
						<span className="font-bold">{checkinData.currentStreak} day streak</span>
					</div>
				</div>
			</div>

			{/* Weekly Calendar */}
			<div className="p-6">
				<div className="grid grid-cols-7 gap-2 mb-6">
					{weeklyRewards.map((reward) => {
						const IconComponent = iconMap[reward.icon];
						const isCheckedIn = checkinData.weekProgress.includes(reward.day);
						const isToday = reward.day === currentDay;
						const isPast = reward.day < currentDay && !isCheckedIn;
						const isFuture = reward.day > currentDay;

						return (
							<div
								key={reward.day}
								className={`relative flex flex-col items-center p-3 rounded-xl transition-all ${
									isCheckedIn
										? "bg-green-100 border-2 border-green-500"
										: isToday
											? "bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-purple-500 shadow-lg"
											: isPast
												? "bg-gray-100 border-2 border-gray-300"
												: "bg-gray-50 border-2 border-gray-200"
								}`}
							>
								{/* Day label */}
								<span className={`text-xs font-bold mb-1 ${isToday ? "text-purple-600" : "text-gray-500"}`}>
									Day {reward.day}
								</span>

								{/* Icon */}
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
										isCheckedIn
											? "bg-green-500 text-white"
											: isToday
												? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
												: isPast
													? "bg-gray-300 text-gray-500"
													: "bg-gray-200 text-gray-400"
									}`}
								>
									{isCheckedIn ? (
										<Check size={20} />
									) : isFuture ? (
										<Lock size={16} />
									) : (
										<IconComponent size={18} />
									)}
								</div>

								{/* Points */}
								<span
									className={`text-sm font-bold ${
										isCheckedIn ? "text-green-600" : isToday ? "text-purple-600" : "text-gray-500"
									}`}
								>
									+{reward.points}
								</span>

								{/* Bonus badge for day 7 */}
								{reward.bonus && (
									<div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
										BONUS
									</div>
								)}

								{/* Today indicator */}
								{isToday && !isCheckedIn && (
									<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
								)}
							</div>
						);
					})}
				</div>

				{/* Check-in Button */}
				<div className="text-center">
					{justCheckedIn && earnedReward ? (
						<div className="animate-bounce-in">
							<div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold">
								<Check size={20} />
								You earned {earnedReward.points} points!
								{earnedReward.bonus && <span className="text-yellow-600"> + {earnedReward.bonus}</span>}
							</div>
						</div>
					) : canCheckin ? (
						<button
							onClick={handleCheckin}
							className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
						>
							Check In Now (+{weeklyRewards[currentDay - 1].points} pts)
						</button>
					) : (
						<div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 px-6 py-3 rounded-full font-medium">
							<Check size={20} className="text-green-500" />
							Already checked in today! Come back tomorrow.
						</div>
					)}
				</div>

				{/* Stats */}
				<div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
					<div className="text-center">
						<div className="text-2xl font-black text-blue-600">{checkinData.currentStreak}</div>
						<div className="text-xs text-gray-500">Current Streak</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-black text-purple-600">{checkinData.longestStreak}</div>
						<div className="text-xs text-gray-500">Longest Streak</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-black text-green-600">{checkinData.totalCheckins}</div>
						<div className="text-xs text-gray-500">Total Check-ins</div>
					</div>
				</div>
			</div>

			{/* Rewards Info */}
			<div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-4 border-t">
				<div className="flex items-center gap-2 text-sm text-orange-700">
					<Gift size={16} />
					<span>
						<strong>Tip:</strong> Check in for 7 consecutive days to earn a bonus 5% off coupon!
					</span>
				</div>
			</div>
		</div>
	);
}
