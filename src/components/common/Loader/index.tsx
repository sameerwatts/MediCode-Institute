import React from 'react';
import { StyledLoaderWrapper, StyledSpinner } from './styles';

const Loader: React.FC = () => {
  return (
    <StyledLoaderWrapper>
      <StyledSpinner />
    </StyledLoaderWrapper>
  );
};

export default Loader;
