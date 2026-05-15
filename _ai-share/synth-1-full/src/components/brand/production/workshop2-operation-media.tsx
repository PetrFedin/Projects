import * as React from 'react';

export interface Workshop2OperationMediaProps {
  mediaUrl: string;
  className?: string;
}

export function Workshop2OperationMedia({ mediaUrl, className }: Workshop2OperationMediaProps) {
  if (!mediaUrl) return null;

  const isVideo = mediaUrl.match(/\.(mp4|webm|mov)$/i);

  if (!isVideo && !mediaUrl.match(/\.(gif)$/i)) {
    // Fallback for unknown media, but plan expects MP4/GIF handling primarily
    // We can render an img for non-video formats or GIF
    return (
      <img 
        src={mediaUrl} 
        alt="Operation instruction" 
        className={`object-cover rounded-md border border-gray-200 ${className || ''}`}
      />
    );
  }

  return (
    <video
      src={mediaUrl}
      className={`object-cover rounded-md border border-gray-200 ${className || ''}`}
      autoPlay
      loop
      muted
      playsInline
      controls={false}
    />
  );
}
