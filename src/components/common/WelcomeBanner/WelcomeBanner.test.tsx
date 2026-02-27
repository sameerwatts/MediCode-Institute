import React from 'react';
import { render, screen } from '@/test-utils';
import WelcomeBanner from './index';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

const mockUser = {
  id: 'u1',
  name: 'Jane Doe',
  email: 'jane@test.com',
  role: 'student' as const,
  created_at: '2026-01-01T00:00:00Z',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('WelcomeBanner', () => {
  it('renders nothing while auth is loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
      user: null,
    });
    const { container } = render(<WelcomeBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      user: null,
    });
    const { container } = render(<WelcomeBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when user is null even if authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: null,
    });
    const { container } = render(<WelcomeBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the welcome message when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: mockUser,
    });
    render(<WelcomeBanner />);
    expect(screen.getByText('Welcome back, Jane!')).toBeInTheDocument();
  });

  it('shows only the first name, not the full name', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: mockUser,
    });
    render(<WelcomeBanner />);
    expect(screen.queryByText(/Doe/)).not.toBeInTheDocument();
  });
});
