import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'components/common/Button';
import {
  StyledNotFoundPage,
  StyledErrorCode,
  StyledHeading,
  StyledSubtitle,
} from './styles';

const NotFound: React.FC = () => {
  return (
    <StyledNotFoundPage>
      <StyledErrorCode>404</StyledErrorCode>
      <StyledHeading>Page Not Found</StyledHeading>
      <StyledSubtitle>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </StyledSubtitle>
      <Link to="/">
        <Button variant="primary" size="lg">
          Go Home
        </Button>
      </Link>
    </StyledNotFoundPage>
  );
};

export default NotFound;
