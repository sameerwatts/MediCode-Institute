import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import CourseDetail from './index';
import { useAuth } from '@/hooks/useAuth';
import * as courseService from '@/services/courseService';
import { ICourseDetail } from '@/types';

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/services/courseService');
const mockGetCourseBySlug = jest.mocked(courseService.getCourseBySlug);
const mockEnrollInCourse = jest.mocked(courseService.enrollInCourse);
const mockGetEnrollmentStatus = jest.mocked(courseService.getEnrollmentStatus);

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
  })),
  usePathname: jest.fn(() => '/courses/anatomy-101'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

const mockCourse: ICourseDetail = {
  id: 'c1',
  title: 'Anatomy 101',
  slug: 'anatomy-101',
  description: 'A comprehensive introduction to human anatomy.',
  category: 'medical',
  thumbnail_url: 'https://example.com/thumb.jpg',
  status: 'published',
  teacher_name: 'Dr. Smith',
  topics: [
    {
      id: 't1',
      title: 'Introduction',
      order: 1,
      subtopics: [
        { id: 's1', title: 'Overview', order: 1 },
        { id: 's2', title: 'History', order: 2 },
      ],
    },
    {
      id: 't2',
      title: 'The Skeletal System',
      order: 2,
      subtopics: [{ id: 's3', title: 'Bones', order: 1 }],
    },
  ],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-03-15T00:00:00Z',
};

const guestAuth = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
};

const studentAuth = {
  user: { id: 'u1', name: 'Jane', email: 'jane@test.com', role: 'student' as const, created_at: '2026-01-01T00:00:00Z' },
  isLoading: false,
  isAuthenticated: true,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  (useAuth as jest.Mock).mockReturnValue(guestAuth);
  mockGetCourseBySlug.mockResolvedValue(mockCourse);
  mockGetEnrollmentStatus.mockRejectedValue(new Error('Not enrolled'));
});

describe('CourseDetail', () => {
  it('shows loading state initially', () => {
    mockGetCourseBySlug.mockReturnValue(new Promise(() => {}));
    render(<CourseDetail slug="anatomy-101" />);
    expect(screen.getByText('Loading course...')).toBeInTheDocument();
  });

  it('renders course title and description after loading', async () => {
    render(<CourseDetail slug="anatomy-101" />);
    expect(
      await screen.findByRole('heading', { name: 'Anatomy 101' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('A comprehensive introduction to human anatomy.')
    ).toBeInTheDocument();
  });

  it('renders teacher name', async () => {
    render(<CourseDetail slug="anatomy-101" />);
    expect(await screen.findByText('By Dr. Smith')).toBeInTheDocument();
  });

  it('shows topic and lesson counts', async () => {
    render(<CourseDetail slug="anatomy-101" />);
    expect(await screen.findByText('2 topics')).toBeInTheDocument();
    expect(screen.getByText('3 lessons')).toBeInTheDocument();
  });

  it('shows category badge', async () => {
    render(<CourseDetail slug="anatomy-101" />);
    expect(await screen.findByText('Medical Sciences')).toBeInTheDocument();
  });

  it('renders course thumbnail', async () => {
    render(<CourseDetail slug="anatomy-101" />);
    expect(await screen.findByAltText('Anatomy 101')).toHaveAttribute(
      'src',
      'https://example.com/thumb.jpg'
    );
  });

  it('shows "Log in to Enroll" for guest users', async () => {
    render(<CourseDetail slug="anatomy-101" />);
    expect(await screen.findByText('Log in to Enroll')).toBeInTheDocument();
  });

  it('redirects to login when guest clicks enroll', async () => {
    render(<CourseDetail slug="anatomy-101" />);
    const btn = await screen.findByText('Log in to Enroll');
    fireEvent.click(btn);
    expect(mockPush).toHaveBeenCalledWith('/login?redirect=/courses/anatomy-101');
  });

  it('shows "Enroll for Free" for authenticated users', async () => {
    (useAuth as jest.Mock).mockReturnValue(studentAuth);
    render(<CourseDetail slug="anatomy-101" />);
    expect(await screen.findByText('Enroll for Free')).toBeInTheDocument();
  });

  it('handles successful enrollment', async () => {
    (useAuth as jest.Mock).mockReturnValue(studentAuth);
    mockEnrollInCourse.mockResolvedValue({
      message: 'Enrolled',
      enrolled_at: '2026-03-20T10:00:00Z',
    });
    render(<CourseDetail slug="anatomy-101" />);
    const btn = await screen.findByText('Enroll for Free');
    fireEvent.click(btn);
    await waitFor(() => {
      expect(screen.getByText(/Enrolled/)).toBeInTheDocument();
    });
  });

  it('shows enrolled badge when already enrolled', async () => {
    (useAuth as jest.Mock).mockReturnValue(studentAuth);
    mockGetEnrollmentStatus.mockResolvedValue({
      enrolled: true,
      enrolled_at: '2026-03-10T00:00:00Z',
    });
    render(<CourseDetail slug="anatomy-101" />);
    await waitFor(() => {
      expect(screen.getByText(/Enrolled on/)).toBeInTheDocument();
    });
  });

  it('shows error when course loading fails', async () => {
    mockGetCourseBySlug.mockRejectedValue(new Error('Course not found'));
    render(<CourseDetail slug="missing" />);
    expect(await screen.findByText('Course not found')).toBeInTheDocument();
  });

  it('renders breadcrumb with Courses link', async () => {
    render(<CourseDetail slug="anatomy-101" />);
    expect(await screen.findByText('Courses')).toBeInTheDocument();
  });

  it('renders the TopicAccordion section', async () => {
    render(<CourseDetail slug="anatomy-101" />);
    expect(await screen.findByText('Course Content')).toBeInTheDocument();
    expect(screen.getByText('1. Introduction')).toBeInTheDocument();
  });
});
