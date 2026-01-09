"use client";

import { TemuProductPage } from "./TemuProductPage";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductImage {
	url: string;
	alt?: string;
}

interface ProductVariant {
	id: string;
	name: string;
	quantityAvailable?: number;
	pricing?: {
		price?: {
			gross: {
				amount: number;
				currency: string;
			};
		};
	};
}

interface Product {
	id: string;
	name: string;
	slug: string;
	description?: string;
	thumbnail?: ProductImage;
	media?: ProductImage[];
	variants?: ProductVariant[];
	category?: {
		name: string;
		slug: string;
	};
	pricing?: {
		priceRange?: {
			start?: {
				gross: {
					amount: number;
					currency: string;
				};
			};
			stop?: {
				gross: {
					amount: number;
					currency: string;
				};
			};
		};
	};
	rating?: number;
	reviews?: any[];
}

export function TemuProductWrapper({
	product,
	channel,
	selectedVariant,
	addToCartAction,
}: {
	product: Product;
	channel: string;
	selectedVariant?: ProductVariant;
	addToCartAction: () => Promise<void>;
}) {
	const router = useRouter();
	const [isAdding, setIsAdding] = useState(false);

	const handleAddToCart = async () => {
		setIsAdding(true);
		try {
			await addToCartAction();
			router.refresh();
			// Optionally show success toast
		} catch (error) {
			console.error("Error adding to cart:", error);
			// Optionally show error toast
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<TemuProductPage
			product={product}
			channel={channel}
			selectedVariant={selectedVariant}
			onAddToCart={handleAddToCart}
		/>
	);
}
