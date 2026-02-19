import React from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import Button from '@/components/common/Button';
import { teachers } from '@/data/teachers';
import TeacherCard from './TeacherCard';

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
    <>
      {/* Mission / Vision */}
      <section className="py-section px-6 max-w-[1200px] mx-auto">
        <SectionHeading title="About MediCode Institute" subtitle="Where medicine meets technology" />
        <div className="max-w-[800px] mx-auto mb-12 text-center">
          <h3 className="text-h3 text-primary mb-4">Our Mission</h3>
          <p className="text-body text-dark-gray leading-[1.7]">
            At MediCode Institute, our mission is to bridge the gap between medical education
            and technology. We provide accessible, high-quality learning experiences that
            empower students from both medical and computer science backgrounds to excel in
            their careers.
          </p>
        </div>
        <div className="max-w-[800px] mx-auto mb-12 text-center">
          <h3 className="text-h3 text-primary mb-4">Our Vision</h3>
          <p className="text-body text-dark-gray leading-[1.7]">
            We envision a future where interdisciplinary knowledge is the norm — where
            doctors understand algorithms and engineers appreciate human biology. MediCode
            Institute aims to be the leading platform fostering this cross-disciplinary
            excellence.
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-section px-6 max-w-[1200px] mx-auto">
        <SectionHeading title="What We Offer" subtitle="Everything you need to learn, practice, and grow" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offerings.map((item) => (
            <div
              key={item.title}
              className="bg-white p-8 rounded-lg shadow-md text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-[2.5rem] mb-4">{item.icon}</div>
              <h4 className="text-h4 text-dark mb-2">{item.title}</h4>
              <p className="text-sm-text text-dark-gray leading-normal">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-section px-6 max-w-[1200px] mx-auto">
        <SectionHeading title="Meet Our Team" subtitle="Learn from the best in their fields" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-section px-6 text-center">
        <h2 className="text-h2 mb-4">Get in Touch</h2>
        <p className="text-body opacity-90 mb-8">
          Reach us at <a href="mailto:contact@medicode.in" className="text-white underline">contact@medicode.in</a>
        </p>
        <Button variant="secondary" size="lg">
          Contact Us
        </Button>
      </section>
    </>
  );
};

export default About;
