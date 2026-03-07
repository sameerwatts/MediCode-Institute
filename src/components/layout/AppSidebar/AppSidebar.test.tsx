import React from 'react';
import { render, screen, act } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import AppSidebar from './index';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth', () => ({ useAuth: jest.fn() }));

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({ push: mockPush })),
}));

const defaultAuth = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
};

const studentUser = {
  id: 'u1',
  name: 'Jane Doe',
  email: 'jane@test.com',
  role: 'student' as const,
  created_at: '2026-01-01T00:00:00Z',
};

const adminUser = {
  ...studentUser,
  role: 'admin' as const,
  name: 'Admin User',
};

beforeEach(() => {
  jest.clearAllMocks();
  (useAuth as jest.Mock).mockReturnValue({ ...defaultAuth });
});

// ─── Public variant ──────────────────────────────────────────────────────────

describe('AppSidebar — public variant', () => {
  const onClose = jest.fn();

  it('renders the brand logo', () => {
    render(<AppSidebar variant="public" onClose={onClose} />);
    expect(screen.getByText('Medi')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
  });

  it('does not render Admin Panel subtitle', () => {
    render(<AppSidebar variant="public" onClose={onClose} />);
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
  });

  it('renders all nav links', () => {
    render(<AppSidebar variant="public" onClose={onClose} />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All Courses' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Quiz' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Blogs' })).toBeInTheDocument();
  });

  it('renders nav links with correct hrefs', () => {
    render(<AppSidebar variant="public" onClose={onClose} />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'All Courses' })).toHaveAttribute('href', '/courses');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });

  it('renders nav with aria-label "Mobile navigation"', () => {
    render(<AppSidebar variant="public" onClose={onClose} />);
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument();
  });

  it('is hidden on desktop (wrapper has md:hidden class)', () => {
    render(<AppSidebar variant="public" onClose={onClose} />);
    const wrapper = screen.getByRole('navigation', { name: 'Mobile navigation' }).closest('div');
    expect(wrapper?.className).toContain('md:hidden');
  });

  it('calls onClose immediately when clicking the active link', async () => {
    render(<AppSidebar variant="public" onClose={onClose} />);
    await userEvent.click(screen.getByRole('link', { name: 'Home' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('navigates after 200ms delay when clicking a non-active link', async () => {
    jest.useFakeTimers();
    render(<AppSidebar variant="public" onClose={onClose} />);
    await userEvent.click(screen.getByRole('link', { name: 'All Courses' }));
    expect(onClose).not.toHaveBeenCalled();
    act(() => { jest.advanceTimersByTime(200); });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/courses');
    jest.useRealTimers();
  });

  describe('when not authenticated', () => {
    it('shows Login and Sign Up buttons', () => {
      render(<AppSidebar variant="public" onClose={onClose} />);
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    });

    it('Login link points to /login', () => {
      render(<AppSidebar variant="public" onClose={onClose} />);
      expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/login');
    });

    it('Sign Up link points to /signup', () => {
      render(<AppSidebar variant="public" onClose={onClose} />);
      expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/signup');
    });

    it('calls onClose when Login is clicked', async () => {
      render(<AppSidebar variant="public" onClose={onClose} />);
      await userEvent.click(screen.getByRole('link', { name: 'Login' }));
      expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when Sign Up is clicked', async () => {
      render(<AppSidebar variant="public" onClose={onClose} />);
      await userEvent.click(screen.getByRole('link', { name: 'Sign Up' }));
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('when authenticated as student', () => {
    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({
        ...defaultAuth,
        isAuthenticated: true,
        user: studentUser,
      });
    });

    it('shows user name', () => {
      render(<AppSidebar variant="public" onClose={onClose} />);
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('shows sign out button', () => {
      render(<AppSidebar variant="public" onClose={onClose} />);
      expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
    });

    it('does not show Login or Sign Up', () => {
      render(<AppSidebar variant="public" onClose={onClose} />);
      expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Sign Up' })).not.toBeInTheDocument();
    });

    it('does not show Admin Dashboard link', () => {
      render(<AppSidebar variant="public" onClose={onClose} />);
      expect(screen.queryByRole('link', { name: 'Admin Dashboard' })).not.toBeInTheDocument();
    });

    it('calls logout and onClose when sign out is clicked', async () => {
      const logoutMock = jest.fn();
      (useAuth as jest.Mock).mockReturnValue({
        ...defaultAuth,
        isAuthenticated: true,
        user: studentUser,
        logout: logoutMock,
      });
      render(<AppSidebar variant="public" onClose={onClose} />);
      await userEvent.click(screen.getByRole('button', { name: 'Sign out' }));
      expect(logoutMock).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('when authenticated as admin', () => {
    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({
        ...defaultAuth,
        isAuthenticated: true,
        user: adminUser,
      });
    });

    it('shows Admin Dashboard link', () => {
      render(<AppSidebar variant="public" onClose={onClose} />);
      expect(screen.getByRole('link', { name: 'Admin Dashboard' })).toBeInTheDocument();
    });

    it('Admin Dashboard link points to /admin/teacher-requests', () => {
      render(<AppSidebar variant="public" onClose={onClose} />);
      expect(screen.getByRole('link', { name: 'Admin Dashboard' })).toHaveAttribute(
        'href',
        '/admin/teacher-requests',
      );
    });
  });

  describe('when auth is loading', () => {
    it('does not render the auth section', () => {
      (useAuth as jest.Mock).mockReturnValue({ ...defaultAuth, isLoading: true });
      render(<AppSidebar variant="public" onClose={onClose} />);
      expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Sign Up' })).not.toBeInTheDocument();
    });
  });
});

// ─── Admin variant ───────────────────────────────────────────────────────────

describe('AppSidebar — admin variant', () => {
  const onClose = jest.fn();

  it('renders the brand logo', () => {
    render(<AppSidebar variant="admin" onClose={onClose} />);
    expect(screen.getByText('Medi')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
  });

  it('renders Admin Panel subtitle', () => {
    render(<AppSidebar variant="admin" onClose={onClose} />);
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('renders Teacher Requests link with correct href', () => {
    render(<AppSidebar variant="admin" onClose={onClose} />);
    const link = screen.getByRole('link', { name: 'Teacher Requests' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/admin/teacher-requests');
  });

  it('renders Students link with correct href', () => {
    render(<AppSidebar variant="admin" onClose={onClose} />);
    const link = screen.getByRole('link', { name: 'Students' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/admin/students');
  });

  it('renders nav with aria-label "Admin navigation"', () => {
    render(<AppSidebar variant="admin" onClose={onClose} />);
    expect(screen.getByRole('navigation', { name: 'Admin navigation' })).toBeInTheDocument();
  });

  it('renders Back to Home link pointing to /', () => {
    render(<AppSidebar variant="admin" onClose={onClose} />);
    const link = screen.getByRole('link', { name: /Back to Home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('calls onClose when Back to Home is clicked', async () => {
    render(<AppSidebar variant="admin" onClose={onClose} />);
    await userEvent.click(screen.getByRole('link', { name: /Back to Home/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('is visible on desktop (no md:hidden class on wrapper)', () => {
    render(<AppSidebar variant="admin" onClose={onClose} />);
    const nav = screen.getByRole('navigation', { name: 'Admin navigation' });
    const wrapper = nav.closest('aside');
    expect(wrapper?.className).not.toContain('md:hidden');
    expect(wrapper?.className).toContain('md:relative');
  });

  it('does not render Login or Sign Up buttons', () => {
    render(<AppSidebar variant="admin" onClose={onClose} />);
    expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sign Up' })).not.toBeInTheDocument();
  });

  it('calls onClose when a nav link is clicked on the current path', async () => {
    const { usePathname } = require('next/navigation');
    (usePathname as jest.Mock).mockReturnValue('/admin/teacher-requests');
    render(<AppSidebar variant="admin" onClose={onClose} />);
    await userEvent.click(screen.getByRole('link', { name: 'Teacher Requests' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
