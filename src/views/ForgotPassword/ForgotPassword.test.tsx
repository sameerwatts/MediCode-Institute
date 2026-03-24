import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import ForgotPassword from './index';
import * as authService from '@/services/authService';

jest.mock('@/services/authService', () => ({
  ...jest.requireActual('@/services/authService'),
  forgotPassword: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() })),
  usePathname: jest.fn(() => '/forgot-password'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ForgotPassword', () => {
  it('renders the heading and email input', () => {
    render(<ForgotPassword />);
    expect(screen.getByRole('heading', { name: 'Forgot Password' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Reset Link' })).toBeInTheDocument();
  });

  it('renders a link back to login', () => {
    render(<ForgotPassword />);
    expect(screen.getByRole('link', { name: 'Back to Sign In' })).toHaveAttribute('href', '/login');
  });

  it('shows validation error for invalid email', async () => {
    render(<ForgotPassword />);
    await userEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }));
    await waitFor(() =>
      expect(screen.getByText('Email is required')).toBeInTheDocument(),
    );
  });

  it('shows success message on successful submission', async () => {
    (authService.forgotPassword as jest.Mock).mockResolvedValue({
      message: 'If an account exists with that email, we\'ve sent a reset link.',
    });

    render(<ForgotPassword />);
    await userEvent.type(screen.getByLabelText('Email Address'), 'user@test.com');
    await userEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }));

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('sent a reset link'),
    );
  });

  it('shows error message on API failure', async () => {
    (authService.forgotPassword as jest.Mock).mockRejectedValue(
      new Error('Failed to send reset link.'),
    );

    render(<ForgotPassword />);
    await userEvent.type(screen.getByLabelText('Email Address'), 'user@test.com');
    await userEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to send reset link.'),
    );
  });
});
