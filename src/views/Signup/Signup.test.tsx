import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import Signup from './index';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: mockPush, replace: mockReplace, back: jest.fn() })),
  usePathname: jest.fn(() => '/signup'),
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

describe('Signup', () => {
  describe('when not authenticated', () => {
    it('renders the Create Account heading', () => {
      render(<Signup />);
      expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    });

    it('renders all four form fields', () => {
      render(<Signup />);
      expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    });

    it('renders Sign In link pointing to /login', () => {
      render(<Signup />);
      expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute('href', '/login');
    });

    it('shows name error when name is too short', async () => {
      render(<Signup />);
      await userEvent.type(screen.getByLabelText('Full Name'), 'A');
      await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));
      await waitFor(() =>
        expect(
          screen.getByText('Name must be at least 2 characters'),
        ).toBeInTheDocument(),
      );
    });

    it('shows email validation error for invalid email', async () => {
      render(<Signup />);
      await userEvent.type(screen.getByLabelText('Full Name'), 'John Doe');
      await userEvent.type(screen.getByLabelText('Email Address'), 'notanemail');
      await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));
      await waitFor(() =>
        expect(screen.getByText('Enter a valid email address')).toBeInTheDocument(),
      );
    });

    it('shows password error when password is under 8 characters', async () => {
      render(<Signup />);
      await userEvent.type(screen.getByLabelText('Full Name'), 'John Doe');
      await userEvent.type(screen.getByLabelText('Email Address'), 'john@test.com');
      await userEvent.type(screen.getByLabelText('Password'), 'short');
      await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));
      await waitFor(() =>
        expect(
          screen.getByText('Password must be at least 8 characters'),
        ).toBeInTheDocument(),
      );
    });

    it('shows error when passwords do not match', async () => {
      render(<Signup />);
      await userEvent.type(screen.getByLabelText('Full Name'), 'John Doe');
      await userEvent.type(screen.getByLabelText('Email Address'), 'john@test.com');
      await userEvent.type(screen.getByLabelText('Password'), 'password123');
      await userEvent.type(screen.getByLabelText('Confirm Password'), 'different123');
      await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));
      await waitFor(() =>
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument(),
      );
    });

    it('calls signup() with name, email, and password on valid submission', async () => {
      const signupMock = jest.fn().mockResolvedValue(undefined);
      (useAuth as jest.Mock).mockReturnValue({ ...defaultAuthState, signup: signupMock });

      render(<Signup />);
      await userEvent.type(screen.getByLabelText('Full Name'), 'John Doe');
      await userEvent.type(screen.getByLabelText('Email Address'), 'john@test.com');
      await userEvent.type(screen.getByLabelText('Password'), 'password123');
      await userEvent.type(screen.getByLabelText('Confirm Password'), 'password123');
      await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));

      await waitFor(() =>
        expect(signupMock).toHaveBeenCalledWith('John Doe', 'john@test.com', 'password123'),
      );
    });

    it('redirects to /dashboard on successful signup', async () => {
      render(<Signup />);
      await userEvent.type(screen.getByLabelText('Full Name'), 'John Doe');
      await userEvent.type(screen.getByLabelText('Email Address'), 'john@test.com');
      await userEvent.type(screen.getByLabelText('Password'), 'password123');
      await userEvent.type(screen.getByLabelText('Confirm Password'), 'password123');
      await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));

      await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/dashboard'));
    });

    it('shows server error message on signup failure', async () => {
      const signupMock = jest.fn().mockRejectedValue(new Error('Email already in use.'));
      (useAuth as jest.Mock).mockReturnValue({ ...defaultAuthState, signup: signupMock });

      render(<Signup />);
      await userEvent.type(screen.getByLabelText('Full Name'), 'John Doe');
      await userEvent.type(screen.getByLabelText('Email Address'), 'john@test.com');
      await userEvent.type(screen.getByLabelText('Password'), 'password123');
      await userEvent.type(screen.getByLabelText('Confirm Password'), 'password123');
      await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));

      await waitFor(() =>
        expect(screen.getByRole('alert')).toHaveTextContent('Email already in use.'),
      );
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
      render(<Signup />);
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });
});
