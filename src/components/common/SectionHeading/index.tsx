import React from 'react';
import { StyledSectionHeading, StyledTitle, StyledSubtitle } from './styles';

interface ISectionHeadingProps {
  title: string;
  subtitle?: string;
}

const SectionHeading: React.FC<ISectionHeadingProps> = ({ title, subtitle }) => {
  return (
    <StyledSectionHeading>
      <StyledTitle>{title}</StyledTitle>
      {subtitle && <StyledSubtitle>{subtitle}</StyledSubtitle>}
    </StyledSectionHeading>
  );
};

export default SectionHeading;
