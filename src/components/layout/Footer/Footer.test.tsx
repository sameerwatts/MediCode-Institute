import React from 'react';
import { render, screen } from '@/test-utils';
import Footer from './index';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));
const mockUseAuth = jest.mocked(useAuth);

describe('Footer', () => {
  beforeEach(() => {
    // Default: logged-out user
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      login: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
    });
  });

  it('renders the brand name', () => {
    render(<Footer />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(/Medi/);
  });

  it('renders the brand tagline', () => {
    render(<Footer />);
    expect(screen.getByText(/Bridging the gap/)).toBeInTheDocument();
  });

  it('renders Quick Links section', () => {
    render(<Footer />);
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
  });

  it('renders Categories section', () => {
    render(<Footer />);
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('renders Support section', () => {
    render(<Footer />);
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders the copyright text with the current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    expect(screen.getByText(/MediCode Institute/)).toBeInTheDocument();
  });

  it('renders footer links with href attributes', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('href');
    });
    expect(links.length).toBeGreaterThan(0);
  });

  it('shows "Become a Teacher" link for logged-out users', () => {
    render(<Footer />);
    expect(screen.getByText('Become a Teacher')).toBeInTheDocument();
  });

  it('shows "Become a Teacher" link for students', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', name: 'Student', email: 's@test.com', role: 'student', created_at: '' },
      isLoading: false,
      isAuthenticated: true,
      login: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
    });
    render(<Footer />);
    expect(screen.getByText('Become a Teacher')).toBeInTheDocument();
  });

  it('hides "Become a Teacher" link for teachers', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '2', name: 'Teacher', email: 't@test.com', role: 'teacher', created_at: '' },
      isLoading: false,
      isAuthenticated: true,
      login: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
    });
    render(<Footer />);
    expect(screen.queryByText('Become a Teacher')).not.toBeInTheDocument();
  });

  it('hides "Become a Teacher" link for admins', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '3', name: 'Admin', email: 'a@test.com', role: 'admin', created_at: '' },
      isLoading: false,
      isAuthenticated: true,
      login: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
    });
    render(<Footer />);
    expect(screen.queryByText('Become a Teacher')).not.toBeInTheDocument();
  });
});
