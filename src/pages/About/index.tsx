import React from 'react';
import PageWrapper from 'components/layout/PageWrapper';
import SectionHeading from 'components/common/SectionHeading';
import Button from 'components/common/Button';
import { teachers } from 'data/teachers';
import TeacherCard from './TeacherCard';
import {
  StyledSection,
  StyledMissionBlock,
  StyledMissionTitle,
  StyledMissionText,
  StyledOfferGrid,
  StyledOfferCard,
  StyledOfferIcon,
  StyledOfferTitle,
  StyledOfferDesc,
  StyledTeamGrid,
  StyledContactSection,
  StyledContactTitle,
  StyledContactEmail,
} from './styles';

interface IOfferItem {
  icon: string;
  title: string;
  description: string;
}

const offerings: IOfferItem[] = [
  {
    icon: '🩺',
    title: 'Medical Courses',
    description: 'Comprehensive courses in anatomy, cardiology, pathology, and more — taught by experienced doctors.',
  },
  {
    icon: '💻',
    title: 'CS Courses',
    description: 'Industry-ready courses in web development, data science, AI/ML, and system design.',
  },
  {
    icon: '📝',
    title: 'Interactive Quizzes',
    description: 'Test your knowledge with topic-wise quizzes designed to reinforce learning and track progress.',
  },
  {
    icon: '🎥',
    title: 'Live Sessions',
    description: 'Join live classes and doubt-clearing sessions with instructors via integrated video conferencing.',
  },
];

const About: React.FC = () => {
  return (
    <PageWrapper>
      {/* Mission / Vision */}
      <StyledSection>
        <SectionHeading title="About MediCode Institute" subtitle="Where medicine meets technology" />
        <StyledMissionBlock>
          <StyledMissionTitle>Our Mission</StyledMissionTitle>
          <StyledMissionText>
            At MediCode Institute, our mission is to bridge the gap between medical education
            and technology. We provide accessible, high-quality learning experiences that
            empower students from both medical and computer science backgrounds to excel in
            their careers.
          </StyledMissionText>
        </StyledMissionBlock>
        <StyledMissionBlock>
          <StyledMissionTitle>Our Vision</StyledMissionTitle>
          <StyledMissionText>
            We envision a future where interdisciplinary knowledge is the norm — where
            doctors understand algorithms and engineers appreciate human biology. MediCode
            Institute aims to be the leading platform fostering this cross-disciplinary
            excellence.
          </StyledMissionText>
        </StyledMissionBlock>
      </StyledSection>

      {/* What We Offer */}
      <StyledSection>
        <SectionHeading title="What We Offer" subtitle="Everything you need to learn, practice, and grow" />
        <StyledOfferGrid>
          {offerings.map((item) => (
            <StyledOfferCard key={item.title}>
              <StyledOfferIcon>{item.icon}</StyledOfferIcon>
              <StyledOfferTitle>{item.title}</StyledOfferTitle>
              <StyledOfferDesc>{item.description}</StyledOfferDesc>
            </StyledOfferCard>
          ))}
        </StyledOfferGrid>
      </StyledSection>

      {/* Team */}
      <StyledSection>
        <SectionHeading title="Meet Our Team" subtitle="Learn from the best in their fields" />
        <StyledTeamGrid>
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </StyledTeamGrid>
      </StyledSection>

      {/* Contact CTA */}
      <StyledContactSection>
        <StyledContactTitle>Get in Touch</StyledContactTitle>
        <StyledContactEmail>
          Reach us at <a href="mailto:contact@medicode.in">contact@medicode.in</a>
        </StyledContactEmail>
        <Button variant="secondary" size="lg">
          Contact Us
        </Button>
      </StyledContactSection>
    </PageWrapper>
  );
};

export default About;
