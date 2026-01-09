"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const [isTransitioning, setIsTransitioning] = useState(false);

	useEffect(() => {
		// Trigger fade-in animation on route change
		setIsTransitioning(true);
		const timer = setTimeout(() => setIsTransitioning(false), 300);

		// Scroll to top on route change
		window.scrollTo({ top: 0, behavior: "smooth" });

		return () => clearTimeout(timer);
	}, [pathname]);

	return (
		<div
			className={`transition-opacity duration-300 ${
				isTransitioning ? "opacity-0" : "opacity-100"
			}`}
		>
			{children}
		</div>
	);
}
