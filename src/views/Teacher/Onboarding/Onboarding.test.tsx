import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import TeacherOnboarding from './index';
import { useAuth } from '@/hooks/useAuth';
import * as teacherService from '@/services/teacherService';

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/services/teacherService', () => ({
  submitOnboarding: jest.fn(),
}));

const mockSubmitOnboarding = jest.mocked(teacherService.submitOnboarding);

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: mockPush, replace: mockReplace, back: jest.fn() })),
  usePathname: jest.fn(() => '/teacher/onboarding'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

const authenticatedTeacher = {
  user: { id: '1', name: 'Dr. Jane Smith', email: 'jane@example.com', role: 'teacher' as const, created_at: '' },
  isLoading: false,
  isAuthenticated: true,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
};

const unauthenticated = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  (useAuth as jest.Mock).mockReturnValue(authenticatedTeacher);
});

describe('TeacherOnboarding', () => {
  describe('auth guard', () => {
    it('shows loader while auth is loading', () => {
      (useAuth as jest.Mock).mockReturnValue({ ...unauthenticated, isLoading: true });
      render(<TeacherOnboarding />);
      expect(screen.queryByRole('heading', { name: /Complete Your Profile/i })).not.toBeInTheDocument();
    });

    it('redirects to /login when not authenticated', () => {
      (useAuth as jest.Mock).mockReturnValue(unauthenticated);
      render(<TeacherOnboarding />);
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });

  describe('form rendering', () => {
    it('renders the "Complete Your Profile" heading', () => {
      render(<TeacherOnboarding />);
      expect(screen.getByRole('heading', { name: /Complete Your Profile/i })).toBeInTheDocument();
    });

    it('renders the Designation field', () => {
      render(<TeacherOnboarding />);
      expect(screen.getByLabelText('Designation')).toBeInTheDocument();
    });

    it('renders the Department radio group', () => {
      render(<TeacherOnboarding />);
      expect(screen.getByRole('radio', { name: 'Medical Sciences' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Computer Science' })).toBeInTheDocument();
    });

    it('renders the Bio textarea', () => {
      render(<TeacherOnboarding />);
      expect(screen.getByLabelText('Bio')).toBeInTheDocument();
    });

    it('renders the photo upload button', () => {
      render(<TeacherOnboarding />);
      expect(screen.getByRole('button', { name: /Upload profile photo/i })).toBeInTheDocument();
    });

    it('renders the Save Profile submit button', () => {
      render(<TeacherOnboarding />);
      expect(screen.getByRole('button', { name: 'Save Profile' })).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('shows designation error when field is empty', async () => {
      render(<TeacherOnboarding />);
      await userEvent.click(screen.getByRole('button', { name: 'Save Profile' }));
      await waitFor(() => {
        expect(screen.getByText('Designation is required')).toBeInTheDocument();
      });
    });

    it('shows bio error when bio is too short', async () => {
      render(<TeacherOnboarding />);
      await userEvent.type(screen.getByLabelText('Bio'), 'Too short');
      await userEvent.click(screen.getByRole('button', { name: 'Save Profile' }));
      await waitFor(() => {
        expect(screen.getByText('Bio must be at least 20 characters')).toBeInTheDocument();
      });
    });

    it('shows department error when no department is selected', async () => {
      render(<TeacherOnboarding />);
      await userEvent.type(screen.getByLabelText('Designation'), 'Senior Cardiologist');
      await userEvent.type(
        screen.getByLabelText('Bio'),
        'I have over 10 years of experience in cardiology and medical education.',
      );
      await userEvent.click(screen.getByRole('button', { name: 'Save Profile' }));
      await waitFor(() => {
        expect(screen.getByText('Please select a department')).toBeInTheDocument();
      });
    });
  });

  describe('submission', () => {
    const fillValidForm = async () => {
      await userEvent.type(screen.getByLabelText('Designation'), 'Senior Cardiologist');
      await userEvent.click(screen.getByRole('radio', { name: 'Medical Sciences' }));
      await userEvent.type(
        screen.getByLabelText('Bio'),
        'I have over 10 years of experience in cardiology and medical education.',
      );
    };

    it('calls submitOnboarding with form data on valid submission', async () => {
      mockSubmitOnboarding.mockResolvedValue(undefined);
      render(<TeacherOnboarding />);
      await fillValidForm();
      await userEvent.click(screen.getByRole('button', { name: 'Save Profile' }));

      await waitFor(() => {
        expect(mockSubmitOnboarding).toHaveBeenCalledWith({
          designation: 'Senior Cardiologist',
          department: 'medical',
          bio: 'I have over 10 years of experience in cardiology and medical education.',
        });
      });
    });

    it('shows the success state after successful submission', async () => {
      mockSubmitOnboarding.mockResolvedValue(undefined);
      render(<TeacherOnboarding />);
      await fillValidForm();
      await userEvent.click(screen.getByRole('button', { name: 'Save Profile' }));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Profile Complete!' })).toBeInTheDocument();
      });
    });

    it('renders a "Go to Dashboard" link after success', async () => {
      mockSubmitOnboarding.mockResolvedValue(undefined);
      render(<TeacherOnboarding />);
      await fillValidForm();
      await userEvent.click(screen.getByRole('button', { name: 'Save Profile' }));

      await waitFor(() => {
        expect(screen.getByRole('link', { name: 'Go to Dashboard' })).toHaveAttribute(
          'href',
          '/dashboard',
        );
      });
    });

    it('shows an error alert when submission fails', async () => {
      mockSubmitOnboarding.mockRejectedValue(new Error('Server error'));
      render(<TeacherOnboarding />);
      await fillValidForm();
      await userEvent.click(screen.getByRole('button', { name: 'Save Profile' }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Server error');
      });
    });
  });
});
