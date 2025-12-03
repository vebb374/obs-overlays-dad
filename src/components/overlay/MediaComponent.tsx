import React, { useState } from 'react';

interface MediaComponentProps {
  src?: string;
  objectFit?: 'contain' | 'cover' | 'fill';
  width: number;
  height: number;
}

export const MediaComponent: React.FC<MediaComponentProps> = ({ 
  src, 
  objectFit = 'contain',
  width,
  height
}) => {
  const [error, setError] = useState(false);

  if (!src) {
    return (
      <div 
        className="w-full h-full flex items-center justify-center bg-neutral-900 border border-dashed border-neutral-700 text-neutral-500 text-xs"
        style={{ width, height }}
      >
        No media source
      </div>
    );
  }

  if (error) {
    return (
        <div 
        className="w-full h-full flex items-center justify-center bg-neutral-900 border border-red-900/30 text-red-500 text-xs"
        style={{ width, height }}
      >
        Failed to load media
      </div>
    );
  }

  // Simple check for video extensions
  const videoRegex = /\.(mp4|webm|ogg|mov)$/i;
  const isVideo = videoRegex.exec(src);

  if (isVideo) {
    return (
      <video 
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full"
        style={{ objectFit }}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <img 
      src={src} 
      alt="Overlay Media"
      className="w-full h-full pointer-events-none"
      style={{ objectFit }}
      onError={() => setError(true)}
    />
  );
};

