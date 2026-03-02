import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import TeacherRequestDetail from './index';
import * as adminService from '@/services/adminService';

jest.mock('@/services/adminService');
const mockGetApplicationDetail = jest.mocked(adminService.getApplicationDetail);

jest.mock('@/components/admin/ApplicationActions', () => ({
  __esModule: true,
  default: ({ status }: { status: string }) => (
    <div data-testid="application-actions">Actions for {status}</div>
  ),
}));

const MOCK_DETAIL = {
  id: 'app-1',
  name: 'Dr. Jane Smith',
  email: 'jane@example.com',
  phone: '+91 9876543210',
  subject_area: 'medical' as const,
  qualifications: 'MBBS, MD with 5 years of clinical experience',
  experience_years: 5,
  teaching_philosophy: 'Patient-centred learning that engages students deeply.',
  status: 'pending' as const,
  admin_notes: null,
  reviewed_at: null,
  user_id: null,
  created_at: '2026-03-01T10:00:00Z',
  updated_at: '2026-03-01T10:00:00Z',
  invite_token_expires_at: null,
};

describe('TeacherRequestDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loader while fetching', () => {
    mockGetApplicationDetail.mockReturnValue(new Promise(() => {}));
    render(<TeacherRequestDetail id="app-1" />);
    expect(screen.queryByText('Dr. Jane Smith')).not.toBeInTheDocument();
  });

  it('renders applicant name and email after load', async () => {
    mockGetApplicationDetail.mockResolvedValue(MOCK_DETAIL);
    render(<TeacherRequestDetail id="app-1" />);
    await waitFor(() => {
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  it('renders qualifications and teaching philosophy', async () => {
    mockGetApplicationDetail.mockResolvedValue(MOCK_DETAIL);
    render(<TeacherRequestDetail id="app-1" />);
    await waitFor(() => {
      expect(screen.getByText(MOCK_DETAIL.qualifications)).toBeInTheDocument();
      expect(screen.getByText(MOCK_DETAIL.teaching_philosophy)).toBeInTheDocument();
    });
  });

  it('shows error alert when fetch fails', async () => {
    mockGetApplicationDetail.mockRejectedValue(new Error('Not found'));
    render(<TeacherRequestDetail id="app-1" />);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Not found');
    });
  });

  it('renders back link to teacher requests list', async () => {
    mockGetApplicationDetail.mockResolvedValue(MOCK_DETAIL);
    render(<TeacherRequestDetail id="app-1" />);
    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: /Back to requests/i }),
      ).toBeInTheDocument();
    });
  });

  it('renders ApplicationActions component', async () => {
    mockGetApplicationDetail.mockResolvedValue(MOCK_DETAIL);
    render(<TeacherRequestDetail id="app-1" />);
    await waitFor(() => {
      expect(screen.getByTestId('application-actions')).toBeInTheDocument();
    });
  });

  it('renders StatusBadge with application status', async () => {
    mockGetApplicationDetail.mockResolvedValue(MOCK_DETAIL);
    render(<TeacherRequestDetail id="app-1" />);
    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });
});
