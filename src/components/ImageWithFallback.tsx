import React, { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps extends React.ComponentProps<typeof Image> {
  fallbackSrc?: string;
}

export const ImageWithFallback = ({ src, fallbackSrc, ...props }: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  const handleError = () => {
    if (fallbackSrc) {
        setImgSrc(fallbackSrc);
    } else {
        setError(true);
    }
  };

  if (error || !imgSrc) {
    return <div className="w-full h-full bg-muted" />;
  }

  return (
    <Image
      src={imgSrc}
      onError={handleError}
      {...props}
      width={props.width || 1080}
      height={props.height || 500}
    />
  );
};
