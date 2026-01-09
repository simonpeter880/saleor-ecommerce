"use client";

import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";

interface FlashSaleBannerProps {
	title: string;
	subtitle?: string;
	endDate: string;
	discountText?: string;
	href?: string;
	channel: string;
	variant?: "full" | "compact";
}

export function FlashSaleBanner({
	title,
	subtitle,
	endDate,
	discountText,
	href,
	channel,
	variant = "full",
}: FlashSaleBannerProps) {
	const content = (
		<div
			className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-secondary-500 via-secondary-600 to-primary-600 ${
				variant === "full" ? "p-6 md:p-8" : "p-4"
			}`}
		>
			{/* Animated background elements */}
			<div className="absolute inset-0 opacity-20">
				<div className="absolute -left-4 -top-4 h-24 w-24 animate-pulse rounded-full bg-white/30" />
				<div className="absolute -bottom-4 -right-4 h-32 w-32 animate-pulse rounded-full bg-white/20" />
				<div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-white/10" />
			</div>

			<div
				className={`relative flex flex-col items-center gap-4 text-white ${
					variant === "full" ? "md:flex-row md:justify-between" : ""
				}`}
			>
				{/* Left side - Title and badge */}
				<div className={`text-center ${variant === "full" ? "md:text-left" : ""}`}>
					<div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
						<Zap className="h-5 w-5 animate-pulse fill-yellow-400 text-yellow-400" />
						<span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold uppercase text-gray-900">
							Flash Sale
						</span>
						{discountText && (
							<span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
								{discountText}
							</span>
						)}
					</div>
					<h2
						className={`font-bold ${variant === "full" ? "text-2xl md:text-3xl" : "text-lg"}`}
					>
						{title}
					</h2>
					{subtitle && variant === "full" && (
						<p className="mt-1 text-sm text-white/80">{subtitle}</p>
					)}
				</div>

				{/* Middle - Countdown */}
				<div className="flex flex-col items-center gap-2">
					<span className="text-sm font-medium text-white/80">Ends in:</span>
					<CountdownTimer
						endDate={endDate}
						size={variant === "full" ? "md" : "sm"}
					/>
				</div>

				{/* Right side - CTA */}
				{href && variant === "full" && (
					<Link
						href={`/${channel}${href}`}
						className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-secondary-600 transition-all hover:bg-yellow-400 hover:text-gray-900"
					>
						Shop Now
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Link>
				)}
			</div>
		</div>
	);

	if (href && variant === "compact") {
		return (
			<Link href={`/${channel}${href}`} className="block">
				{content}
			</Link>
		);
	}

	return content;
}
