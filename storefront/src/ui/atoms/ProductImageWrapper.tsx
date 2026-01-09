"use client";

import NextImage, { type ImageProps } from "next/image";
import { useState } from "react";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

interface ProductImageWrapperProps extends Omit<ImageProps, "onError"> {
	fallbackSrc?: string;
}

export const ProductImageWrapper = ({
	src,
	fallbackSrc = PLACEHOLDER_IMAGE,
	alt,
	...props
}: ProductImageWrapperProps) => {
	const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
	const [hasError, setHasError] = useState(false);

	const handleError = () => {
		if (!hasError) {
			setHasError(true);
			setImgSrc(fallbackSrc);
		}
	};

	return (
		<div className="aspect-square overflow-hidden bg-neutral-50">
			<NextImage
				{...props}
				src={imgSrc}
				alt={alt || "Product image"}
				onError={handleError}
				className="h-full w-full object-contain object-center p-2"
			/>
		</div>
	);
};
