import React from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';

const CTASection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-section px-6 text-center">
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
    </section>
  );
};

export default CTASection;
