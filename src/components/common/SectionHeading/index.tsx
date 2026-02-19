import React from 'react';

interface ISectionHeadingProps {
  title: string;
  subtitle?: string;
}

const SectionHeading: React.FC<ISectionHeadingProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-h2 font-bold text-dark mb-3">{title}</h2>
      {subtitle && <p className="text-body text-dark-gray">{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;
