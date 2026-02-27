import React from 'react';
import { render, screen } from '@/test-utils';
import FeaturesSection from './FeaturesSection';

describe('FeaturesSection', () => {
  beforeEach(() => {
    render(<FeaturesSection />);
  });

  it('renders the section heading', () => {
    expect(screen.getByText('Why Choose MediCode?')).toBeInTheDocument();
  });

  it('renders the section subtitle', () => {
    expect(
      screen.getByText('Everything you need for a successful learning journey')
    ).toBeInTheDocument();
  });

  it('renders all 4 feature titles', () => {
    expect(screen.getByText('Expert Faculty')).toBeInTheDocument();
    expect(screen.getByText('Interactive Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Flexible Learning')).toBeInTheDocument();
    expect(screen.getByText('Dual Curriculum')).toBeInTheDocument();
  });

  it('renders description text for each feature', () => {
    expect(screen.getByText(/experienced doctors and tech professionals/i)).toBeInTheDocument();
    expect(screen.getByText(/auto-graded quizzes/i)).toBeInTheDocument();
    expect(screen.getByText(/lifetime access/i)).toBeInTheDocument();
    expect(screen.getByText(/medical sciences and computer science courses/i)).toBeInTheDocument();
  });
});
