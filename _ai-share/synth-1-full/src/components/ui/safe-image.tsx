'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SafeImageProps extends React.ComponentProps<typeof Image> {
  fallbackSrc?: string;
  showFallbackOnError?: boolean;
}

export function SafeImage({ 
  src, 
  alt, 
  fallbackSrc = '/logo_placeholder.svg',
  showFallbackOnError = true,
  className,
  ...props 
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (showFallbackOnError && !hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={cn(className)}
      onError={handleError}
      {...props}
    />
  );
}





