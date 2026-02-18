import React from 'react';
import SectionHeading from 'components/common/SectionHeading';
import {
  StyledSection,
  StyledFeaturesGrid,
  StyledFeatureCard,
  StyledFeatureIcon,
  StyledFeatureTitle,
  StyledFeatureDesc,
} from './styles';

interface IFeature {
  icon: string;
  title: string;
  description: string;
}

const features: IFeature[] = [
  {
    icon: '\u{1F393}',
    title: 'Expert Faculty',
    description:
      'Learn from experienced doctors and tech professionals with years of teaching expertise.',
  },
  {
    icon: '\u{1F4DD}',
    title: 'Interactive Quizzes',
    description:
      'Test your knowledge with auto-graded quizzes and get instant feedback on your progress.',
  },
  {
    icon: '\u{23F0}',
    title: 'Flexible Learning',
    description:
      'Access recorded lectures anytime, anywhere. Learn at your own pace with lifetime access.',
  },
  {
    icon: '\u{1F4DA}',
    title: 'Dual Curriculum',
    description:
      'Unique blend of medical sciences and computer science courses under one roof.',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <StyledSection>
      <SectionHeading
        title="Why Choose MediCode?"
        subtitle="Everything you need for a successful learning journey"
      />
      <StyledFeaturesGrid>
        {features.map((feature) => (
          <StyledFeatureCard key={feature.title}>
            <StyledFeatureIcon>{feature.icon}</StyledFeatureIcon>
            <StyledFeatureTitle>{feature.title}</StyledFeatureTitle>
            <StyledFeatureDesc>{feature.description}</StyledFeatureDesc>
          </StyledFeatureCard>
        ))}
      </StyledFeaturesGrid>
    </StyledSection>
  );
};

export default FeaturesSection;
