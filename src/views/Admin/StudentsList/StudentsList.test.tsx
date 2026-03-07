import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import StudentsList from './index';
import * as adminService from '@/services/adminService';

jest.mock('@/services/adminService');
const mockGetStudents = jest.mocked(adminService.getStudents);

const MOCK_PAGINATED = {
  items: [
    {
      id: 'student-1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+91 9876543210',
      avatar_url: null,
      created_at: '2026-03-01T10:00:00Z',
    },
    {
      id: 'student-2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: null,
      avatar_url: null,
      created_at: '2026-02-28T08:00:00Z',
    },
  ],
  total: 2,
  page: 1,
  page_size: 10,
  has_next: false,
};

describe('StudentsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the heading', async () => {
    mockGetStudents.mockResolvedValue(MOCK_PAGINATED);
    render(<StudentsList />);
    expect(screen.getByRole('heading', { name: /Students/i })).toBeInTheDocument();
  });

  it('renders search input', () => {
    mockGetStudents.mockReturnValue(new Promise(() => {}));
    render(<StudentsList />);
    expect(screen.getByLabelText(/Search students/i)).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    mockGetStudents.mockReturnValue(new Promise(() => {}));
    render(<StudentsList />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders students in table after fetch', async () => {
    mockGetStudents.mockResolvedValue(MOCK_PAGINATED);
    render(<StudentsList />);
    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    });
  });

  it('shows "No students found" for empty results', async () => {
    mockGetStudents.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      page_size: 10,
      has_next: false,
    });
    render(<StudentsList />);
    await waitFor(() => {
      expect(screen.getByText(/No students found/i)).toBeInTheDocument();
    });
  });

  it('shows error alert on fetch failure', async () => {
    mockGetStudents.mockRejectedValue(new Error('Network error'));
    render(<StudentsList />);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network error');
    });
  });

  it('displays dash for null phone number', async () => {
    mockGetStudents.mockResolvedValue(MOCK_PAGINATED);
    render(<StudentsList />);
    await waitFor(() => {
      expect(screen.getByText('—')).toBeInTheDocument();
    });
  });

  it('renders Previous and Next pagination buttons', async () => {
    mockGetStudents.mockResolvedValue(MOCK_PAGINATED);
    render(<StudentsList />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Previous/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
    });
  });
});
