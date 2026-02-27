import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import SidebarDrawer from './index';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/context/SidebarContext';

jest.mock('@/hooks/useAuth', () => ({ useAuth: jest.fn() }));
jest.mock('@/context/SidebarContext', () => ({ useSidebar: jest.fn() }));

const mockPush = jest.fn();
const mockCloseMenu = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({ push: mockPush })),
}));

const defaultSidebar = { isOpen: false, toggleMenu: jest.fn(), closeMenu: mockCloseMenu };
const defaultAuth = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
};

const mockUser = {
  id: 'u1',
  name: 'Jane Doe',
  email: 'jane@test.com',
  role: 'student' as const,
  created_at: '2026-01-01T00:00:00Z',
};

beforeEach(() => {
  jest.clearAllMocks();
  (useSidebar as jest.Mock).mockReturnValue({ ...defaultSidebar });
  (useAuth as jest.Mock).mockReturnValue({ ...defaultAuth });
});

describe('SidebarDrawer', () => {
  it('renders the brand logo', () => {
    render(<SidebarDrawer />);
    expect(screen.getByText('Medi')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<SidebarDrawer />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All Courses' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Quiz' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Blogs' })).toBeInTheDocument();
  });

  it('renders navigation links with correct hrefs', () => {
    render(<SidebarDrawer />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'All Courses' })).toHaveAttribute('href', '/courses');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'Quiz' })).toHaveAttribute('href', '/quiz');
    expect(screen.getByRole('link', { name: 'Blogs' })).toHaveAttribute('href', '/blogs');
  });

  describe('when not authenticated', () => {
    it('shows Login and Sign Up buttons', () => {
      render(<SidebarDrawer />);
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    });

    it('Login button links to /login', () => {
      render(<SidebarDrawer />);
      expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/login');
    });

    it('Sign Up button links to /signup', () => {
      render(<SidebarDrawer />);
      expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/signup');
    });

    it('calls closeMenu when Login link is clicked', async () => {
      render(<SidebarDrawer />);
      await userEvent.click(screen.getByRole('link', { name: 'Login' }));
      expect(mockCloseMenu).toHaveBeenCalled();
    });

    it('calls closeMenu when Sign Up link is clicked', async () => {
      render(<SidebarDrawer />);
      await userEvent.click(screen.getByRole('link', { name: 'Sign Up' }));
      expect(mockCloseMenu).toHaveBeenCalled();
    });
  });

  describe('when authenticated', () => {
    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({
        ...defaultAuth,
        isAuthenticated: true,
        user: mockUser,
      });
    });

    it('shows the user full name', () => {
      render(<SidebarDrawer />);
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('shows the sign out button', () => {
      render(<SidebarDrawer />);
      expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
    });

    it('does not show Login or Sign Up buttons', () => {
      render(<SidebarDrawer />);
      expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Sign Up' })).not.toBeInTheDocument();
    });

    it('calls logout and closeMenu when sign out is clicked', async () => {
      const logoutMock = jest.fn();
      (useAuth as jest.Mock).mockReturnValue({
        ...defaultAuth,
        isAuthenticated: true,
        user: mockUser,
        logout: logoutMock,
      });
      render(<SidebarDrawer />);
      await userEvent.click(screen.getByRole('button', { name: 'Sign out' }));
      expect(logoutMock).toHaveBeenCalledTimes(1);
      expect(mockCloseMenu).toHaveBeenCalledTimes(1);
    });
  });

  describe('when auth is loading', () => {
    it('does not render the auth section', () => {
      (useAuth as jest.Mock).mockReturnValue({ ...defaultAuth, isLoading: true });
      render(<SidebarDrawer />);
      expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Sign Up' })).not.toBeInTheDocument();
    });
  });

  describe('nav link click on current path', () => {
    it('calls closeMenu immediately when clicking the active link', async () => {
      // pathname is '/' and Home link href is '/' — same path, closes immediately
      render(<SidebarDrawer />);
      await userEvent.click(screen.getByRole('link', { name: 'Home' }));
      expect(mockCloseMenu).toHaveBeenCalledTimes(1);
    });
  });
});
