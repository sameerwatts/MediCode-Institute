import React from 'react';

interface ICardProps {
  image?: string;
  imageAlt?: string;
  children: React.ReactNode;
}

const Card: React.FC<ICardProps> = ({ image, imageAlt = '', children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {image && <img src={image} alt={imageAlt} className="w-full h-48 object-cover" />}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;
