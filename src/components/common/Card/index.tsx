import React from 'react';
import Image from 'next/image';

interface ICardProps {
  image?: string;
  imageAlt?: string;
  children: React.ReactNode;
}

const Card: React.FC<ICardProps> = ({ image, imageAlt = '', children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {image && (
        <div className="relative w-full h-48">
          <Image src={image} alt={imageAlt} fill className="object-cover" />
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;
