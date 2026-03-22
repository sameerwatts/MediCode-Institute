import React from 'react';

interface ParallaxSectionProps {
  imagePath: string;
  overlayOpacity?: number;
  minHeight?: string;
  children: React.ReactNode;
  className?: string;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  imagePath,
  overlayOpacity = 60,
  minHeight = 'min-h-[70vh]',
  children,
  className = '',
}) => {
  return (
    <section
      className={`relative bg-cover bg-center bg-no-repeat bg-fixed ${minHeight} flex items-center justify-center ${className}`}
      style={{ backgroundImage: `url(${imagePath})` }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }}
      />
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
};

export default ParallaxSection;
