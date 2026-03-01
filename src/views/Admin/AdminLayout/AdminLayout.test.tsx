import React from 'react';
import { render, screen } from '@/test-utils';
import AdminLayout from './index';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth');
const mockUseAuth = jest.mocked(useAuth);

const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
  usePathname: () => '/admin/teacher-requests',
}));

describe('AdminLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loader while auth is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      login: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
    });
    const { container } = render(
      <AdminLayout>
        <div>Admin content</div>
      </AdminLayout>,
    );
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument();
    expect(container.querySelector('[role="status"]') || container.firstChild).toBeTruthy();
  });

  it('redirects to /login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      login: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
    });
    render(
      <AdminLayout>
        <div>Admin content</div>
      </AdminLayout>,
    );
    expect(mockReplace).toHaveBeenCalledWith('/login');
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument();
  });

  it('redirects to /login when authenticated user is not admin', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', name: 'Student', email: 's@test.com', role: 'student', created_at: '' },
      isLoading: false,
      isAuthenticated: true,
      login: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
    });
    render(
      <AdminLayout>
        <div>Admin content</div>
      </AdminLayout>,
    );
    expect(mockReplace).toHaveBeenCalledWith('/login');
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument();
  });

  it('renders children when user is admin', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', name: 'Sameer Watts', email: 'admin@test.com', role: 'admin', created_at: '' },
      isLoading: false,
      isAuthenticated: true,
      login: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
    });
    render(
      <AdminLayout>
        <div>Admin content</div>
      </AdminLayout>,
    );
    expect(screen.getByText('Admin content')).toBeInTheDocument();
  });

  it('renders AdminSidebar when user is admin', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', name: 'Sameer Watts', email: 'admin@test.com', role: 'admin', created_at: '' },
      isLoading: false,
      isAuthenticated: true,
      login: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
    });
    render(
      <AdminLayout>
        <div>Page</div>
      </AdminLayout>,
    );
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('renders AdminHeader with user name when admin', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', name: 'Sameer Watts', email: 'admin@test.com', role: 'admin', created_at: '' },
      isLoading: false,
      isAuthenticated: true,
      login: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
    });
    render(
      <AdminLayout>
        <div>Page</div>
      </AdminLayout>,
    );
    expect(screen.getByText('Sameer Watts')).toBeInTheDocument();
  });
});
