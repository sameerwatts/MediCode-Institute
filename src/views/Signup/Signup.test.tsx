import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import Signup from './index';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'next/navigation';
import * as authService from '@/services/authService';

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/services/authService', () => ({
  validateInviteToken: jest.fn(),
  getMe: jest.fn().mockResolvedValue(null),
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
}));

const mockValidateInviteToken = jest.mocked(authService.validateInviteToken);

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
  (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
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

    it('redirects to / on successful signup', async () => {
      render(<Signup />);
      await userEvent.type(screen.getByLabelText('Full Name'), 'John Doe');
      await userEvent.type(screen.getByLabelText('Email Address'), 'john@test.com');
      await userEvent.type(screen.getByLabelText('Password'), 'password123');
      await userEvent.type(screen.getByLabelText('Confirm Password'), 'password123');
      await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));

      await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));
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
    it('calls router.replace with /', () => {
      (useAuth as jest.Mock).mockReturnValue({
        ...defaultAuthState,
        isLoading: false,
        isAuthenticated: true,
        user: { id: '1', name: 'Test User', email: 'test@test.com', role: 'student', created_at: '' },
      });
      render(<Signup />);
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });

  describe('with a valid invite token', () => {
    beforeEach(() => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('invite=test-token'));
      mockValidateInviteToken.mockResolvedValue({
        valid: true,
        name: 'Dr. Jane Smith',
        email: 'jane@example.com',
      });
    });

    it('shows loader while token is being validated', () => {
      mockValidateInviteToken.mockReturnValue(new Promise(() => {}));
      render(<Signup />);
      expect(screen.queryByRole('heading', { name: 'Create Account' })).not.toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Complete Your Registration' })).not.toBeInTheDocument();
    });

    it('renders "Complete Your Registration" heading after validation', async () => {
      render(<Signup />);
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Complete Your Registration' }),
        ).toBeInTheDocument();
      });
    });

    it('pre-fills name and email from invite data', async () => {
      render(<Signup />);
      await waitFor(() => {
        expect(screen.getByLabelText('Full Name')).toHaveValue('Dr. Jane Smith');
        expect(screen.getByLabelText('Email Address')).toHaveValue('jane@example.com');
      });
    });

    it('calls signup with the invite token and redirects to /teacher/onboarding', async () => {
      const signupMock = jest.fn().mockResolvedValue(undefined);
      (useAuth as jest.Mock).mockReturnValue({ ...defaultAuthState, signup: signupMock });

      render(<Signup />);

      // Wait for reset() to have run — name field shows pre-filled value
      await waitFor(() => {
        expect(screen.getByLabelText('Full Name')).toHaveValue('Dr. Jane Smith');
      });

      await userEvent.type(screen.getByLabelText('Password'), 'password123');
      await userEvent.type(screen.getByLabelText('Confirm Password'), 'password123');
      await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));

      await waitFor(() => {
        expect(signupMock).toHaveBeenCalledWith(
          'Dr. Jane Smith',
          'jane@example.com',
          'password123',
          'test-token',
        );
        expect(mockPush).toHaveBeenCalledWith('/teacher/onboarding');
      });
    });

    it('does not render the "Sign In" link', async () => {
      render(<Signup />);
      await waitFor(() =>
        screen.getByRole('heading', { name: 'Complete Your Registration' }),
      );
      expect(screen.queryByRole('link', { name: 'Sign In' })).not.toBeInTheDocument();
    });
  });

  describe('with an expired invite token', () => {
    beforeEach(() => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('invite=expired-token'));
      mockValidateInviteToken.mockResolvedValue({ valid: false, reason: 'expired' });
    });

    it('shows the "Invite Link Expired" error card', async () => {
      render(<Signup />);
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Invite Link Expired' }),
        ).toBeInTheDocument();
      });
    });

    it('shows the expired detail message', async () => {
      render(<Signup />);
      await waitFor(() => {
        expect(screen.getByText(/This invite link has expired/i)).toBeInTheDocument();
      });
    });

    it('shows a "Check Application Status" link to /application-status', async () => {
      render(<Signup />);
      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: /Check Application Status/i }),
        ).toHaveAttribute('href', '/application-status');
      });
    });

    it('does not render the signup form', async () => {
      render(<Signup />);
      await waitFor(() =>
        screen.getByRole('heading', { name: 'Invite Link Expired' }),
      );
      expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
    });
  });

  describe('with a used invite token', () => {
    beforeEach(() => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('invite=used-token'));
      mockValidateInviteToken.mockResolvedValue({ valid: false, reason: 'used' });
    });

    it('shows the "Invite Link Already Used" error card', async () => {
      render(<Signup />);
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Invite Link Already Used' }),
        ).toBeInTheDocument();
      });
    });

    it('shows the used detail message', async () => {
      render(<Signup />);
      await waitFor(() => {
        expect(screen.getByText(/already been used/i)).toBeInTheDocument();
      });
    });
  });

  describe('with an invalid invite token', () => {
    beforeEach(() => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('invite=bad-token'));
      mockValidateInviteToken.mockResolvedValue({ valid: false, reason: 'invalid' });
    });

    it('shows the "Invalid Invite Link" error card', async () => {
      render(<Signup />);
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Invalid Invite Link' }),
        ).toBeInTheDocument();
      });
    });

    it('shows a "Check Application Status" link', async () => {
      render(<Signup />);
      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: /Check Application Status/i }),
        ).toBeInTheDocument();
      });
    });
  });
});
