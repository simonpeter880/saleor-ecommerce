"use client";

export function SkipToContent() {
	return (
		<a
			href="#main-content"
			className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[#FB7701] focus:px-6 focus:py-3 focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
		>
			Skip to main content
		</a>
	);
}
