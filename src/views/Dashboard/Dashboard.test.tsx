import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import Dashboard from './index';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: mockPush, replace: mockReplace, back: jest.fn() })),
  usePathname: jest.fn(() => '/dashboard'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

const mockUser = {
  id: 'u1',
  name: 'Jane Doe',
  email: 'jane@test.com',
  role: 'student' as const,
  created_at: '2026-01-01T00:00:00Z',
};

const authenticatedState = {
  user: mockUser,
  isLoading: false,
  isAuthenticated: true,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Dashboard', () => {
  describe('when authenticated', () => {
    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({ ...authenticatedState });
    });

    it('renders welcome message with first name', () => {
      render(<Dashboard />);
      expect(screen.getByRole('heading', { name: /welcome back, jane/i })).toBeInTheDocument();
    });

    it('renders user email', () => {
      render(<Dashboard />);
      expect(screen.getByText('jane@test.com')).toBeInTheDocument();
    });

    it('renders user full name', () => {
      render(<Dashboard />);
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('renders role badge with correct text', () => {
      render(<Dashboard />);
      expect(screen.getByText('student')).toBeInTheDocument();
    });

    it('renders Sign Out button', () => {
      render(<Dashboard />);
      expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
    });

    it('calls logout() and navigates to / when Sign Out is clicked', async () => {
      const logoutMock = jest.fn();
      (useAuth as jest.Mock).mockReturnValue({ ...authenticatedState, logout: logoutMock });

      render(<Dashboard />);
      await userEvent.click(screen.getByRole('button', { name: 'Sign Out' }));

      expect(logoutMock).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('when loading', () => {
    it('renders Loader when isLoading is true', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isLoading: true,
        isAuthenticated: false,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
      });
      render(<Dashboard />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('when not authenticated', () => {
    it('calls router.replace with /login', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
      });
      render(<Dashboard />);
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });

    it('renders nothing (null) when not loading and not authenticated', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
      });
      const { container } = render(<Dashboard />);
      expect(container).toBeEmptyDOMElement();
    });
  });
});
