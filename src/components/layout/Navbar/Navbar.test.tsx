import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import Navbar from './index';

describe('Navbar', () => {
  beforeEach(() => {
    render(<Navbar />);
  });

  it('renders the logo text', () => {
    expect(screen.getByText(/Medi/)).toBeInTheDocument();
    expect(screen.getByText(/Code/)).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('All Courses')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(screen.getByText('Blogs')).toBeInTheDocument();
  });

  it('renders navigation links with correct hrefs', () => {
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('All Courses').closest('a')).toHaveAttribute('href', '/courses');
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about');
    expect(screen.getByText('Quiz').closest('a')).toHaveAttribute('href', '/quiz');
    expect(screen.getByText('Blogs').closest('a')).toHaveAttribute('href', '/blogs');
  });

  it('renders the hamburger menu button', () => {
    expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger is clicked', async () => {
    const hamburger = screen.getByLabelText('Toggle menu');
    await userEvent.click(hamburger);
    // The component should not crash after toggling
    expect(hamburger).toBeInTheDocument();
  });
});
