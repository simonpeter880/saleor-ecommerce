"use client";

import { useState } from "react";
import { Share2, Facebook, Twitter, Link2, Check, MessageCircle, Mail, Copy } from "lucide-react";

interface SocialShareProps {
	url: string;
	title: string;
	description?: string;
	image?: string;
	price?: string;
	variant?: "button" | "icons" | "dropdown";
}

export function SocialShare({
	url,
	title,
	description,
	image,
	price,
	variant = "dropdown"
}: SocialShareProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [copied, setCopied] = useState(false);

	const shareText = price
		? `Check out ${title} for ${price} at TechHub! ${description || ""}`
		: `Check out ${title} at TechHub! ${description || ""}`;

	const shareOptions = [
		{
			name: "WhatsApp",
			icon: <MessageCircle size={18} />,
			color: "bg-green-500 hover:bg-green-600",
			action: () => {
				window.open(
					`https://wa.me/?text=${encodeURIComponent(shareText + "\n" + url)}`,
					"_blank"
				);
			},
		},
		{
			name: "Facebook",
			icon: <Facebook size={18} />,
			color: "bg-blue-600 hover:bg-blue-700",
			action: () => {
				window.open(
					`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`,
					"_blank"
				);
			},
		},
		{
			name: "Twitter",
			icon: <Twitter size={18} />,
			color: "bg-sky-500 hover:bg-sky-600",
			action: () => {
				window.open(
					`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
					"_blank"
				);
			},
		},
		{
			name: "Email",
			icon: <Mail size={18} />,
			color: "bg-gray-600 hover:bg-gray-700",
			action: () => {
				window.open(
					`mailto:?subject=${encodeURIComponent(title + " - TechHub Electronics")}&body=${encodeURIComponent(shareText + "\n\n" + url)}`,
					"_blank"
				);
			},
		},
		{
			name: "Copy Link",
			icon: copied ? <Check size={18} /> : <Copy size={18} />,
			color: copied ? "bg-green-500" : "bg-gray-500 hover:bg-gray-600",
			action: () => {
				navigator.clipboard.writeText(url);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			},
		},
	];

	// Icon-only variant (horizontal row)
	if (variant === "icons") {
		return (
			<div className="flex items-center gap-2">
				<span className="text-sm text-gray-500 mr-1">Share:</span>
				{shareOptions.slice(0, 4).map((option) => (
					<button
						key={option.name}
						onClick={option.action}
						className={`${option.color} text-white p-2 rounded-full transition-colors`}
						title={option.name}
					>
						{option.icon}
					</button>
				))}
			</div>
		);
	}

	// Button variant (single share button that opens native share or fallback)
	if (variant === "button") {
		const handleShare = async () => {
			if (navigator.share) {
				try {
					await navigator.share({
						title,
						text: shareText,
						url,
					});
				} catch (err) {
					// User cancelled or error
					setIsOpen(true);
				}
			} else {
				setIsOpen(true);
			}
		};

		return (
			<div className="relative">
				<button
					onClick={handleShare}
					className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
				>
					<Share2 size={18} />
					<span>Share</span>
				</button>

				{isOpen && (
					<>
						<div
							className="fixed inset-0 z-40"
							onClick={() => setIsOpen(false)}
						/>
						<div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl shadow-xl border p-3 min-w-[200px]">
							<div className="space-y-2">
								{shareOptions.map((option) => (
									<button
										key={option.name}
										onClick={() => {
											option.action();
											if (option.name !== "Copy Link") setIsOpen(false);
										}}
										className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
									>
										<span className={`${option.color} text-white p-1.5 rounded-lg`}>
											{option.icon}
										</span>
										<span className="text-sm font-medium">{option.name}</span>
									</button>
								))}
							</div>
						</div>
					</>
				)}
			</div>
		);
	}

	// Dropdown variant (default)
	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
			>
				<Share2 size={20} />
				<span className="text-sm font-medium">Share</span>
			</button>

			{isOpen && (
				<>
					<div
						className="fixed inset-0 z-40"
						onClick={() => setIsOpen(false)}
					/>
					<div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-xl shadow-xl border overflow-hidden min-w-[220px]">
						<div className="p-3 border-b bg-gray-50">
							<p className="text-xs text-gray-500 font-medium">Share this product</p>
						</div>
						<div className="p-2">
							{shareOptions.map((option) => (
								<button
									key={option.name}
									onClick={() => {
										option.action();
										if (option.name !== "Copy Link") setIsOpen(false);
									}}
									className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-left"
								>
									<span className={`${option.color} text-white p-2 rounded-lg`}>
										{option.icon}
									</span>
									<span className="font-medium text-gray-700">{option.name}</span>
									{option.name === "Copy Link" && copied && (
										<span className="ml-auto text-xs text-green-600">Copied!</span>
									)}
								</button>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
