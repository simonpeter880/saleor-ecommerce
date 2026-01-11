/**
 * OptimizedImage Component
 *
 * Smart image component with:
 * - WebP/AVIF format support with fallbacks
 * - Lazy loading with blur placeholders
 * - Responsive image sizes
 * - Automatic optimization
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  sizes,
  className = '',
  objectFit = 'cover',
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate blur placeholder if not provided
  const defaultBlurDataURL =
    blurDataURL ||
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==';

  // Default responsive sizes for different breakpoints
  const defaultSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  if (hasError) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-200 dark:bg-gray-800`}
        style={{ width, height }}
      >
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    quality,
    priority,
    className: `${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`,
    onLoad: () => setIsLoading(false),
    onError: () => {
      setHasError(true);
      setIsLoading(false);
    },
    ...(fill
      ? { fill: true, sizes: defaultSizes }
      : { width, height }),
    ...(placeholder === 'blur' && { placeholder, blurDataURL: defaultBlurDataURL }),
    style: { objectFit },
  };

  return (
    <div className="relative">
      {isLoading && !priority && (
        <div
          className={`absolute inset-0 ${className} bg-gray-200 dark:bg-gray-800 animate-pulse`}
          style={{ width, height }}
        />
      )}
      <Image {...imageProps} />
    </div>
  );
}

/**
 * Product Image Gallery with optimized images
 */
interface ProductImageGalleryProps {
  images: Array<{ url: string; alt?: string }>;
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <svg
          className="w-24 h-24 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        <OptimizedImage
          src={images[selectedImage].url}
          alt={images[selectedImage].alt || `${productName} - Image ${selectedImage + 1}`}
          fill
          priority={selectedImage === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
          className="object-contain"
          quality={90}
        />
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square relative overflow-hidden rounded-lg border-2 transition ${
                selectedImage === index
                  ? 'border-blue-600 dark:border-blue-400'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <OptimizedImage
                src={image.url}
                alt={image.alt || `${productName} - Thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, 150px"
                className="object-cover"
                quality={70}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default OptimizedImage;
