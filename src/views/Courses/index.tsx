'use client';

import React, { useState } from 'react';
import { courses } from '@/data/courses';
import CourseCard from '@/components/course/CourseCard';
import SectionHeading from '@/components/common/SectionHeading';

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
    <section className="py-8 pb-12 max-w-[1200px] mx-auto px-4">
      <SectionHeading
        title="All Courses"
        subtitle="Browse our comprehensive collection of courses"
      />

      <div className="flex gap-2 mb-8 flex-wrap">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setActiveFilter(option.value)}
            className={`px-6 py-2 rounded-full text-sm-text font-medium transition-colors duration-200
              ${activeFilter === option.value
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-light-gray text-dark-gray hover:bg-[#CBD5E1]'}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <p className="text-center text-gray text-body py-12 col-span-full">
            No courses found in this category.
          </p>
        )}
      </div>
    </section>
  );
};

export default Courses;
