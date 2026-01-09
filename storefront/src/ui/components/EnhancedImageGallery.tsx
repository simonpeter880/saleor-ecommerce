"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
	ZoomIn,
	ZoomOut,
	Maximize2,
	X,
	ChevronLeft,
	ChevronRight,
	Rotate3D,
	Play,
	Pause,
} from "lucide-react";

interface GalleryImage {
	url: string;
	alt?: string;
	is360?: boolean;
}

interface EnhancedImageGalleryProps {
	images: GalleryImage[];
	productName: string;
}

export function EnhancedImageGallery({
	images,
	productName,
}: EnhancedImageGalleryProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [zoomLevel, setZoomLevel] = useState(1);
	const [is360Mode, setIs360Mode] = useState(false);
	const [is360Playing, setIs360Playing] = useState(false);
	const [rotation, setRotation] = useState(0);
	const imageRef = useRef<HTMLDivElement>(null);
	const animationRef = useRef<number>();

	const currentImage = images[selectedIndex];
	const has360Images = images.some((img) => img.is360);

	// Auto-rotate for 360 view
	useEffect(() => {
		if (is360Mode && is360Playing) {
			const animate = () => {
				setRotation((prev) => (prev + 1) % 360);
				animationRef.current = requestAnimationFrame(animate);
			};
			animationRef.current = requestAnimationFrame(animate);
		} else {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		}

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [is360Mode, is360Playing]);

	const handleZoomIn = () => {
		setZoomLevel((prev) => Math.min(prev + 0.5, 3));
	};

	const handleZoomOut = () => {
		setZoomLevel((prev) => Math.max(prev - 0.5, 1));
	};

	const handlePrevious = () => {
		setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
		setZoomLevel(1);
	};

	const handleNext = () => {
		setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
		setZoomLevel(1);
	};

	const handleFullscreen = () => {
		setIsFullscreen(true);
	};

	const handleCloseFullscreen = () => {
		setIsFullscreen(false);
		setZoomLevel(1);
	};

	const toggle360Mode = () => {
		setIs360Mode(!is360Mode);
		setZoomLevel(1);
		if (!is360Mode) {
			setIs360Playing(true);
		}
	};

	if (!images || images.length === 0) {
		return (
			<div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
				<span className="text-gray-400">No images available</span>
			</div>
		);
	}

	return (
		<>
			{/* Main Gallery */}
			<div className="space-y-4">
				{/* Main Image */}
				<div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
					<div
						ref={imageRef}
						className={`w-full h-full transition-transform duration-300 ${
							is360Mode ? "cursor-grab active:cursor-grabbing" : ""
						}`}
						style={{
							transform: is360Mode
								? `rotate(${rotation}deg) scale(${zoomLevel})`
								: `scale(${zoomLevel})`,
						}}
					>
						<Image
							src={currentImage.url}
							alt={currentImage.alt || `${productName} image ${selectedIndex + 1}`}
							fill
							className="object-contain"
							sizes="(max-width: 768px) 100vw, 50vw"
							priority={selectedIndex === 0}
						/>
					</div>

					{/* Controls Overlay */}
					<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
						{/* Top Controls */}
						<div className="absolute top-4 right-4 flex gap-2">
							{has360Images && (
								<button
									onClick={toggle360Mode}
									className={`p-2 rounded-lg shadow-lg transition-colors ${
										is360Mode
											? "bg-temu-600 text-white"
											: "bg-white text-gray-800 hover:bg-gray-100"
									}`}
									title="360° View"
								>
									<Rotate3D size={20} />
								</button>
							)}

							<button
								onClick={handleFullscreen}
								className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 text-gray-800"
								title="Fullscreen"
							>
								<Maximize2 size={20} />
							</button>
						</div>

						{/* Zoom Controls */}
						<div className="absolute bottom-4 right-4 flex flex-col gap-2">
							<button
								onClick={handleZoomIn}
								disabled={zoomLevel >= 3}
								className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
								title="Zoom In"
							>
								<ZoomIn size={20} />
							</button>
							<button
								onClick={handleZoomOut}
								disabled={zoomLevel <= 1}
								className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
								title="Zoom Out"
							>
								<ZoomOut size={20} />
							</button>
						</div>

						{/* Navigation Arrows */}
						{images.length > 1 && (
							<>
								<button
									onClick={handlePrevious}
									className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 text-gray-800"
								>
									<ChevronLeft size={24} />
								</button>
								<button
									onClick={handleNext}
									className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 text-gray-800"
								>
									<ChevronRight size={24} />
								</button>
							</>
						)}

						{/* 360 Play/Pause */}
						{is360Mode && (
							<button
								onClick={() => setIs360Playing(!is360Playing)}
								className="absolute bottom-4 left-4 p-3 bg-white rounded-lg shadow-lg hover:bg-gray-100 text-gray-800"
							>
								{is360Playing ? <Pause size={20} /> : <Play size={20} />}
							</button>
						)}
					</div>

					{/* Image Counter */}
					<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
						{selectedIndex + 1} / {images.length}
					</div>
				</div>

				{/* Thumbnails */}
				{images.length > 1 && (
					<div className="flex gap-2 overflow-x-auto pb-2">
						{images.map((image, index) => (
							<button
								key={index}
								onClick={() => {
									setSelectedIndex(index);
									setZoomLevel(1);
									setIs360Mode(false);
								}}
								className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
									selectedIndex === index
										? "border-temu-500 ring-2 ring-temu-200"
										: "border-gray-200 hover:border-gray-300"
								}`}
							>
								<Image
									src={image.url}
									alt={image.alt || `${productName} thumbnail ${index + 1}`}
									fill
									className="object-cover"
									sizes="80px"
								/>
								{image.is360 && (
									<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
										<Rotate3D size={16} className="text-white" />
									</div>
								)}
							</button>
						))}
					</div>
				)}
			</div>

			{/* Fullscreen Modal */}
			{isFullscreen && (
				<div className="fixed inset-0 z-50 bg-black">
					{/* Close Button */}
					<button
						onClick={handleCloseFullscreen}
						className="absolute top-4 right-4 z-10 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all"
					>
						<X size={24} />
					</button>

					{/* Main Image */}
					<div className="w-full h-full flex items-center justify-center p-8">
						<div
							className="relative max-w-full max-h-full"
							style={{
								transform: is360Mode
									? `rotate(${rotation}deg) scale(${zoomLevel})`
									: `scale(${zoomLevel})`,
								transition: "transform 0.3s ease",
							}}
						>
							<Image
								src={currentImage.url}
								alt={currentImage.alt || `${productName} fullscreen`}
								width={1200}
								height={1200}
								className="max-w-full max-h-[80vh] object-contain"
							/>
						</div>
					</div>

					{/* Controls */}
					<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full">
						{/* Zoom Out */}
						<button
							onClick={handleZoomOut}
							disabled={zoomLevel <= 1}
							className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<ZoomOut size={20} />
						</button>

						{/* Zoom Level */}
						<span className="text-white font-semibold min-w-[60px] text-center">
							{Math.round(zoomLevel * 100)}%
						</span>

						{/* Zoom In */}
						<button
							onClick={handleZoomIn}
							disabled={zoomLevel >= 3}
							className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<ZoomIn size={20} />
						</button>

						{/* Divider */}
						{has360Images && <div className="w-px h-6 bg-white bg-opacity-40" />}

						{/* 360 Toggle */}
						{has360Images && (
							<>
								<button
									onClick={toggle360Mode}
									className={`p-2 rounded-full transition-all ${
										is360Mode
											? "bg-temu-600 text-white"
											: "hover:bg-white hover:bg-opacity-20 text-white"
									}`}
								>
									<Rotate3D size={20} />
								</button>

								{is360Mode && (
									<button
										onClick={() => setIs360Playing(!is360Playing)}
										className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full text-white transition-all"
									>
										{is360Playing ? <Pause size={20} /> : <Play size={20} />}
									</button>
								)}
							</>
						)}
					</div>

					{/* Navigation */}
					{images.length > 1 && (
						<>
							<button
								onClick={handlePrevious}
								className="absolute left-8 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all"
							>
								<ChevronLeft size={32} />
							</button>
							<button
								onClick={handleNext}
								className="absolute right-8 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all"
							>
								<ChevronRight size={32} />
							</button>
						</>
					)}

					{/* Image Counter */}
					<div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
						{selectedIndex + 1} / {images.length}
					</div>

					{/* Thumbnails */}
					<div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
						{images.map((image, index) => (
							<button
								key={index}
								onClick={() => {
									setSelectedIndex(index);
									setZoomLevel(1);
									setIs360Mode(false);
								}}
								className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
									selectedIndex === index
										? "border-temu-500 ring-2 ring-temu-200"
										: "border-white border-opacity-40 hover:border-opacity-60"
								}`}
							>
								<Image
									src={image.url}
									alt={`Thumbnail ${index + 1}`}
									fill
									className="object-cover"
									sizes="64px"
								/>
							</button>
						))}
					</div>
				</div>
			)}
		</>
	);
}

