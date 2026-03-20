import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import SubtopicReader from './index';
import { useAuth } from '@/hooks/useAuth';
import * as courseService from '@/services/courseService';
import { ICourseDetail, ISubtopicContent } from '@/types';

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/services/courseService');
const mockGetCourseBySlug = jest.mocked(courseService.getCourseBySlug);
const mockGetSubtopicContent = jest.mocked(courseService.getSubtopicContent);
const mockGetEnrollmentStatus = jest.mocked(courseService.getEnrollmentStatus);

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
  })),
  usePathname: jest.fn(() => '/courses/anatomy-101/learn/s1'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

jest.mock('@/components/course/TipTapRenderer', () => {
  return function MockTipTapRenderer({ content }: { content: unknown }) {
    return (
      <div data-testid="tiptap-renderer">
        {content ? 'Rendered content' : 'No content'}
      </div>
    );
  };
});

const mockCourse: ICourseDetail = {
  id: 'c1',
  title: 'Anatomy 101',
  slug: 'anatomy-101',
  description: 'Intro to anatomy.',
  category: 'medical',
  thumbnail_url: null,
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

const mockSubtopicContent: ISubtopicContent = {
  id: 's1',
  title: 'Overview',
  content: { type: 'doc', content: [{ type: 'paragraph' }] },
  order: 1,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-03-15T00:00:00Z',
};

const authenticatedAuth = {
  user: { id: 'u1', name: 'Jane', email: 'jane@test.com', role: 'student' as const, created_at: '2026-01-01T00:00:00Z' },
  isLoading: false,
  isAuthenticated: true,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
};

const guestAuth = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  (useAuth as jest.Mock).mockReturnValue(authenticatedAuth);
  mockGetEnrollmentStatus.mockResolvedValue({ enrolled: true, enrolled_at: '2026-03-10T00:00:00Z' });
  mockGetCourseBySlug.mockResolvedValue(mockCourse);
  mockGetSubtopicContent.mockResolvedValue(mockSubtopicContent);
});

describe('SubtopicReader', () => {
  it('shows loading state initially', () => {
    mockGetEnrollmentStatus.mockReturnValue(new Promise(() => {}));
    render(<SubtopicReader slug="anatomy-101" subtopicId="s1" />);
    expect(screen.getByText('Loading lesson...')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue(guestAuth);
    render(<SubtopicReader slug="anatomy-101" subtopicId="s1" />);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        '/login?redirect=/courses/anatomy-101/learn/s1'
      );
    });
  });

  it('shows error when not enrolled', async () => {
    mockGetEnrollmentStatus.mockResolvedValue({ enrolled: false, enrolled_at: null });
    render(<SubtopicReader slug="anatomy-101" subtopicId="s1" />);
    expect(
      await screen.findByText('You must enroll in this course to access its content.')
    ).toBeInTheDocument();
  });

  it('shows "Back to course" link on error', async () => {
    mockGetEnrollmentStatus.mockResolvedValue({ enrolled: false, enrolled_at: null });
    render(<SubtopicReader slug="anatomy-101" subtopicId="s1" />);
    const link = await screen.findByText('Back to course');
    expect(link.closest('a')).toHaveAttribute('href', '/courses/anatomy-101');
  });

  it('renders subtopic title after loading', async () => {
    render(<SubtopicReader slug="anatomy-101" subtopicId="s1" />);
    expect(
      await screen.findByRole('heading', { name: '1.1 Overview' })
    ).toBeInTheDocument();
  });

  it('renders topic name above title', async () => {
    render(<SubtopicReader slug="anatomy-101" subtopicId="s1" />);
    expect(await screen.findByText('Introduction')).toBeInTheDocument();
  });

  it('renders breadcrumb navigation', async () => {
    render(<SubtopicReader slug="anatomy-101" subtopicId="s1" />);
    await screen.findByText('Overview');
    expect(screen.getByText('Courses')).toBeInTheDocument();
    expect(screen.getByText('Anatomy 101')).toBeInTheDocument();
  });

  it('renders TipTapRenderer with content', async () => {
    render(<SubtopicReader slug="anatomy-101" subtopicId="s1" />);
    expect(await screen.findByTestId('tiptap-renderer')).toBeInTheDocument();
    expect(screen.getByText('Rendered content')).toBeInTheDocument();
  });

  it('shows next navigation link for first subtopic', async () => {
    render(<SubtopicReader slug="anatomy-101" subtopicId="s1" />);
    await screen.findByRole('heading', { name: '1.1 Overview' });
    const nextLink = screen.getByText('History');
    expect(nextLink.closest('a')).toHaveAttribute(
      'href',
      '/courses/anatomy-101/learn/s2'
    );
  });

  it('shows prev navigation link for second subtopic', async () => {
    mockGetSubtopicContent.mockResolvedValue({
      ...mockSubtopicContent,
      id: 's2',
      title: 'History',
      order: 2,
    });
    render(<SubtopicReader slug="anatomy-101" subtopicId="s2" />);
    await screen.findByRole('heading', { name: '1.2 History' });
    const prevLink = screen.getByText('Overview');
    expect(prevLink.closest('a')).toHaveAttribute(
      'href',
      '/courses/anatomy-101/learn/s1'
    );
  });

  it('shows "Back to course" link for last subtopic', async () => {
    mockGetSubtopicContent.mockResolvedValue({
      ...mockSubtopicContent,
      id: 's3',
      title: 'Bones',
      order: 1,
    });
    render(<SubtopicReader slug="anatomy-101" subtopicId="s3" />);
    await screen.findByRole('heading', { name: '2.1 Bones' });
    const backLinks = screen.getAllByText('Back to course');
    const navBack = backLinks.find((el) =>
      el.closest('a')?.getAttribute('href') === '/courses/anatomy-101'
    );
    expect(navBack).toBeTruthy();
  });

  it('shows error when content loading fails', async () => {
    mockGetSubtopicContent.mockRejectedValue(new Error('Not found'));
    render(<SubtopicReader slug="anatomy-101" subtopicId="s1" />);
    expect(await screen.findByText('Not found')).toBeInTheDocument();
  });
});
