import React from 'react';
import { render, screen } from '@/test-utils';
import StatusBadge from './index';

describe('StatusBadge', () => {
  it('renders "Pending" for pending status', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders "Approved" for approved status', () => {
    render(<StatusBadge status="approved" />);
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('renders "Rejected" for rejected status', () => {
    render(<StatusBadge status="rejected" />);
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('renders "Registered" for registered status', () => {
    render(<StatusBadge status="registered" />);
    expect(screen.getByText('Registered')).toBeInTheDocument();
  });

  it('renders a span element', () => {
    const { container } = render(<StatusBadge status="pending" />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('applies yellow classes for pending status', () => {
    render(<StatusBadge status="pending" />);
    const badge = screen.getByText('Pending');
    expect(badge).toHaveClass('bg-yellow-100');
    expect(badge).toHaveClass('text-yellow-800');
  });

  it('applies green classes for approved status', () => {
    render(<StatusBadge status="approved" />);
    const badge = screen.getByText('Approved');
    expect(badge).toHaveClass('bg-green-100');
    expect(badge).toHaveClass('text-green-800');
  });

  it('applies red classes for rejected status', () => {
    render(<StatusBadge status="rejected" />);
    const badge = screen.getByText('Rejected');
    expect(badge).toHaveClass('bg-red-100');
    expect(badge).toHaveClass('text-red-800');
  });

  it('applies blue classes for registered status', () => {
    render(<StatusBadge status="registered" />);
    const badge = screen.getByText('Registered');
    expect(badge).toHaveClass('bg-blue-100');
    expect(badge).toHaveClass('text-blue-800');
  });
});
