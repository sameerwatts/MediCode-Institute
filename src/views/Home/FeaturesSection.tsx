import React from 'react';
import SectionHeading from '@/components/common/SectionHeading';

interface IFeature {
  icon: string;
  title: string;
  description: string;
}

const features: IFeature[] = [
  {
    icon: '\u{1F393}',
    title: 'Expert Faculty',
    description:
      'Learn from experienced doctors and tech professionals with years of teaching expertise.',
  },
  {
    icon: '\u{1F4DD}',
    title: 'Interactive Quizzes',
    description:
      'Test your knowledge with auto-graded quizzes and get instant feedback on your progress.',
  },
  {
    icon: '\u{23F0}',
    title: 'Flexible Learning',
    description:
      'Access recorded lectures anytime, anywhere. Learn at your own pace with lifetime access.',
  },
  {
    icon: '\u{1F4DA}',
    title: 'Dual Curriculum',
    description:
      'Unique blend of medical sciences and computer science courses under one roof.',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-section px-6 max-w-[1200px] mx-auto">
      <SectionHeading
        title="Why Choose MediCode?"
        subtitle="Everything you need for a successful learning journey"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white p-8 rounded-lg shadow-md text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-[2.5rem] mb-4">{feature.icon}</div>
            <h3 className="text-h4 text-dark mb-2">{feature.title}</h3>
            <p className="text-sm-text text-dark-gray leading-normal">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
