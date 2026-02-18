import React, { useState } from 'react';
import { courses } from 'data/courses';
import CourseCard from 'components/course/CourseCard';
import PageWrapper from 'components/layout/PageWrapper';
import SectionHeading from 'components/common/SectionHeading';
import {
  StyledCoursesPage,
  StyledFilterTabs,
  StyledFilterTab,
  StyledCourseGrid,
  StyledEmptyState,
} from './styles';

type FilterCategory = 'all' | 'medical' | 'cs';

interface IFilterOption {
  label: string;
  value: FilterCategory;
}

const filterOptions: IFilterOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Medical', value: 'medical' },
  { label: 'CS', value: 'cs' },
];

const Courses: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filteredCourses =
    activeFilter === 'all'
      ? courses
      : courses.filter((course) => course.category === activeFilter);

  return (
    <PageWrapper>
      <StyledCoursesPage>
        <SectionHeading
          title="All Courses"
          subtitle="Browse our comprehensive collection of courses"
        />

        <StyledFilterTabs>
          {filterOptions.map((option) => (
            <StyledFilterTab
              key={option.value}
              $active={activeFilter === option.value}
              onClick={() => setActiveFilter(option.value)}
            >
              {option.label}
            </StyledFilterTab>
          ))}
        </StyledFilterTabs>

        <StyledCourseGrid>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <StyledEmptyState>No courses found in this category.</StyledEmptyState>
          )}
        </StyledCourseGrid>
      </StyledCoursesPage>
    </PageWrapper>
  );
};

export default Courses;
