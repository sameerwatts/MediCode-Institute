import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'components/common/Button';
import {
  StyledHero,
  StyledHeroContent,
  StyledHeroTitle,
  StyledHeroSubtitle,
} from './styles';

const HeroSection: React.FC = () => {
  return (
    <StyledHero>
      <StyledHeroContent>
        <StyledHeroTitle>Bridge Medicine &amp; Technology</StyledHeroTitle>
        <StyledHeroSubtitle>
          MediCode Institute offers a unique dual curriculum combining medical
          sciences and computer science. Learn from expert faculty, take
          interactive quizzes, and join live sessions — all in one platform.
        </StyledHeroSubtitle>
        <Link to="/courses">
          <Button variant="secondary" size="lg">
            Explore Courses
          </Button>
        </Link>
      </StyledHeroContent>
    </StyledHero>
  );
};

export default HeroSection;
