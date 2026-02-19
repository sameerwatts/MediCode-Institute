import React from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-dark to-primary-dark text-white py-section px-6 text-center min-h-[70vh] flex items-center justify-center">
      <div className="max-w-[800px]">
        <h1 className="text-h2 md:text-h1 mb-4 leading-tight">Bridge Medicine &amp; Technology</h1>
        <p className="text-body md:text-[1.125rem] text-light-gray mb-8 max-w-[600px] mx-auto leading-relaxed">
          MediCode Institute offers a unique dual curriculum combining medical
          sciences and computer science. Learn from expert faculty, take
          interactive quizzes, and join live sessions — all in one platform.
        </p>
        <Link href="/courses">
          <Button variant="secondary" size="lg">
            Explore Courses
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
