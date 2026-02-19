import React from 'react';

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
    <section className="bg-primary-light py-section px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[1000px] mx-auto">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-h2 md:text-h1 font-bold text-primary mb-1">{stat.value}</div>
            <div className="text-sm-text text-dark-gray font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
