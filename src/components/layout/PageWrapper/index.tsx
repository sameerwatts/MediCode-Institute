import React from 'react';
import { StyledPageWrapper } from './styles';

interface IPageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<IPageWrapperProps> = ({ children }) => {
  return <StyledPageWrapper>{children}</StyledPageWrapper>;
};

export default PageWrapper;
