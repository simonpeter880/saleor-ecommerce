"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initGA, trackPageView, GA_TRACKING_ID } from "@/lib/analytics";

export function GoogleAnalytics() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Initialize GA on mount
	useEffect(() => {
		if (!GA_TRACKING_ID) return;

		initGA();
	}, []);

	// Track page views on route change
	useEffect(() => {
		if (!GA_TRACKING_ID) return;

		const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
		trackPageView(url);
	}, [pathname, searchParams]);

	// Render Google Analytics script tags for server-side rendering
	if (!GA_TRACKING_ID) return null;

	return (
		<>
			<script
				async
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
			/>
			<script
				id="google-analytics"
				dangerouslySetInnerHTML={{
					__html: `
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', '${GA_TRACKING_ID}', {
							page_path: window.location.pathname,
						});
					`,
				}}
			/>
		</>
	);
}
