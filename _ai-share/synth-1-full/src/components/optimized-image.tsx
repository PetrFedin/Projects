'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onError?: () => void;
}

// Генерирует простой blur placeholder
function generateBlurDataURL(width: number = 400, height: number = 400): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, width, height);
  }
  return canvas.toDataURL();
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
  priority = false,
  aspectRatio,
  objectFit = 'cover',
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [blurDataURL] = useState(() => {
    if (typeof window !== 'undefined') {
      return generateBlurDataURL(width || 400, height || 400);
    }
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+';
  });

  const imageProps = fill
    ? {
        fill: true,
        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      }
    : {
        width: width || 400,
        height: height || 400,
      };

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted',
          fill ? 'absolute inset-0' : '',
          className
        )}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <span className="text-xs text-muted-foreground">Изображение не загружено</span>
      </div>
    );
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {isLoading && <Skeleton className={cn('absolute inset-0', fill ? '' : 'h-full w-full')} />}
      <Image
        {...imageProps}
        src={src}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down'
        )}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
          onError?.();
        }}
      />
    </div>
  );
}
