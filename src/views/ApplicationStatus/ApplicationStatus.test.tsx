import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import ApplicationStatus from './index';
import * as applicationService from '@/services/applicationService';

jest.mock('@/services/applicationService');
const mockCheck = jest.mocked(applicationService.checkApplicationStatus);

describe('ApplicationStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page heading', () => {
    render(<ApplicationStatus />);
    expect(
      screen.getByRole('heading', { name: /Application Status/i }),
    ).toBeInTheDocument();
  });

  it('renders the email input', () => {
    render(<ApplicationStatus />);
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
  });

  it('renders the application ID input', () => {
    render(<ApplicationStatus />);
    expect(screen.getByLabelText('Application ID')).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    render(<ApplicationStatus />);
    expect(
      screen.getByRole('button', { name: /Check Status/i }),
    ).toBeInTheDocument();
  });

  it('shows email validation error on empty submit', async () => {
    render(<ApplicationStatus />);
    fireEvent.click(screen.getByRole('button', { name: /Check Status/i }));
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('shows application ID validation error on empty submit', async () => {
    render(<ApplicationStatus />);
    fireEvent.click(screen.getByRole('button', { name: /Check Status/i }));
    await waitFor(() => {
      expect(screen.getByText('Application ID is required')).toBeInTheDocument();
    });
  });

  it('shows server error when API call fails', async () => {
    mockCheck.mockRejectedValue(new Error('Application not found'));
    render(<ApplicationStatus />);
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Application ID'), {
      target: { value: 'abc-123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Check Status/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Application not found');
    });
  });

  it('shows StatusBadge after successful check', async () => {
    mockCheck.mockResolvedValue({
      id: 'abc-123',
      status: 'pending',
      created_at: '2026-03-01T10:00:00Z',
      reviewed_at: null,
    });
    render(<ApplicationStatus />);
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Application ID'), {
      target: { value: 'abc-123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Check Status/i }));
    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  it('shows status message for pending application', async () => {
    mockCheck.mockResolvedValue({
      id: 'abc-123',
      status: 'pending',
      created_at: '2026-03-01T10:00:00Z',
      reviewed_at: null,
    });
    render(<ApplicationStatus />);
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Application ID'), {
      target: { value: 'abc-123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Check Status/i }));
    await waitFor(() => {
      expect(screen.getByText(/being reviewed/i)).toBeInTheDocument();
    });
  });

  it('shows "Pending review" when reviewed_at is null', async () => {
    mockCheck.mockResolvedValue({
      id: 'abc-123',
      status: 'pending',
      created_at: '2026-03-01T10:00:00Z',
      reviewed_at: null,
    });
    render(<ApplicationStatus />);
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Application ID'), {
      target: { value: 'abc-123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Check Status/i }));
    await waitFor(() => {
      expect(screen.getByText('Pending review')).toBeInTheDocument();
    });
  });

  it('shows approved status message', async () => {
    mockCheck.mockResolvedValue({
      id: 'abc-123',
      status: 'approved',
      created_at: '2026-03-01T10:00:00Z',
      reviewed_at: '2026-03-02T10:00:00Z',
    });
    render(<ApplicationStatus />);
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Application ID'), {
      target: { value: 'abc-123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Check Status/i }));
    await waitFor(() => {
      expect(screen.getByText('Approved')).toBeInTheDocument();
    });
    expect(screen.getByText(/invite link/i)).toBeInTheDocument();
  });

  it('does not show result section before submission', () => {
    render(<ApplicationStatus />);
    expect(screen.queryByText('Pending')).not.toBeInTheDocument();
    expect(screen.queryByText('Submitted')).not.toBeInTheDocument();
  });

  it('renders a link to the become-a-teacher page', () => {
    render(<ApplicationStatus />);
    expect(screen.getByRole('link', { name: /Become a Teacher/i })).toBeInTheDocument();
  });
});
