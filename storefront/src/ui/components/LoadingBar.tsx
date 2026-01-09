"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function LoadingBar() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		// Start loading animation
		setIsLoading(true);
		setProgress(20);

		// Simulate progress
		const timer1 = setTimeout(() => setProgress(60), 100);
		const timer2 = setTimeout(() => setProgress(80), 200);
		const timer3 = setTimeout(() => {
			setProgress(100);
			// Hide after completion
			setTimeout(() => {
				setIsLoading(false);
				setProgress(0);
			}, 300);
		}, 400);

		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
			clearTimeout(timer3);
		};
	}, [pathname, searchParams]);

	if (!isLoading) return null;

	return (
		<div className="fixed top-0 left-0 right-0 z-50 h-1">
			<div
				className="h-full bg-gradient-to-r from-[#FB7701] to-orange-600 transition-all duration-300 ease-out shadow-lg"
				style={{ width: `${progress}%` }}
			>
				<div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-r from-transparent to-white/30 animate-shimmer" />
			</div>
			<style jsx>{`
				@keyframes shimmer {
					0% {
						transform: translateX(-100%);
					}
					100% {
						transform: translateX(100%);
					}
				}

				.animate-shimmer {
					animation: shimmer 1s infinite;
				}
			`}</style>
		</div>
	);
}
