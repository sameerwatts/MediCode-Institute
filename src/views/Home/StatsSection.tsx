'use client';

import React from 'react';
import ParallaxSection from '@/components/common/ParallaxSection';
import ScrollReveal from '@/components/common/ScrollReveal';

interface IStat {
  value: string;
  label: string;
}

const stats: IStat[] = [
  { value: '10,000+', label: 'Students' },
  { value: '50+', label: 'Courses' },
  { value: '20+', label: 'Teachers' },
  { value: '95%', label: 'Satisfaction' },
];

const StatsSection: React.FC = () => {
  return (
    <ParallaxSection
      imagePath="/images/parallax/stats-bg.jpg"
      overlayOpacity={70}
      minHeight="min-h-0"
    >
      <div className="py-section px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[1000px] mx-auto">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index}>
              <div className="text-center">
                <div className="text-h2 md:text-h1 font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm-text text-light-gray font-medium">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </ParallaxSection>
  );
};

export default StatsSection;
