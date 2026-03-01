import React from 'react';
import { render, screen } from '@/test-utils';
import AdminHeader from './index';

describe('AdminHeader', () => {
  it('renders the user name', () => {
    render(<AdminHeader userName="Sameer Watts" />);
    expect(screen.getByText('Sameer Watts')).toBeInTheDocument();
  });

  it('renders the user initial avatar', () => {
    render(<AdminHeader userName="Sameer Watts" />);
    expect(screen.getByText('S')).toBeInTheDocument();
  });

  it('renders a header element', () => {
    const { container } = render(<AdminHeader userName="Admin User" />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('shows first letter of name as avatar regardless of case', () => {
    render(<AdminHeader userName="john doe" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });
});
