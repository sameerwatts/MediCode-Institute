import React from 'react';
import { render, screen } from '@/test-utils';
import About from './index';
import * as teacherService from '@/services/teacherService';

jest.mock('@/services/teacherService');
const mockListTeachers = jest.mocked(teacherService.listTeachers);

const mockTeachers = [
  {
    id: 't1',
    name: 'Dr. Priya Sharma',
    designation: 'Senior Cardiologist',
    department: 'medical' as const,
    bio: 'MBBS, MD (Cardiology) from AIIMS Delhi.',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma',
  },
  {
    id: 't2',
    name: 'Ankit Patel',
    designation: 'Full Stack Developer',
    department: 'cs' as const,
    bio: 'IIT Bombay alumnus, ex-Google engineer.',
    avatar: 'https://ui-avatars.com/api/?name=Ankit+Patel',
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  mockListTeachers.mockResolvedValue(mockTeachers);
});

describe('About', () => {
  it('renders the page heading', () => {
    render(<About />);
    expect(screen.getByText('About MediCode Institute')).toBeInTheDocument();
  });

  it('renders the Mission section', () => {
    render(<About />);
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
    expect(screen.getByText(/bridge the gap/)).toBeInTheDocument();
  });

  it('renders the Vision section', () => {
    render(<About />);
    expect(screen.getByText('Our Vision')).toBeInTheDocument();
  });

  it('renders the What We Offer section with all 4 offerings', () => {
    render(<About />);
    expect(screen.getByText('Medical Courses')).toBeInTheDocument();
    expect(screen.getByText('CS Courses')).toBeInTheDocument();
    expect(screen.getByText('Interactive Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Live Sessions')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    mockListTeachers.mockReturnValue(new Promise(() => {}));
    render(<About />);
    expect(screen.getByText('Loading teachers...')).toBeInTheDocument();
  });

  it('renders teacher cards after loading', async () => {
    render(<About />);
    expect(await screen.findByText('Dr. Priya Sharma')).toBeInTheDocument();
    expect(screen.getByText('Ankit Patel')).toBeInTheDocument();
  });

  it('shows error message when API fails', async () => {
    mockListTeachers.mockRejectedValue(new Error('Network error'));
    render(<About />);
    expect(await screen.findByText('Failed to load teachers.')).toBeInTheDocument();
  });

  it('shows empty message when no teachers returned', async () => {
    mockListTeachers.mockResolvedValue([]);
    render(<About />);
    expect(await screen.findByText('No teachers available yet.')).toBeInTheDocument();
  });

  it('renders the contact section', () => {
    render(<About />);
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(screen.getByText('contact@medicode.in')).toBeInTheDocument();
  });
});
