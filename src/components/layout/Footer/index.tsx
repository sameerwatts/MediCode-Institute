import React from 'react';
import {
  StyledFooter,
  StyledFooterContainer,
  StyledFooterBrand,
  StyledFooterColumn,
  StyledFooterLink,
  StyledCopyright,
} from './styles';

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <StyledFooterContainer>
        <StyledFooterBrand>
          <h3>
            Medi<span>Code</span>
          </h3>
          <p>
            Bridging the gap between medical education and technology.
            Learn from industry experts at your own pace.
          </p>
        </StyledFooterBrand>

        <StyledFooterColumn>
          <h4>Quick Links</h4>
          <StyledFooterLink to="/">Home</StyledFooterLink>
          <StyledFooterLink to="/courses">All Courses</StyledFooterLink>
          <StyledFooterLink to="/about">About Us</StyledFooterLink>
          <StyledFooterLink to="/blogs">Blog</StyledFooterLink>
        </StyledFooterColumn>

        <StyledFooterColumn>
          <h4>Categories</h4>
          <StyledFooterLink to="/courses">Medical Sciences</StyledFooterLink>
          <StyledFooterLink to="/courses">Computer Science</StyledFooterLink>
          <StyledFooterLink to="/quiz">Practice Quizzes</StyledFooterLink>
        </StyledFooterColumn>

        <StyledFooterColumn>
          <h4>Support</h4>
          <StyledFooterLink to="/about">Contact Us</StyledFooterLink>
          <StyledFooterLink to="/about">FAQ</StyledFooterLink>
          <StyledFooterLink to="/about">Privacy Policy</StyledFooterLink>
        </StyledFooterColumn>
      </StyledFooterContainer>

      <StyledCopyright>
        &copy; {new Date().getFullYear()} MediCode Institute. All rights reserved.
      </StyledCopyright>
    </StyledFooter>
  );
};

export default Footer;
