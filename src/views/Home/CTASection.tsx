import React from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import ParallaxSection from '@/components/common/ParallaxSection';

const CTASection: React.FC = () => {
  return (
    <ParallaxSection
      imagePath="/images/parallax/cta-bg.jpg"
      overlayOpacity={70}
      minHeight="min-h-0"
    >
      <div className="text-white py-section px-6 text-center">
        <h2 className="text-h2 mb-4">Start Your Learning Journey Today</h2>
        <p className="text-body opacity-90 mb-8 max-w-[500px] mx-auto leading-relaxed">
          Join thousands of students who are already bridging the gap between
          medicine and technology. Enroll in a course and start learning now.
        </p>
        <Link href="/courses">
          <Button variant="secondary" size="lg">
            Browse All Courses
          </Button>
        </Link>
      </div>
    </ParallaxSection>
  );
};

export default CTASection;
