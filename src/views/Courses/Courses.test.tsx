import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import Courses from './index';

describe('Courses', () => {
  beforeEach(() => {
    render(<Courses />);
  });

  it('renders the page heading', () => {
    expect(screen.getByText('All Courses')).toBeInTheDocument();
  });

  it('renders all filter tabs', () => {
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Medical' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CS' })).toBeInTheDocument();
  });

  it('shows all 6 courses by default', () => {
    expect(screen.getByText('Complete Human Anatomy')).toBeInTheDocument();
    expect(screen.getByText('Clinical Cardiology Essentials')).toBeInTheDocument();
    expect(screen.getByText('Pharmacology Made Easy')).toBeInTheDocument();
    expect(screen.getByText('React & TypeScript Masterclass')).toBeInTheDocument();
    expect(screen.getByText('Data Structures & Algorithms')).toBeInTheDocument();
    expect(screen.getByText('Machine Learning with Python')).toBeInTheDocument();
  });

  it('filters to only medical courses when Medical tab is clicked', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Medical' }));
    expect(screen.getByText('Complete Human Anatomy')).toBeInTheDocument();
    expect(screen.getByText('Clinical Cardiology Essentials')).toBeInTheDocument();
    expect(screen.getByText('Pharmacology Made Easy')).toBeInTheDocument();
    expect(screen.queryByText('React & TypeScript Masterclass')).not.toBeInTheDocument();
    expect(screen.queryByText('Data Structures & Algorithms')).not.toBeInTheDocument();
  });

  it('filters to only CS courses when CS tab is clicked', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'CS' }));
    expect(screen.getByText('React & TypeScript Masterclass')).toBeInTheDocument();
    expect(screen.getByText('Data Structures & Algorithms')).toBeInTheDocument();
    expect(screen.getByText('Machine Learning with Python')).toBeInTheDocument();
    expect(screen.queryByText('Complete Human Anatomy')).not.toBeInTheDocument();
  });

  it('shows all courses again when All tab is clicked after filtering', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Medical' }));
    await userEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByText('Complete Human Anatomy')).toBeInTheDocument();
    expect(screen.getByText('React & TypeScript Masterclass')).toBeInTheDocument();
  });
});
