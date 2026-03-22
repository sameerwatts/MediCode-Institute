import React from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import ScrollReveal from '@/components/common/ScrollReveal';
import WelcomeBanner from '@/components/common/WelcomeBanner';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import PopularCourses from './PopularCourses';
import StatsSection from './StatsSection';
import CTASection from './CTASection';
import TeacherCTASection from './TeacherCTASection';

const Home: React.FC = () => {
  return (
    <>
      <WelcomeBanner />
      <HeroSection />

      <FeaturesSection />

      <PopularCourses />

      <section className="py-section px-6 max-w-[1200px] mx-auto">
        <ScrollReveal>
          <SectionHeading
            title="Explore Categories"
            subtitle="Two distinct paths, one powerful platform"
          />
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScrollReveal delay={0}>
            <div className="bg-gradient-to-br from-medical to-[#9333EA] text-white p-10 rounded-xl transition-transform duration-200 hover:-translate-y-1">
              <div className="text-[2.5rem] mb-4">{'\u{1FA7A}'}</div>
              <h3 className="text-h3 mb-2">Medical Sciences</h3>
              <p className="text-body opacity-90 leading-normal">
                Anatomy, Physiology, Pharmacology, Cardiology, and more. Prepare
                for NEET PG and other medical entrance exams with expert guidance.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <div className="bg-gradient-to-br from-cs to-[#3B82F6] text-white p-10 rounded-xl transition-transform duration-200 hover:-translate-y-1">
              <div className="text-[2.5rem] mb-4">{'\u{1F4BB}'}</div>
              <h3 className="text-h3 mb-2">Computer Science</h3>
              <p className="text-body opacity-90 leading-normal">
                Web Development, Data Structures, Machine Learning, and more.
                Build job-ready skills with hands-on projects and real-world code.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <StatsSection />

      <TeacherCTASection />

      <CTASection />
    </>
  );
};

export default Home;
