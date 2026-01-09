"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
	endDate: string;
	onExpire?: () => void;
	size?: "sm" | "md" | "lg";
}

interface TimeLeft {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	total: number;
}

function calculateTimeLeft(endDate: string): TimeLeft {
	const difference = new Date(endDate).getTime() - new Date().getTime();

	if (difference <= 0) {
		return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
	}

	return {
		days: Math.floor(difference / (1000 * 60 * 60 * 24)),
		hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
		minutes: Math.floor((difference / 1000 / 60) % 60),
		seconds: Math.floor((difference / 1000) % 60),
		total: difference,
	};
}

interface TimeUnitProps {
	value: number;
	label: string;
	size: "sm" | "md" | "lg";
}

function TimeUnit({ value, label, size }: TimeUnitProps) {
	const sizeClasses = {
		sm: "min-w-[40px] px-1.5 py-1 text-sm",
		md: "min-w-[50px] px-2 py-2 text-lg",
		lg: "min-w-[60px] px-3 py-3 text-2xl",
	};

	const labelClasses = {
		sm: "text-[10px]",
		md: "text-xs",
		lg: "text-sm",
	};

	return (
		<div className="flex flex-col items-center">
			<div
				className={`rounded-lg bg-gray-900 font-bold text-white ${sizeClasses[size]}`}
			>
				{value.toString().padStart(2, "0")}
			</div>
			<span className={`mt-1 font-medium text-gray-600 ${labelClasses[size]}`}>
				{label}
			</span>
		</div>
	);
}

export function CountdownTimer({
	endDate,
	onExpire,
	size = "md",
}: CountdownTimerProps) {
	const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(endDate));
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			const newTimeLeft = calculateTimeLeft(endDate);
			setTimeLeft(newTimeLeft);

			if (newTimeLeft.total <= 0) {
				clearInterval(timer);
				onExpire?.();
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [endDate, onExpire]);

	// Prevent hydration mismatch
	if (!mounted) {
		return (
			<div className="flex items-center gap-1">
				<TimeUnit value={0} label="Hrs" size={size} />
				<span className="text-gray-400">:</span>
				<TimeUnit value={0} label="Min" size={size} />
				<span className="text-gray-400">:</span>
				<TimeUnit value={0} label="Sec" size={size} />
			</div>
		);
	}

	if (timeLeft.total <= 0) {
		return (
			<div className="rounded-lg bg-gray-100 px-4 py-2 text-center font-medium text-gray-600">
				Sale Ended
			</div>
		);
	}

	return (
		<div className="flex items-center gap-1">
			{timeLeft.days > 0 && (
				<>
					<TimeUnit value={timeLeft.days} label="Days" size={size} />
					<span className="text-gray-400">:</span>
				</>
			)}
			<TimeUnit value={timeLeft.hours} label="Hrs" size={size} />
			<span className="text-gray-400">:</span>
			<TimeUnit value={timeLeft.minutes} label="Min" size={size} />
			<span className="text-gray-400">:</span>
			<TimeUnit value={timeLeft.seconds} label="Sec" size={size} />
		</div>
	);
}
