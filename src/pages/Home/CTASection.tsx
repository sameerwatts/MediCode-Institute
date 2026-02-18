import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'components/common/Button';
import {
  StyledCTASection,
  StyledCTATitle,
  StyledCTAText,
} from './styles';

const CTASection: React.FC = () => {
  return (
    <StyledCTASection>
      <StyledCTATitle>Start Your Learning Journey Today</StyledCTATitle>
      <StyledCTAText>
        Join thousands of students who are already bridging the gap between
        medicine and technology. Enroll in a course and start learning now.
      </StyledCTAText>
      <Link to="/courses">
        <Button variant="secondary" size="lg">
          Browse All Courses
        </Button>
      </Link>
    </StyledCTASection>
  );
};

export default CTASection;
