"use client";

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useWishlistContext } from "@/context/WishlistContext";

interface WishlistButtonProps {
	productId: string;
	channel: string;
	isInWishlist?: boolean;
	size?: "sm" | "md" | "lg";
	variant?: "icon" | "button";
	className?: string;
}

export function WishlistButton({
	productId,
	channel: _channel,
	isInWishlist: initialIsInWishlist = false,
	size = "md",
	variant = "icon",
	className = "",
}: WishlistButtonProps) {
	void _channel; // Keep for API compatibility
	const { isInWishlist, toggleWishlist } = useWishlistContext();
	const [isWishlisted, setIsWishlisted] = useState(initialIsInWishlist);
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");

	// Sync with context
	useEffect(() => {
		setIsWishlisted(isInWishlist(productId));
	}, [isInWishlist, productId]);

	const handleToggle = async () => {
		setIsLoading(true);
		try {
			await toggleWishlist(productId);
			const nowInWishlist = !isWishlisted;
			setIsWishlisted(nowInWishlist);
			setMessage(nowInWishlist ? "Added to wishlist!" : "Removed from wishlist!");
			setTimeout(() => setMessage(""), 2000);
		} catch (error) {
			console.error("Wishlist error:", error);
			setMessage("Failed to update wishlist");
			setTimeout(() => setMessage(""), 3000);
		} finally {
			setIsLoading(false);
		}
	};

	const sizeClasses = {
		sm: "w-8 h-8",
		md: "w-10 h-10",
		lg: "w-12 h-12",
	};

	const iconSizes = {
		sm: 16,
		md: 20,
		lg: 24,
	};

	if (variant === "button") {
		return (
			<div className="relative">
				<button
					onClick={handleToggle}
					disabled={isLoading}
					className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
						isWishlisted
							? "bg-red-50 text-red-600 border-2 border-red-600"
							: "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400"
					} ${isLoading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
				>
					<Heart size={iconSizes[size]} className={isWishlisted ? "fill-current" : ""} />
					<span>{isWishlisted ? "Saved" : "Save"}</span>
				</button>
				{message && (
					<div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-900 text-white text-xs py-1 px-3 rounded whitespace-nowrap z-10">
						{message}
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="relative">
			<button
				onClick={handleToggle}
				disabled={isLoading}
				className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all ${
					isWishlisted
						? "bg-red-500 text-white hover:bg-red-600"
						: "bg-white/90 hover:bg-white text-gray-700 hover:text-red-500"
				} shadow-md hover:shadow-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
				title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
			>
				<Heart
					size={iconSizes[size]}
					className={isWishlisted ? "fill-current" : ""}
					strokeWidth={2}
				/>
			</button>
			{message && (
				<div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-900 text-white text-xs py-1 px-3 rounded whitespace-nowrap z-10">
					{message}
				</div>
			)}
		</div>
	);
}