/**
 * Lightbox-style Image Viewer
 * Alternative simpler implementation
 */
export function SimpleLightbox({
	images,
	productName,
}: {
	images: GalleryImage[];
	productName: string;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);

	if (!images || images.length === 0) return null;

	return (
		<>
			{/* Thumbnail Grid */}
			<div className="grid grid-cols-4 gap-2">
				{images.map((image, index) => (
					<button
						key={index}
						onClick={() => {
							setCurrentIndex(index);
							setIsOpen(true);
						}}
						className="relative aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
					>
						<Image
							src={image.url}
							alt={image.alt || `${productName} ${index + 1}`}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 25vw, 12vw"
						/>
					</button>
				))}
			</div>

			{/* Lightbox */}
			{isOpen && (
				<div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
					<button
						onClick={() => setIsOpen(false)}
						className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
					>
						<X size={24} />
					</button>

					<div className="relative max-w-4xl max-h-full">
						<Image
							src={images[currentIndex].url}
							alt={images[currentIndex].alt || productName}
							width={1200}
							height={1200}
							className="max-w-full max-h-[90vh] object-contain"
						/>
					</div>

					{images.length > 1 && (
						<>
							<button
								onClick={() =>
									setCurrentIndex((prev) =>
										prev === 0 ? images.length - 1 : prev - 1
									)
								}
								className="absolute left-4 p-2 text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full"
							>
								<ChevronLeft size={32} />
							</button>
							<button
								onClick={() =>
									setCurrentIndex((prev) =>
										prev === images.length - 1 ? 0 : prev + 1
									)
								}
								className="absolute right-4 p-2 text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full"
							>
								<ChevronRight size={32} />
							</button>
						</>
					)}
				</div>
			)}
		</>
	);
}
