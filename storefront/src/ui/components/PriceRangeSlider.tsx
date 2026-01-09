"use client";

import { useState, useEffect, useRef } from "react";

interface PriceRangeSliderProps {
	min: number;
	max: number;
	value: [number, number];
	onChange: (value: [number, number]) => void;
	step?: number;
	currency?: string;
}

export function PriceRangeSlider({
	min,
	max,
	value,
	onChange,
	step = 1,
	currency = "$",
}: PriceRangeSliderProps) {
	const [localValue, setLocalValue] = useState(value);
	const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
	const trackRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	const formatPrice = (price: number) => {
		return `${currency}${price.toLocaleString()}`;
	};

	const handleMouseDown = (type: "min" | "max") => {
		setIsDragging(type);
	};

	const handleMouseUp = () => {
		if (isDragging) {
			onChange(localValue);
			setIsDragging(null);
		}
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isDragging || !trackRef.current) return;

		const rect = trackRef.current.getBoundingClientRect();
		const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
		const newValue = Math.round((min + percent * (max - min)) / step) * step;

		setLocalValue((prev) => {
			if (isDragging === "min") {
				return [Math.min(newValue, prev[1] - step), prev[1]];
			} else {
				return [prev[0], Math.max(newValue, prev[0] + step)];
			}
		});
	};

	useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};
		}
	}, [isDragging, localValue]);

	const minPercent = ((localValue[0] - min) / (max - min)) * 100;
	const maxPercent = ((localValue[1] - min) / (max - min)) * 100;

	return (
		<div className="space-y-4">
			{/* Value Display */}
			<div className="flex items-center justify-between text-sm font-medium text-gray-900 dark:text-gray-100">
				<span>{formatPrice(localValue[0])}</span>
				<span className="text-gray-400 dark:text-gray-600">-</span>
				<span>{formatPrice(localValue[1])}</span>
			</div>

			{/* Slider */}
			<div className="relative pt-2">
				{/* Track Background */}
				<div
					ref={trackRef}
					className="relative h-2 rounded-full bg-gray-200 dark:bg-gray-700"
				>
					{/* Active Range */}
					<div
						className="absolute h-full rounded-full bg-temu-500 dark:bg-temu-400"
						style={{
							left: `${minPercent}%`,
							right: `${100 - maxPercent}%`,
						}}
					/>

					{/* Min Thumb */}
					<div
						className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white dark:bg-gray-800 border-2 border-temu-500 dark:border-temu-400 cursor-pointer shadow-lg hover:scale-110 transition-transform"
						style={{ left: `${minPercent}%` }}
						onMouseDown={() => handleMouseDown("min")}
					>
						{isDragging === "min" && (
							<div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
								{formatPrice(localValue[0])}
							</div>
						)}
					</div>

					{/* Max Thumb */}
					<div
						className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white dark:bg-gray-800 border-2 border-temu-500 dark:border-temu-400 cursor-pointer shadow-lg hover:scale-110 transition-transform"
						style={{ left: `${maxPercent}%` }}
						onMouseDown={() => handleMouseDown("max")}
					>
						{isDragging === "max" && (
							<div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
								{formatPrice(localValue[1])}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Min/Max Labels */}
			<div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
				<span>{formatPrice(min)}</span>
				<span>{formatPrice(max)}</span>
			</div>
		</div>
	);
}
