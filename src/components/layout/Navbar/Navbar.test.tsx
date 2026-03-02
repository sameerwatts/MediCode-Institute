import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import Navbar from './index';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/context/SidebarContext', () => ({
  useSidebar: jest.fn(() => ({
    isOpen: false,
    toggleMenu: jest.fn(),
    closeMenu: jest.fn(),
  })),
}));

const defaultAuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  (useAuth as jest.Mock).mockReturnValue({ ...defaultAuthState });
});

describe('Navbar', () => {
  it('renders the logo text', () => {
    render(<Navbar />);
    expect(screen.getByText(/Medi/)).toBeInTheDocument();
    expect(screen.getByText(/Code/)).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('All Courses')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(screen.getByText('Blogs')).toBeInTheDocument();
  });

  it('renders navigation links with correct hrefs', () => {
    render(<Navbar />);
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('All Courses').closest('a')).toHaveAttribute('href', '/courses');
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about');
    expect(screen.getByText('Quiz').closest('a')).toHaveAttribute('href', '/quiz');
    expect(screen.getByText('Blogs').closest('a')).toHaveAttribute('href', '/blogs');
  });

  it('renders the hamburger menu button', () => {
    render(<Navbar />);
    expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger is clicked', async () => {
    render(<Navbar />);
    const hamburger = screen.getByLabelText('Toggle menu');
    await userEvent.click(hamburger);
    expect(hamburger).toBeInTheDocument();
  });

  describe('when not authenticated', () => {
    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({
        ...defaultAuthState,
        isLoading: false,
        isAuthenticated: false,
      });
    });

    it('shows Login and Sign Up buttons', () => {
      render(<Navbar />);
      expect(screen.getAllByRole('button', { name: 'Login' }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('button', { name: 'Sign Up' }).length).toBeGreaterThan(0);
    });

    it('Login button links to /login', () => {
      render(<Navbar />);
      const loginLinks = screen.getAllByRole('link', { name: 'Login' });
      loginLinks.forEach((link) => expect(link).toHaveAttribute('href', '/login'));
    });

    it('Sign Up button links to /signup', () => {
      render(<Navbar />);
      const signupLinks = screen.getAllByRole('link', { name: 'Sign Up' });
      signupLinks.forEach((link) => expect(link).toHaveAttribute('href', '/signup'));
    });
  });

  describe('when authenticated', () => {
    const mockUser = {
      id: 'u1',
      name: 'Jane Doe',
      email: 'jane@test.com',
      role: 'student' as const,
      created_at: '',
    };

    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({
        ...defaultAuthState,
        isLoading: false,
        isAuthenticated: true,
        user: mockUser,
      });
    });

    it('shows the user name', () => {
      render(<Navbar />);
      expect(screen.getAllByText('Jane Doe').length).toBeGreaterThan(0);
    });

    it('shows Sign Out button', () => {
      render(<Navbar />);
      expect(screen.getAllByRole('button', { name: 'Sign Out' }).length).toBeGreaterThan(0);
    });

    it('does not show Login or Sign Up buttons', () => {
      render(<Navbar />);
      expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Sign Up' })).not.toBeInTheDocument();
    });

    it('does not show Admin Dashboard link for non-admin users', () => {
      render(<Navbar />);
      expect(screen.queryByRole('link', { name: 'Admin Dashboard' })).not.toBeInTheDocument();
    });
  });

  describe('when authenticated as admin', () => {
    const adminUser = {
      id: 'a1',
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin' as const,
      created_at: '',
    };

    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({
        ...defaultAuthState,
        isLoading: false,
        isAuthenticated: true,
        user: adminUser,
      });
    });

    it('shows Admin Dashboard link for admin users', () => {
      render(<Navbar />);
      expect(screen.getByRole('link', { name: 'Admin Dashboard' })).toHaveAttribute(
        'href',
        '/admin/teacher-requests',
      );
    });

    it('does not show Admin Dashboard link for non-admin', () => {
      (useAuth as jest.Mock).mockReturnValue({
        ...defaultAuthState,
        isLoading: false,
        isAuthenticated: true,
        user: { ...adminUser, role: 'student' as const },
      });
      render(<Navbar />);
      expect(screen.queryByRole('link', { name: 'Admin Dashboard' })).not.toBeInTheDocument();
    });

    it('calls logout when Sign Out is clicked', async () => {
      const logoutMock = jest.fn();
      (useAuth as jest.Mock).mockReturnValue({
        ...defaultAuthState,
        isLoading: false,
        isAuthenticated: true,
        user: adminUser,
        logout: logoutMock,
      });
      render(<Navbar />);
      const signOutButtons = screen.getAllByRole('button', { name: 'Sign Out' });
      await userEvent.click(signOutButtons[0]);
      expect(logoutMock).toHaveBeenCalledTimes(1);
    });
  });
});
