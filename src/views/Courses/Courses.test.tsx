import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import Courses from './index';
import * as courseService from '@/services/courseService';

jest.mock('@/services/courseService');
const mockListCourses = jest.mocked(courseService.listCourses);

const mockCourses = [
  {
    id: '1',
    title: 'Intro to Anatomy',
    slug: 'intro-to-anatomy',
    description: 'Learn anatomy basics.',
    category: 'medical' as const,
    thumbnail_url: null,
    status: 'published' as const,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'React Fundamentals',
    slug: 'react-fundamentals',
    description: 'Learn React from scratch.',
    category: 'cs' as const,
    thumbnail_url: 'https://example.com/react.png',
    status: 'published' as const,
    created_at: '2026-01-02T00:00:00Z',
  },
];

const paginatedResponse = {
  items: mockCourses,
  total: 2,
  page: 1,
  page_size: 20,
  has_next: false,
};

beforeEach(() => {
  jest.clearAllMocks();
  mockListCourses.mockResolvedValue(paginatedResponse);
});

describe('Courses', () => {
  it('shows loading state initially', () => {
    mockListCourses.mockReturnValue(new Promise(() => {}));
    render(<Courses />);
    expect(screen.getByText('Loading courses...')).toBeInTheDocument();
  });

  it('renders the page heading', async () => {
    render(<Courses />);
    expect(await screen.findByText('All Courses')).toBeInTheDocument();
  });

  it('renders all filter tabs', async () => {
    render(<Courses />);
    await screen.findByText('Intro to Anatomy');
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Medical' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CS' })).toBeInTheDocument();
  });

  it('renders courses from API after loading', async () => {
    render(<Courses />);
    expect(await screen.findByText('Intro to Anatomy')).toBeInTheDocument();
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
  });

  it('shows course descriptions', async () => {
    render(<Courses />);
    expect(await screen.findByText('Learn anatomy basics.')).toBeInTheDocument();
    expect(screen.getByText('Learn React from scratch.')).toBeInTheDocument();
  });

  it('renders courses as links to detail pages', async () => {
    render(<Courses />);
    await screen.findByText('Intro to Anatomy');
    const links = screen.getAllByRole('link');
    const anatomyLink = links.find(
      (l) => l.getAttribute('href') === '/courses/intro-to-anatomy'
    );
    const reactLink = links.find(
      (l) => l.getAttribute('href') === '/courses/react-fundamentals'
    );
    expect(anatomyLink).toBeTruthy();
    expect(reactLink).toBeTruthy();
  });

  it('shows category badges', async () => {
    render(<Courses />);
    await screen.findByText('Intro to Anatomy');
    // Filter button + badge = 2 each
    expect(screen.getAllByText('Medical')).toHaveLength(2);
    expect(screen.getAllByText('CS')).toHaveLength(2);
  });

  it('calls listCourses with category when filter clicked', async () => {
    render(<Courses />);
    await screen.findByText('Intro to Anatomy');

    mockListCourses.mockResolvedValue({
      ...paginatedResponse,
      items: [mockCourses[0]],
    });

    await userEvent.click(screen.getByRole('button', { name: 'Medical' }));

    await waitFor(() => {
      expect(mockListCourses).toHaveBeenCalledWith({ category: 'medical' });
    });
  });

  it('calls listCourses without category when All filter clicked', async () => {
    render(<Courses />);
    await screen.findByText('Intro to Anatomy');

    await userEvent.click(screen.getByRole('button', { name: 'Medical' }));
    await waitFor(() => {
      expect(mockListCourses).toHaveBeenCalledWith({ category: 'medical' });
    });

    mockListCourses.mockClear();
    await userEvent.click(screen.getByRole('button', { name: 'All' }));

    await waitFor(() => {
      expect(mockListCourses).toHaveBeenCalledWith(undefined);
    });
  });

  it('shows empty message when no courses returned', async () => {
    mockListCourses.mockResolvedValue({
      ...paginatedResponse,
      items: [],
      total: 0,
    });
    render(<Courses />);
    expect(
      await screen.findByText('No courses found in this category.')
    ).toBeInTheDocument();
  });

  it('shows error message when API fails', async () => {
    mockListCourses.mockRejectedValue(new Error('Network error'));
    render(<Courses />);
    expect(await screen.findByText('Network error')).toBeInTheDocument();
  });

  it('shows placeholder for courses without thumbnail', async () => {
    render(<Courses />);
    await screen.findByText('Intro to Anatomy');
    // Course without thumbnail should show first letter
    expect(screen.getByText('I')).toBeInTheDocument();
  });

  it('shows thumbnail image when course has one', async () => {
    render(<Courses />);
    await screen.findByText('React Fundamentals');
    const img = screen.getByAltText('React Fundamentals');
    expect(img).toHaveAttribute('src', 'https://example.com/react.png');
  });
});
