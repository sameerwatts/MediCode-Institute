import React from 'react';

const NextImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => <img src={src} alt={alt} className={className} />;

export default NextImage;
