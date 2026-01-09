"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, X, Star, TrendingUp } from "lucide-react";

interface Product {
	id: string;
	name: string;
	slug: string;
	thumbnail?: { url: string; alt?: string };
	pricing?: {
		priceRange?: {
			start?: {
				gross: {
					amount: number;
					currency: string;
				};
			};
		};
	};
	variants?: Array<{ quantityAvailable?: number | null }> | null;
}

interface ProductComparisonToolProps {
	currentProduct: Product;
	channel: string;
	categorySlug?: string;
}

export default function ProductComparisonTool({
	currentProduct,
	channel,
	categorySlug,
}: ProductComparisonToolProps) {
	const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulated data - in production, fetch from API
		const mockSimilarProducts: Product[] = [
			{
				id: "1",
				name: "Similar Product A",
				slug: "similar-product-a",
				thumbnail: { url: "/placeholder.svg", alt: "Similar Product A" },
				pricing: {
					priceRange: {
						start: {
							gross: {
								amount: currentProduct.pricing?.priceRange?.start?.gross.amount! * 1.1,
								currency: "UGX",
							},
						},
					},
				},
				variants: [{ quantityAvailable: 5 }],
			},
			{
				id: "2",
				name: "Similar Product B",
				slug: "similar-product-b",
				thumbnail: { url: "/placeholder.svg", alt: "Similar Product B" },
				pricing: {
					priceRange: {
						start: {
							gross: {
								amount: currentProduct.pricing?.priceRange?.start?.gross.amount! * 0.9,
								currency: "UGX",
							},
						},
					},
				},
				variants: [{ quantityAvailable: 10 }],
			},
		];

		setTimeout(() => {
			setSimilarProducts(mockSimilarProducts);
			setLoading(false);
		}, 500);
	}, [currentProduct]);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-temu-500"></div>
			</div>
		);
	}

	const allProducts = [currentProduct, ...similarProducts];
	const features = [
		{ label: "Price", key: "price" },
		{ label: "In Stock", key: "stock" },
		{ label: "Rating", key: "rating" },
		{ label: "Free Shipping", key: "shipping" },
		{ label: "Express Delivery", key: "express" },
	];

	const getFeatureValue = (product: Product, featureKey: string) => {
		const price = product.pricing?.priceRange?.start?.gross.amount || 0;
		const inStock = product.variants?.some((v) => (v.quantityAvailable ?? 0) > 0) || false;

		switch (featureKey) {
			case "price":
				return `UGX ${price.toLocaleString()}`;
			case "stock":
				return inStock;
			case "rating":
				return 4.5 + Math.random() * 0.5;
			case "shipping":
				return price > 50000;
			case "express":
				return price > 30000;
			default:
				return null;
		}
	};

	return (
		<div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
			<div className="p-6 bg-gradient-to-r from-temu-50 to-orange-50 border-b border-gray-200">
				<h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
					<TrendingUp className="text-temu-600" size={24} />
					Product Comparison
				</h3>
				<p className="text-gray-600 mt-2">Compare features and prices with similar products</p>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="bg-gray-50">
							<th className="px-4 py-4 text-left font-bold text-gray-900 border-r border-gray-200 sticky left-0 bg-gray-50 z-10">
								Feature
							</th>
							{allProducts.map((product, idx) => (
								<th
									key={product.id}
									className={`px-4 py-4 text-center font-bold text-gray-900 border-r border-gray-200 min-w-[200px] ${
										idx === 0 ? "bg-temu-50" : ""
									}`}
								>
									<div className="flex flex-col items-center gap-2">
										<div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200">
											<Image
												src={product.thumbnail?.url || "/placeholder.svg"}
												alt={product.name}
												fill
												className="object-cover"
											/>
										</div>
										<span className="text-sm line-clamp-2">{product.name}</span>
										{idx === 0 && (
											<span className="bg-temu-500 text-white text-xs px-2 py-1 rounded-full">
												Current
											</span>
										)}
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{features.map((feature, featureIdx) => (
							<tr
								key={feature.key}
								className={featureIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}
							>
								<td className="px-4 py-4 font-semibold text-gray-900 border-r border-gray-200 sticky left-0 bg-inherit z-10">
									{feature.label}
								</td>
								{allProducts.map((product, productIdx) => {
									const value = getFeatureValue(product, feature.key);
									const isBoolean = typeof value === "boolean";
									const isNumber = typeof value === "number";

									return (
										<td
											key={product.id}
											className={`px-4 py-4 text-center border-r border-gray-200 ${
												productIdx === 0 ? "bg-temu-50/30" : ""
											}`}
										>
											{isBoolean ? (
												value ? (
													<Check className="inline text-green-600" size={24} />
												) : (
													<X className="inline text-red-500" size={24} />
												)
											) : isNumber ? (
												<div className="flex items-center justify-center gap-1">
													<Star
														size={16}
														className="fill-yellow-400 text-yellow-400"
													/>
													<span className="font-semibold">
														{value.toFixed(1)}
													</span>
												</div>
											) : (
												<span className="font-semibold text-gray-900">{value}</span>
											)}
										</td>
									);
								})}
							</tr>
						))}
						<tr className="bg-gray-100">
							<td className="px-4 py-4 font-bold text-gray-900 border-r border-gray-200 sticky left-0 bg-gray-100 z-10">
								Action
							</td>
							{allProducts.map((product, idx) => (
								<td
									key={product.id}
									className={`px-4 py-4 text-center border-r border-gray-200 ${
										idx === 0 ? "bg-temu-50/30" : ""
									}`}
								>
									{idx === 0 ? (
										<span className="inline-block bg-temu-500 text-white px-4 py-2 rounded-lg font-bold">
											Viewing
										</span>
									) : (
										<Link
											href={`/${channel}/products/${product.slug}`}
											className="inline-block bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors"
										>
											View Product
										</Link>
									)}
								</td>
							))}
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
