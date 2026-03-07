import React from 'react';
import { render, screen } from '@/test-utils';
import AdminSidebar from './index';

describe('AdminSidebar', () => {
  it('renders the MediCode brand name', () => {
    render(<AdminSidebar />);
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('renders the Teacher Requests nav link', () => {
    render(<AdminSidebar />);
    expect(
      screen.getByRole('link', { name: 'Teacher Requests' }),
    ).toBeInTheDocument();
  });

  it('Teacher Requests link points to correct href', () => {
    render(<AdminSidebar />);
    const link = screen.getByRole('link', { name: 'Teacher Requests' });
    expect(link).toHaveAttribute('href', '/admin/teacher-requests');
  });

  it('renders the Back to Home link', () => {
    render(<AdminSidebar />);
    expect(
      screen.getByRole('link', { name: /Back to Home/i }),
    ).toBeInTheDocument();
  });

  it('Back to Home link points to /', () => {
    render(<AdminSidebar />);
    const link = screen.getByRole('link', { name: /Back to Home/i });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the nav with aria-label', () => {
    render(<AdminSidebar />);
    expect(screen.getByRole('navigation', { name: 'Admin navigation' })).toBeInTheDocument();
  });

  it('renders the Students nav link', () => {
    render(<AdminSidebar />);
    expect(
      screen.getByRole('link', { name: 'Students' }),
    ).toBeInTheDocument();
  });

  it('Students link points to correct href', () => {
    render(<AdminSidebar />);
    const link = screen.getByRole('link', { name: 'Students' });
    expect(link).toHaveAttribute('href', '/admin/students');
  });
});
