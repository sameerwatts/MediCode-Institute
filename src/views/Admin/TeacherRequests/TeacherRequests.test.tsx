import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import TeacherRequests from './index';
import * as adminService from '@/services/adminService';

jest.mock('@/services/adminService');
const mockGetApplications = jest.mocked(adminService.getApplications);

const MOCK_PAGINATED = {
  items: [
    {
      id: 'app-1',
      name: 'Dr. Jane Smith',
      email: 'jane@example.com',
      subject_area: 'medical' as const,
      status: 'pending' as const,
      created_at: '2026-03-01T10:00:00Z',
    },
    {
      id: 'app-2',
      name: 'Ali Hassan',
      email: 'ali@example.com',
      subject_area: 'cs' as const,
      status: 'approved' as const,
      created_at: '2026-02-28T08:00:00Z',
    },
  ],
  total: 2,
  page: 1,
  page_size: 10,
  has_next: false,
};

describe('TeacherRequests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the heading', async () => {
    mockGetApplications.mockResolvedValue(MOCK_PAGINATED);
    render(<TeacherRequests />);
    expect(screen.getByRole('heading', { name: /Teacher Requests/i })).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    mockGetApplications.mockReturnValue(new Promise(() => {}));
    render(<TeacherRequests />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders applications in table after load', async () => {
    mockGetApplications.mockResolvedValue(MOCK_PAGINATED);
    render(<TeacherRequests />);
    await waitFor(() => {
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Ali Hassan')).toBeInTheDocument();
    });
  });

  it('shows "No applications found" when data is empty', async () => {
    mockGetApplications.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      page_size: 10,
      has_next: false,
    });
    render(<TeacherRequests />);
    await waitFor(() => {
      expect(screen.getByText(/No applications found/i)).toBeInTheDocument();
    });
  });

  it('shows error alert on fetch failure', async () => {
    mockGetApplications.mockRejectedValue(new Error('Network error'));
    render(<TeacherRequests />);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network error');
    });
  });

  it('renders a View link for each application', async () => {
    mockGetApplications.mockResolvedValue(MOCK_PAGINATED);
    render(<TeacherRequests />);
    await waitFor(() => {
      const viewLinks = screen.getAllByRole('link', { name: /View/i });
      expect(viewLinks).toHaveLength(2);
    });
  });

  it('renders search input and button', async () => {
    mockGetApplications.mockResolvedValue(MOCK_PAGINATED);
    render(<TeacherRequests />);
    expect(screen.getByLabelText(/Search applications/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  it('renders status filter buttons', async () => {
    mockGetApplications.mockResolvedValue(MOCK_PAGINATED);
    render(<TeacherRequests />);
    expect(screen.getByRole('button', { name: /^All$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Pending$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Approved$/i })).toBeInTheDocument();
  });

  it('refetches with status filter when filter button is clicked', async () => {
    mockGetApplications.mockResolvedValue(MOCK_PAGINATED);
    render(<TeacherRequests />);
    await waitFor(() => screen.getByText('Dr. Jane Smith'));

    fireEvent.click(screen.getByRole('button', { name: /^Pending$/i }));
    await waitFor(() => {
      expect(mockGetApplications).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'pending' }),
      );
    });
  });

  it('shows pagination controls when there are results', async () => {
    mockGetApplications.mockResolvedValue(MOCK_PAGINATED);
    render(<TeacherRequests />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Previous/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
    });
  });
});
