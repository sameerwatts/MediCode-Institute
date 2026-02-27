import React from 'react';
import { render, screen } from '@/test-utils';
import CTASection from './CTASection';

describe('CTASection', () => {
  beforeEach(() => {
    render(<CTASection />);
  });

  it('renders the section heading', () => {
    expect(
      screen.getByRole('heading', { name: 'Start Your Learning Journey Today' })
    ).toBeInTheDocument();
  });

  it('renders the description text', () => {
    expect(screen.getByText(/thousands of students/i)).toBeInTheDocument();
  });

  it('renders the Browse All Courses CTA', () => {
    expect(screen.getByRole('button', { name: 'Browse All Courses' })).toBeInTheDocument();
  });

  it('CTA link points to /courses', () => {
    expect(screen.getByRole('link', { name: 'Browse All Courses' })).toHaveAttribute(
      'href',
      '/courses'
    );
  });
});
