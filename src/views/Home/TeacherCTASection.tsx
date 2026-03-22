'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import ScrollReveal from '@/components/common/ScrollReveal';

const TeacherCTASection: React.FC = () => {
  const { user } = useAuth();

  // Hide for teachers and admins
  if (user && user.role !== 'student') return null;

  return (
    <section className="py-section px-6">
      <ScrollReveal>
      <div className="max-w-[1200px] mx-auto rounded-xl bg-gradient-to-br from-secondary to-secondary-dark p-12 text-center text-white">
        <h2 className="text-h2 font-extrabold mb-4">Share Your Expertise</h2>
        <p className="text-body opacity-90 mb-8 max-w-[600px] mx-auto leading-relaxed">
          Are you a medical professional or tech expert? Join our platform and
          inspire the next generation of learners.
        </p>
        <Link
          href="/become-a-teacher"
          className="inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200 px-8 py-4 text-h4 border-2 border-white text-white hover:bg-white/20"
        >
          Apply to Teach
        </Link>
      </div>
      </ScrollReveal>
    </section>
  );
};

export default TeacherCTASection;
