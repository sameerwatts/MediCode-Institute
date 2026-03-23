import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import ResetPassword from './index';
import * as authService from '@/services/authService';

jest.mock('@/services/authService', () => ({
  ...jest.requireActual('@/services/authService'),
  resetPassword: jest.fn(),
}));

const mockPush = jest.fn();
let mockSearchParams = new URLSearchParams('token=abc123');

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: mockPush, replace: jest.fn(), back: jest.fn() })),
  usePathname: jest.fn(() => '/reset-password'),
  useSearchParams: jest.fn(() => mockSearchParams),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockSearchParams = new URLSearchParams('token=abc123');
});

describe('ResetPassword', () => {
  it('renders password fields when token is present', () => {
    render(<ResetPassword />);
    expect(screen.getByRole('heading', { name: 'Set New Password' })).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
  });

  it('shows error when no token in URL', () => {
    mockSearchParams = new URLSearchParams();
    render(<ResetPassword />);
    expect(screen.getByRole('heading', { name: 'Invalid Reset Link' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Request New Reset Link' })).toHaveAttribute(
      'href',
      '/forgot-password',
    );
  });

  it('shows validation error when passwords do not match', async () => {
    render(<ResetPassword />);
    await userEvent.type(screen.getByLabelText('New Password'), 'password123');
    await userEvent.type(screen.getByLabelText('Confirm Password'), 'different');
    await userEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    await waitFor(() =>
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument(),
    );
  });

  it('shows success message on successful reset', async () => {
    (authService.resetPassword as jest.Mock).mockResolvedValue({
      message: 'Password reset successful. Please sign in.',
    });

    render(<ResetPassword />);
    await userEvent.type(screen.getByLabelText('New Password'), 'newpass123');
    await userEvent.type(screen.getByLabelText('Confirm Password'), 'newpass123');
    await userEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Password reset successful'),
    );
  });

  it('shows error message on API failure', async () => {
    (authService.resetPassword as jest.Mock).mockRejectedValue(
      new Error('This reset link has expired. Please request a new one.'),
    );

    render(<ResetPassword />);
    await userEvent.type(screen.getByLabelText('New Password'), 'newpass123');
    await userEvent.type(screen.getByLabelText('Confirm Password'), 'newpass123');
    await userEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('expired'),
    );
  });
});
