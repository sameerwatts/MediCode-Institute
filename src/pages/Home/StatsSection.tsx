import React from 'react';
import {
  StyledStatsSection,
  StyledStatsGrid,
  StyledStatItem,
  StyledStatValue,
  StyledStatLabel,
} from './styles';

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
    <StyledStatsSection>
      <StyledStatsGrid>
        {stats.map((stat) => (
          <StyledStatItem key={stat.label}>
            <StyledStatValue>{stat.value}</StyledStatValue>
            <StyledStatLabel>{stat.label}</StyledStatLabel>
          </StyledStatItem>
        ))}
      </StyledStatsGrid>
    </StyledStatsSection>
  );
};

export default StatsSection;
