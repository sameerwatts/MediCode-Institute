import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@/test-utils';
import ApplicationActions from './index';
import * as adminService from '@/services/adminService';

jest.mock('@/services/adminService');
const mockApprove = jest.mocked(adminService.approveApplication);
const mockReject = jest.mocked(adminService.rejectApplication);
const mockResend = jest.mocked(adminService.resendInvite);

const mockOnActionComplete = jest.fn();

describe('ApplicationActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Approve and Reject buttons for pending status', () => {
    render(
      <ApplicationActions
        id="app-1"
        status="pending"
        onActionComplete={mockOnActionComplete}
      />,
    );
    expect(screen.getByRole('button', { name: /Approve/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reject/i })).toBeInTheDocument();
  });

  it('renders Resend Invite button for approved status', () => {
    render(
      <ApplicationActions
        id="app-1"
        status="approved"
        onActionComplete={mockOnActionComplete}
      />,
    );
    expect(screen.getByRole('button', { name: /Resend Invite/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Approve/i })).not.toBeInTheDocument();
  });

  it('shows registered message for registered status', () => {
    render(
      <ApplicationActions
        id="app-1"
        status="registered"
        onActionComplete={mockOnActionComplete}
      />,
    );
    expect(screen.getByText(/Teacher has registered/i)).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows rejected message for rejected status', () => {
    render(
      <ApplicationActions
        id="app-1"
        status="rejected"
        onActionComplete={mockOnActionComplete}
      />,
    );
    expect(screen.getByText(/Application was rejected/i)).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('opens approve modal when Approve is clicked', () => {
    render(
      <ApplicationActions
        id="app-1"
        status="pending"
        onActionComplete={mockOnActionComplete}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Approve/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Approve Application/i)).toBeInTheDocument();
  });

  it('opens reject modal when Reject is clicked', () => {
    render(
      <ApplicationActions
        id="app-1"
        status="pending"
        onActionComplete={mockOnActionComplete}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Reject/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Reject Application/i)).toBeInTheDocument();
  });

  it('calls approveApplication and onActionComplete on confirm', async () => {
    mockApprove.mockResolvedValue({
      message: 'Approved',
      invite_token_expires_at: '2026-03-05T00:00:00Z',
    });
    render(
      <ApplicationActions
        id="app-1"
        status="pending"
        onActionComplete={mockOnActionComplete}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Approve/i }));
    const approveDialog = screen.getByRole('dialog');
    fireEvent.click(within(approveDialog).getByRole('button', { name: /^Approve$/i }));
    await waitFor(() => {
      expect(mockApprove).toHaveBeenCalledWith('app-1');
      expect(mockOnActionComplete).toHaveBeenCalled();
    });
  });

  it('shows success message after successful approve', async () => {
    mockApprove.mockResolvedValue({
      message: 'Approved',
      invite_token_expires_at: '2026-03-05T00:00:00Z',
    });
    render(
      <ApplicationActions
        id="app-1"
        status="pending"
        onActionComplete={mockOnActionComplete}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Approve/i }));
    const approveDialog = screen.getByRole('dialog');
    fireEvent.click(within(approveDialog).getByRole('button', { name: /^Approve$/i }));
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        /Application approved/i,
      );
    });
  });

  it('shows error alert when approve fails', async () => {
    mockApprove.mockRejectedValue(new Error('Already approved'));
    render(
      <ApplicationActions
        id="app-1"
        status="pending"
        onActionComplete={mockOnActionComplete}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Approve/i }));
    const approveDialog = screen.getByRole('dialog');
    fireEvent.click(within(approveDialog).getByRole('button', { name: /^Approve$/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Already approved');
    });
  });

  it('calls resendInvite and onActionComplete on resend confirm', async () => {
    mockResend.mockResolvedValue({
      message: 'Resent',
      invite_token_expires_at: '2026-03-05T00:00:00Z',
    });
    render(
      <ApplicationActions
        id="app-1"
        status="approved"
        onActionComplete={mockOnActionComplete}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Resend Invite/i }));
    fireEvent.click(screen.getByRole('button', { name: /^Resend$/i }));
    await waitFor(() => {
      expect(mockResend).toHaveBeenCalledWith('app-1');
      expect(mockOnActionComplete).toHaveBeenCalled();
    });
  });

  it('calls rejectApplication with reason on reject confirm', async () => {
    mockReject.mockResolvedValue({ message: 'Rejected' });
    render(
      <ApplicationActions
        id="app-1"
        status="pending"
        onActionComplete={mockOnActionComplete}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Reject/i }));
    const dialog = screen.getByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText(/Reason/i), {
      target: { value: 'Insufficient qualifications' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: /^Reject$/i }));
    await waitFor(() => {
      expect(mockReject).toHaveBeenCalledWith('app-1', 'Insufficient qualifications');
      expect(mockOnActionComplete).toHaveBeenCalled();
    });
  });
});
