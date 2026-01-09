"use client";

import { useProductComparison } from "@/hooks/useProductComparison";
import { X, GitCompare, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductComparisonBarProps {
	channel: string;
}

export function ProductComparisonBar({ channel }: ProductComparisonBarProps) {
	const { comparisonProducts, removeFromComparison, count } = useProductComparison();

	if (count === 0) {
		return null;
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-2xl">
			<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between">
					{/* Left: Products */}
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2 text-temu-600">
							<GitCompare size={20} />
							<span className="font-bold">Compare ({count}/4)</span>
						</div>

						<div className="flex gap-2">
							{comparisonProducts.map((product) => (
								<div
									key={product.id}
									className="relative h-16 w-16 overflow-hidden rounded-lg border border-gray-200 bg-white"
								>
									{product.thumbnail ? (
										<Image
											src={product.thumbnail}
											alt={product.name}
											fill
											className="object-cover"
											sizes="64px"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
											<GitCompare size={20} />
										</div>
									)}
									<button
										onClick={() => removeFromComparison(product.id)}
										className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white shadow-lg transition-colors hover:bg-red-600"
										title="Remove"
									>
										<X size={12} />
									</button>
								</div>
							))}

							{/* Empty slots */}
							{Array.from({ length: 4 - count }).map((_, i) => (
								<div
									key={`empty-${i}`}
									className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
								>
									<span className="text-xs text-gray-400">+</span>
								</div>
							))}
						</div>
					</div>

					{/* Right: Action Button */}
					<Link
						href={`/${channel}/compare?ids=${comparisonProducts.map((p) => p.id).join(",")}`}
						className="flex items-center gap-2 rounded-full bg-temu-500 px-6 py-2.5 font-bold text-white transition-colors hover:bg-temu-600"
					>
						Compare Now
						<ArrowRight size={18} />
					</Link>
				</div>
			</div>
		</div>
	);
}
