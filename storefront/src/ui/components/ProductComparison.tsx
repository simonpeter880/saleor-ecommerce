"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";

interface ProductSpec {
	label: string;
	value: string;
}

interface ComparisonProduct {
	id: string;
	name: string;
	image: string;
	price: string;
	category: string;
	rating: number;
	specs: ProductSpec[];
	href: string;
}

// Mock data for demonstration
const sampleProducts: ComparisonProduct[] = [
	{
		id: "1",
		name: "iPhone 15 Pro",
		image: "/placeholder-product.jpg",
		price: "$999",
		category: "Smartphones",
		rating: 5,
		href: "/products/iphone-15-pro",
		specs: [
			{ label: "Display", value: '6.1" Super Retina XDR' },
			{ label: "Processor", value: "A17 Pro" },
			{ label: "RAM", value: "8GB" },
			{ label: "Storage", value: "128GB / 256GB / 512GB / 1TB" },
			{ label: "Camera", value: "48MP Main + 12MP Ultra Wide" },
			{ label: "Battery", value: "Up to 23 hours video" },
			{ label: "5G", value: "Yes" },
			{ label: "Weight", value: "187g" },
		],
	},
	{
		id: "2",
		name: "Samsung Galaxy S24 Ultra",
		image: "/placeholder-product.jpg",
		price: "$1,199",
		category: "Smartphones",
		rating: 5,
		href: "/products/samsung-s24-ultra",
		specs: [
			{ label: "Display", value: '6.8" Dynamic AMOLED 2X' },
			{ label: "Processor", value: "Snapdragon 8 Gen 3" },
			{ label: "RAM", value: "12GB" },
			{ label: "Storage", value: "256GB / 512GB / 1TB" },
			{ label: "Camera", value: "200MP Main + 12MP Ultra Wide" },
			{ label: "Battery", value: "5000mAh" },
			{ label: "5G", value: "Yes" },
			{ label: "Weight", value: "232g" },
		],
	},
	{
		id: "3",
		name: "Google Pixel 8 Pro",
		image: "/placeholder-product.jpg",
		price: "$899",
		category: "Smartphones",
		rating: 4,
		href: "/products/pixel-8-pro",
		specs: [
			{ label: "Display", value: '6.7" LTPO OLED' },
			{ label: "Processor", value: "Google Tensor G3" },
			{ label: "RAM", value: "12GB" },
			{ label: "Storage", value: "128GB / 256GB / 512GB" },
			{ label: "Camera", value: "50MP Main + 48MP Ultra Wide" },
			{ label: "Battery", value: "5050mAh" },
			{ label: "5G", value: "Yes" },
			{ label: "Weight", value: "213g" },
		],
	},
];

export function ProductComparison() {
	const [selectedProducts, setSelectedProducts] = useState<ComparisonProduct[]>(sampleProducts);

	const removeProduct = (id: string) => {
		setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
	};

	const addProduct = () => {
		// In a real implementation, this would open a product selector modal
		alert("Product selector modal would open here");
	};

	if (selectedProducts.length === 0) {
		return (
			<div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 p-12 text-center">
				<svg
					className="mb-4 h-16 w-16 text-neutral-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
					/>
				</svg>
				<h3 className="mb-2 text-xl font-semibold text-neutral-900">No Products to Compare</h3>
				<p className="mb-6 text-neutral-600">Add products to see a side-by-side comparison</p>
				<button
					onClick={addProduct}
					className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
				>
					Add Products
				</button>
			</div>
		);
	}

	// Get all unique spec labels
	const allSpecLabels = Array.from(
		new Set(selectedProducts.flatMap((p) => p.specs.map((s) => s.label)))
	);

	return (
		<div className="overflow-x-auto">
			<div className="mb-6 flex items-center justify-between">
				<h2 className="text-2xl font-bold text-neutral-900">Product Comparison</h2>
				<button
					onClick={addProduct}
					className="flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2 font-semibold text-blue-600 transition hover:bg-blue-50"
				>
					<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 4v16m8-8H4"
						/>
					</svg>
					Add Product
				</button>
			</div>

			<div className="min-w-max rounded-lg border border-neutral-200 bg-white">
				<table className="w-full">
					<thead>
						<tr className="border-b border-neutral-200 bg-neutral-50">
							<th className="sticky left-0 z-10 bg-neutral-50 p-4 text-left font-semibold text-neutral-900">
								Features
							</th>
							{selectedProducts.map((product) => (
								<th key={product.id} className="p-4">
									<div className="flex min-w-[250px] flex-col items-center">
										{/* Product Image */}
										<div className="relative mb-3 h-32 w-32 overflow-hidden rounded-lg bg-neutral-100">
											<button
												onClick={() => removeProduct(product.id)}
												className="absolute right-1 top-1 z-10 rounded-full bg-white p-1 shadow-md transition hover:bg-red-50"
											>
												<svg
													className="h-4 w-4 text-neutral-600"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											</button>
											{/* Placeholder for product image */}
											<div className="flex h-full w-full items-center justify-center text-4xl">
												📱
											</div>
										</div>

										{/* Product Name */}
										<Link
											href={product.href}
											className="mb-2 text-center font-semibold text-neutral-900 hover:text-blue-600"
										>
											{product.name}
										</Link>

										{/* Category */}
										<p className="mb-2 text-sm text-neutral-500">{product.category}</p>

										{/* Rating */}
										<div className="mb-3 flex items-center gap-1">
											{[...Array(5)].map((_, i) => (
												<svg
													key={i}
													className={`h-4 w-4 ${i < product.rating ? "text-yellow-400" : "text-gray-300"}`}
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
												</svg>
											))}
										</div>

										{/* Price */}
										<p className="mb-4 text-xl font-bold text-blue-600">{product.price}</p>

										{/* CTA Button */}
										<Link
											href={product.href}
											className="w-full rounded-lg bg-blue-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-blue-700"
										>
											View Details
										</Link>
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{allSpecLabels.map((label, idx) => (
							<tr
								key={label}
								className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50"}
							>
								<td className="sticky left-0 z-10 border-b border-neutral-200 bg-inherit p-4 font-medium text-neutral-700">
									{label}
								</td>
								{selectedProducts.map((product) => {
									const spec = product.specs.find((s) => s.label === label);
									return (
										<td
											key={product.id}
											className="border-b border-neutral-200 p-4 text-center text-neutral-600"
										>
											{spec ? spec.value : "—"}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Comparison Actions */}
			<div className="mt-6 flex justify-center gap-4">
				<button className="rounded-lg border border-neutral-300 px-6 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-50">
					Print Comparison
				</button>
				<button className="rounded-lg border border-neutral-300 px-6 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-50">
					Share Comparison
				</button>
				<button
					onClick={() => setSelectedProducts([])}
					className="rounded-lg border border-neutral-300 px-6 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-50"
				>
					Clear All
				</button>
			</div>
		</div>
	);
}
