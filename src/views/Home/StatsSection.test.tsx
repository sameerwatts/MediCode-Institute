import React from 'react';
import { render, screen } from '@/test-utils';
import StatsSection from './StatsSection';

describe('StatsSection', () => {
  beforeEach(() => {
    render(<StatsSection />);
  });

  it('renders all stat values', () => {
    expect(screen.getByText('10,000+')).toBeInTheDocument();
    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText('20+')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('renders all stat labels', () => {
    expect(screen.getByText('Students')).toBeInTheDocument();
    expect(screen.getByText('Courses')).toBeInTheDocument();
    expect(screen.getByText('Teachers')).toBeInTheDocument();
    expect(screen.getByText('Satisfaction')).toBeInTheDocument();
  });
});
