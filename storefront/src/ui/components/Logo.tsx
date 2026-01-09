"use client";

import { usePathname } from "next/navigation";
import { LinkWithChannel } from "../atoms/LinkWithChannel";

const companyName = "TechHub";

export const Logo = () => {
	const pathname = usePathname();

	const LogoContent = () => (
		<div className="flex items-center gap-2">
			<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
			</div>
			<span className="text-xl font-bold text-gray-900">
				{companyName}
				<span className="ml-1 text-sm font-normal text-blue-600">Electronics</span>
			</span>
		</div>
	);

	if (pathname === "/") {
		return (
			<h1 className="flex items-center" aria-label="homepage">
				<LogoContent />
			</h1>
		);
	}
	return (
		<div className="flex items-center">
			<LinkWithChannel aria-label="homepage" href="/" className="transition-opacity hover:opacity-80">
				<LogoContent />
			</LinkWithChannel>
		</div>
	);
};
