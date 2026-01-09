"use client";

import { useState } from "react";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";

interface ProductImage {
	url: string;
	alt: string | null;
}

interface ProductImageGalleryProps {
	images: ProductImage[];
	productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
	const [selectedImage, setSelectedImage] = useState(0);
	const [isZoomed, setIsZoomed] = useState(false);

	// If no images provided, show placeholder
	if (!images || images.length === 0) {
		return (
			<div className="aspect-square w-full rounded-lg bg-neutral-100 flex items-center justify-center">
				<span className="text-6xl">📱</span>
			</div>
		);
	}

	const currentImage = images[selectedImage];

	return (
		<div className="space-y-4">
			{/* Main Image */}
			<div
				className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100 cursor-zoom-in"
				onClick={() => setIsZoomed(!isZoomed)}
			>
				<ProductImageWrapper
					src={currentImage.url}
					alt={currentImage.alt || productName}
					width={1024}
					height={1024}
					sizes="(max-width: 768px) 100vw, 50vw"
					priority={selectedImage === 0}
					className={`object-contain transition-transform duration-300 ${
						isZoomed ? "scale-150" : "scale-100"
					}`}
				/>

				{/* Image Counter */}
				{images.length > 1 && (
					<div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-sm text-white backdrop-blur">
						{selectedImage + 1} / {images.length}
					</div>
				)}

				{/* Zoom Badge */}
				{!isZoomed && (
					<div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur">
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
							/>
						</svg>
						Click to zoom
					</div>
				)}
			</div>

			{/* Thumbnail Navigation */}
			{images.length > 1 && (
				<div className="grid grid-cols-5 gap-2">
					{images.map((image, index) => (
						<button
							key={index}
							onClick={() => setSelectedImage(index)}
							className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
								selectedImage === index
									? "border-blue-600"
									: "border-neutral-200 hover:border-neutral-400"
							}`}
						>
							<ProductImageWrapper
								src={image.url}
								alt={image.alt || `${productName} - Image ${index + 1}`}
								width={150}
								height={150}
								sizes="150px"
								className="object-contain"
							/>
						</button>
					))}
				</div>
			)}

			{/* Navigation Arrows */}
			{images.length > 1 && (
				<div className="flex justify-center gap-4">
					<button
						onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
						className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white transition hover:bg-neutral-50"
						aria-label="Previous image"
					>
						<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<button
						onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
						className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white transition hover:bg-neutral-50"
						aria-label="Next image"
					>
						<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			)}
		</div>
	);
}
