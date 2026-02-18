import React from 'react';
import { StyledCard, StyledCardImage, StyledCardBody } from './styles';

interface ICardProps {
  image?: string;
  imageAlt?: string;
  children: React.ReactNode;
}

const Card: React.FC<ICardProps> = ({ image, imageAlt = '', children }) => {
  return (
    <StyledCard>
      {image && <StyledCardImage src={image} alt={imageAlt} />}
      <StyledCardBody>{children}</StyledCardBody>
    </StyledCard>
  );
};

export default Card;
