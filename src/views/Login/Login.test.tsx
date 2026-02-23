import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import Login from './index';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: mockPush, replace: mockReplace, back: jest.fn() })),
  usePathname: jest.fn(() => '/login'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

const defaultAuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: jest.fn().mockResolvedValue(undefined),
  signup: jest.fn().mockResolvedValue(undefined),
  logout: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  (useAuth as jest.Mock).mockReturnValue({ ...defaultAuthState });
});

describe('Login', () => {
  describe('when not authenticated', () => {
    it('renders the Welcome Back heading', () => {
      render(<Login />);
      expect(screen.getByRole('heading', { name: 'Welcome Back' })).toBeInTheDocument();
    });

    it('renders email input', () => {
      render(<Login />);
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    });

    it('renders password input', () => {
      render(<Login />);
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders Sign Up link pointing to /signup', () => {
      render(<Login />);
      expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/signup');
    });

    it('shows email validation error when submitted with empty email', async () => {
      render(<Login />);
      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));
      await waitFor(() =>
        expect(screen.getByText('Email is required')).toBeInTheDocument(),
      );
    });

    it('shows password validation error when password is too short', async () => {
      render(<Login />);
      await userEvent.type(screen.getByLabelText('Email Address'), 'user@test.com');
      await userEvent.type(screen.getByLabelText('Password'), '123');
      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));
      await waitFor(() =>
        expect(
          screen.getByText('Password must be at least 6 characters'),
        ).toBeInTheDocument(),
      );
    });

    it('calls login() with correct credentials on valid submission', async () => {
      const loginMock = jest.fn().mockResolvedValue(undefined);
      (useAuth as jest.Mock).mockReturnValue({ ...defaultAuthState, login: loginMock });

      render(<Login />);
      await userEvent.type(screen.getByLabelText('Email Address'), 'user@test.com');
      await userEvent.type(screen.getByLabelText('Password'), 'password123');
      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() =>
        expect(loginMock).toHaveBeenCalledWith('user@test.com', 'password123'),
      );
    });

    it('redirects to /dashboard on successful login', async () => {
      render(<Login />);
      await userEvent.type(screen.getByLabelText('Email Address'), 'user@test.com');
      await userEvent.type(screen.getByLabelText('Password'), 'password123');
      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/dashboard'));
    });

    it('shows server error message when login throws', async () => {
      const loginMock = jest.fn().mockRejectedValue(new Error('Invalid email or password.'));
      (useAuth as jest.Mock).mockReturnValue({ ...defaultAuthState, login: loginMock });

      render(<Login />);
      await userEvent.type(screen.getByLabelText('Email Address'), 'user@test.com');
      await userEvent.type(screen.getByLabelText('Password'), 'wrongpass');
      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() =>
        expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password.'),
      );
    });

    it('shows password toggle button', () => {
      render(<Login />);
      expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
    });
  });

  describe('when already authenticated', () => {
    it('calls router.replace with /dashboard', () => {
      (useAuth as jest.Mock).mockReturnValue({
        ...defaultAuthState,
        isLoading: false,
        isAuthenticated: true,
        user: { id: '1', name: 'Test User', email: 'test@test.com', role: 'student', created_at: '' },
      });
      render(<Login />);
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });
});
