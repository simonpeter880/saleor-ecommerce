"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
	channel: string;
}

export function Breadcrumb({ items, channel }: BreadcrumbProps) {
	return (
		<nav aria-label="Breadcrumb" className="bg-white border-b border-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
				<ol className="flex items-center flex-wrap gap-1 text-sm">
					{/* Home */}
					<li className="flex items-center">
						<Link
							href={`/${channel}`}
							className="text-gray-500 hover:text-temu-600 transition-colors flex items-center gap-1"
						>
							<Home size={14} />
							<span className="hidden sm:inline">Home</span>
						</Link>
					</li>

					{items.map((item, index) => (
						<li key={index} className="flex items-center">
							<ChevronRight size={14} className="text-gray-400 mx-1" />
							{item.href ? (
								<Link
									href={item.href}
									className="text-gray-500 hover:text-temu-600 transition-colors max-w-[150px] sm:max-w-none truncate"
								>
									{item.label}
								</Link>
							) : (
								<span className="text-gray-900 font-medium max-w-[150px] sm:max-w-[300px] truncate">
									{item.label}
								</span>
							)}
						</li>
					))}
				</ol>
			</div>
		</nav>
	);
}
