import React from 'react';
import { render, screen } from '@/test-utils';
import Home from './index';
import * as courseService from '@/services/courseService';

jest.mock('@/services/courseService');
const mockListCourses = jest.mocked(courseService.listCourses);

const mockCourses = [
  {
    id: '1',
    title: 'Human Anatomy Basics',
    slug: 'human-anatomy-basics',
    description: 'Learn anatomy.',
    category: 'medical' as const,
    thumbnail_url: null,
    status: 'published' as const,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'React for Beginners',
    slug: 'react-for-beginners',
    description: 'Learn React.',
    category: 'cs' as const,
    thumbnail_url: null,
    status: 'published' as const,
    created_at: '2026-01-02T00:00:00Z',
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  mockListCourses.mockResolvedValue({
    items: mockCourses,
    total: 2,
    page: 1,
    page_size: 20,
    has_next: false,
  });
});

describe('Home', () => {
  it('renders the HeroSection with headline', () => {
    render(<Home />);
    expect(screen.getByText('Bridge Medicine & Technology')).toBeInTheDocument();
  });

  it('renders the hero CTA button', () => {
    render(<Home />);
    expect(screen.getByText('Explore Courses')).toBeInTheDocument();
  });

  it('renders the FeaturesSection with all 4 features', () => {
    render(<Home />);
    expect(screen.getByText('Expert Faculty')).toBeInTheDocument();
    expect(screen.getByText('Interactive Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Flexible Learning')).toBeInTheDocument();
    expect(screen.getByText('Dual Curriculum')).toBeInTheDocument();
  });

  it('renders the Popular Courses section heading', async () => {
    render(<Home />);
    expect(await screen.findByText('Popular Courses')).toBeInTheDocument();
  });

  it('renders courses from API', async () => {
    render(<Home />);
    expect(await screen.findByText('Human Anatomy Basics')).toBeInTheDocument();
    expect(screen.getByText('React for Beginners')).toBeInTheDocument();
  });

  it('renders course cards as links to detail pages', async () => {
    render(<Home />);
    await screen.findByText('Human Anatomy Basics');
    const links = screen.getAllByRole('link');
    const anatomyLink = links.find(
      (l) => l.getAttribute('href') === '/courses/human-anatomy-basics'
    );
    expect(anatomyLink).toBeTruthy();
  });

  it('renders the Explore Categories section', () => {
    render(<Home />);
    expect(screen.getByText('Medical Sciences')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
  });

  it('renders the StatsSection with stat values', () => {
    render(<Home />);
    expect(screen.getByText('10,000+')).toBeInTheDocument();
    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText('20+')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('renders the CTA section', () => {
    render(<Home />);
    expect(screen.getByText('Start Your Learning Journey Today')).toBeInTheDocument();
  });

  it('renders the View All Courses link', async () => {
    render(<Home />);
    expect(await screen.findByText('View All Courses')).toBeInTheDocument();
  });
});
