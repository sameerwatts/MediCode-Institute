import React from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import ParallaxSection from '@/components/common/ParallaxSection';

const HeroSection: React.FC = () => {
  return (
    <ParallaxSection
      imagePath="/images/parallax/hero-bg.jpg"
      overlayOpacity={65}
      minHeight="min-h-[70vh]"
    >
      <div className="text-white py-section px-6 text-center flex items-center justify-center">
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
      </div>
    </ParallaxSection>
  );
};

export default HeroSection;
