'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface DebugImageProps {
  src: string;
  alt: string;
  [key: string]: any;
}

export function DebugImage({ src, alt, ...props }: DebugImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
    setImageError(false);
    setImageLoaded(false);
  }, [src]);

  const handleError = (e: any) => {
    console.error('Image failed to load:', {
      src: imageSrc,
      error: e,
      timestamp: new Date().toISOString()
    });
    setImageError(true);
  };

  const handleLoad = () => {
    console.log('Image loaded successfully:', imageSrc);
    setImageLoaded(true);
  };

  if (imageError) {
    return (
      <div className="flex items-center justify-center bg-muted text-muted-foreground" style={props.style}>
        <div className="text-center p-4">
          <p className="text-xs">Failed to load</p>
          <p className="text-xs mt-1 break-all">{imageSrc.substring(0, 50)}...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Image
        src={imageSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
      {process.env.NODE_ENV === 'development' && !imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Loading...</span>
        </div>
      )}
    </>
  );
}





