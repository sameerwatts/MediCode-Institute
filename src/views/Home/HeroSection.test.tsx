import React from 'react';
import { render, screen } from '@/test-utils';
import HeroSection from './HeroSection';

describe('HeroSection', () => {
  beforeEach(() => {
    render(<HeroSection />);
  });

  it('renders the main heading', () => {
    expect(
      screen.getByRole('heading', { level: 1, name: /Bridge Medicine & Technology/i })
    ).toBeInTheDocument();
  });

  it('renders the subtitle paragraph', () => {
    expect(screen.getByText(/unique dual curriculum/i)).toBeInTheDocument();
  });

  it('renders the Explore Courses CTA', () => {
    expect(screen.getByRole('button', { name: 'Explore Courses' })).toBeInTheDocument();
  });

  it('CTA link points to /courses', () => {
    expect(screen.getByRole('link', { name: 'Explore Courses' })).toHaveAttribute(
      'href',
      '/courses'
    );
  });
});
