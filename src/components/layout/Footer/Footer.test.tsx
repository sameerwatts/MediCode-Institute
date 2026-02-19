import React from 'react';
import { render, screen } from '@/test-utils';
import Footer from './index';

describe('Footer', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('renders the brand name', () => {
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(/Medi/);
  });

  it('renders the brand tagline', () => {
    expect(screen.getByText(/Bridging the gap/)).toBeInTheDocument();
  });

  it('renders Quick Links section', () => {
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
  });

  it('renders Categories section', () => {
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('renders Support section', () => {
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders the copyright text with the current year', () => {
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    expect(screen.getByText(/MediCode Institute/)).toBeInTheDocument();
  });

  it('renders footer links with href attributes', () => {
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('href');
    });
    expect(links.length).toBeGreaterThan(0);
  });
});
