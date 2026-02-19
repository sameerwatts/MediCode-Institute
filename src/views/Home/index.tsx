import React from 'react';
import Link from 'next/link';
import SectionHeading from '@/components/common/SectionHeading';
import CourseCard from '@/components/course/CourseCard';
import Button from '@/components/common/Button';
import { courses } from '@/data/courses';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import StatsSection from './StatsSection';
import CTASection from './CTASection';

const popularCourses = courses.slice(0, 3);

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />

      <FeaturesSection />

      <section className="py-section px-6 max-w-[1200px] mx-auto">
        <SectionHeading
          title="Popular Courses"
          subtitle="Start learning with our most enrolled courses"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/courses">
            <Button variant="outline">View All Courses</Button>
          </Link>
        </div>
      </section>

      <section className="py-section px-6 max-w-[1200px] mx-auto">
        <SectionHeading
          title="Explore Categories"
          subtitle="Two distinct paths, one powerful platform"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-medical to-[#9333EA] text-white p-10 rounded-xl transition-transform duration-200 hover:-translate-y-1">
            <div className="text-[2.5rem] mb-4">{'\u{1FA7A}'}</div>
            <h3 className="text-h3 mb-2">Medical Sciences</h3>
            <p className="text-body opacity-90 leading-normal">
              Anatomy, Physiology, Pharmacology, Cardiology, and more. Prepare
              for NEET PG and other medical entrance exams with expert guidance.
            </p>
          </div>
          <div className="bg-gradient-to-br from-cs to-[#3B82F6] text-white p-10 rounded-xl transition-transform duration-200 hover:-translate-y-1">
            <div className="text-[2.5rem] mb-4">{'\u{1F4BB}'}</div>
            <h3 className="text-h3 mb-2">Computer Science</h3>
            <p className="text-body opacity-90 leading-normal">
              Web Development, Data Structures, Machine Learning, and more.
              Build job-ready skills with hands-on projects and real-world code.
            </p>
          </div>
        </div>
      </section>

      <StatsSection />

      <CTASection />
    </>
  );
};

export default Home;
