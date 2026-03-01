import React from 'react';
import { render, screen, fireEvent } from '@/test-utils';
import AdminSidebar from './index';

describe('AdminSidebar', () => {
  it('renders the MediCode brand name', () => {
    render(<AdminSidebar onLogout={() => {}} />);
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('renders the Teacher Requests nav link', () => {
    render(<AdminSidebar onLogout={() => {}} />);
    expect(
      screen.getByRole('link', { name: 'Teacher Requests' }),
    ).toBeInTheDocument();
  });

  it('Teacher Requests link points to correct href', () => {
    render(<AdminSidebar onLogout={() => {}} />);
    const link = screen.getByRole('link', { name: 'Teacher Requests' });
    expect(link).toHaveAttribute('href', '/admin/teacher-requests');
  });

  it('renders the Sign Out button', () => {
    render(<AdminSidebar onLogout={() => {}} />);
    expect(
      screen.getByRole('button', { name: /Sign Out/i }),
    ).toBeInTheDocument();
  });

  it('calls onLogout when Sign Out is clicked', () => {
    const onLogout = jest.fn();
    render(<AdminSidebar onLogout={onLogout} />);
    fireEvent.click(screen.getByRole('button', { name: /Sign Out/i }));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('renders the nav with aria-label', () => {
    render(<AdminSidebar onLogout={() => {}} />);
    expect(screen.getByRole('navigation', { name: 'Admin navigation' })).toBeInTheDocument();
  });
});
