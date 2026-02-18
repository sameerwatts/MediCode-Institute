import React from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from 'components/layout/PageWrapper';
import SectionHeading from 'components/common/SectionHeading';
import CourseCard from 'components/course/CourseCard';
import Button from 'components/common/Button';
import { courses } from 'data/courses';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import StatsSection from './StatsSection';
import CTASection from './CTASection';
import {
  StyledSection,
  StyledCoursesGrid,
  StyledCategoriesGrid,
  StyledCategoryCard,
  StyledCategoryIcon,
  StyledCategoryTitle,
  StyledCategoryDesc,
} from './styles';

const popularCourses = courses.slice(0, 3);

const Home: React.FC = () => {
  return (
    <PageWrapper>
      <HeroSection />

      <FeaturesSection />

      <StyledSection>
        <SectionHeading
          title="Popular Courses"
          subtitle="Start learning with our most enrolled courses"
        />
        <StyledCoursesGrid>
          {popularCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </StyledCoursesGrid>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/courses">
            <Button variant="outline">View All Courses</Button>
          </Link>
        </div>
      </StyledSection>

      <StyledSection>
        <SectionHeading
          title="Explore Categories"
          subtitle="Two distinct paths, one powerful platform"
        />
        <StyledCategoriesGrid>
          <StyledCategoryCard $variant="medical">
            <StyledCategoryIcon>{'\u{1FA7A}'}</StyledCategoryIcon>
            <StyledCategoryTitle>Medical Sciences</StyledCategoryTitle>
            <StyledCategoryDesc>
              Anatomy, Physiology, Pharmacology, Cardiology, and more. Prepare
              for NEET PG and other medical entrance exams with expert guidance.
            </StyledCategoryDesc>
          </StyledCategoryCard>
          <StyledCategoryCard $variant="cs">
            <StyledCategoryIcon>{'\u{1F4BB}'}</StyledCategoryIcon>
            <StyledCategoryTitle>Computer Science</StyledCategoryTitle>
            <StyledCategoryDesc>
              Web Development, Data Structures, Machine Learning, and more.
              Build job-ready skills with hands-on projects and real-world code.
            </StyledCategoryDesc>
          </StyledCategoryCard>
        </StyledCategoriesGrid>
      </StyledSection>

      <StatsSection />

      <CTASection />
    </PageWrapper>
  );
};

export default Home;
