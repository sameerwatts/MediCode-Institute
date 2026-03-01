import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import BecomeATeacher from './index';
import * as applicationService from '@/services/applicationService';

jest.mock('@/services/applicationService');
const mockSubmit = jest.mocked(applicationService.submitApplication);

const VALID_QUALIFICATIONS = 'MBBS, MD with 5 years of clinical experience';
const VALID_PHILOSOPHY =
  'I believe in patient-centred learning that engages students deeply.';

function fillValidForm() {
  fireEvent.change(screen.getByLabelText('Full Name'), {
    target: { value: 'Dr. Jane Smith' },
  });
  fireEvent.change(screen.getByLabelText('Email Address'), {
    target: { value: 'jane@example.com' },
  });
  fireEvent.change(screen.getByLabelText('Phone Number'), {
    target: { value: '+91 9876543210' },
  });
  fireEvent.click(screen.getByLabelText('Medical Sciences'));
  fireEvent.change(screen.getByLabelText('Years of Teaching Experience'), {
    target: { value: '5' },
  });
  fireEvent.change(screen.getByLabelText('Qualifications'), {
    target: { value: VALID_QUALIFICATIONS },
  });
  fireEvent.change(screen.getByLabelText('Teaching Philosophy'), {
    target: { value: VALID_PHILOSOPHY },
  });
}

describe('BecomeATeacher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page heading', () => {
    render(<BecomeATeacher />);
    expect(
      screen.getByRole('heading', { name: /Become a Teacher/i }),
    ).toBeInTheDocument();
  });

  it('renders the name input', () => {
    render(<BecomeATeacher />);
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
  });

  it('renders the email input', () => {
    render(<BecomeATeacher />);
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
  });

  it('renders the phone input', () => {
    render(<BecomeATeacher />);
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
  });

  it('renders the subject area radio options', () => {
    render(<BecomeATeacher />);
    expect(screen.getByLabelText('Medical Sciences')).toBeInTheDocument();
    expect(screen.getByLabelText('Computer Science')).toBeInTheDocument();
  });

  it('renders the experience input', () => {
    render(<BecomeATeacher />);
    expect(
      screen.getByLabelText('Years of Teaching Experience'),
    ).toBeInTheDocument();
  });

  it('renders the qualifications textarea', () => {
    render(<BecomeATeacher />);
    expect(screen.getByLabelText('Qualifications')).toBeInTheDocument();
  });

  it('renders the teaching philosophy textarea', () => {
    render(<BecomeATeacher />);
    expect(screen.getByLabelText('Teaching Philosophy')).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    render(<BecomeATeacher />);
    expect(
      screen.getByRole('button', { name: /Submit Application/i }),
    ).toBeInTheDocument();
  });

  it('shows a name validation error when submitted empty', async () => {
    render(<BecomeATeacher />);
    fireEvent.click(screen.getByRole('button', { name: /Submit Application/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/Name must be at least 2 characters/i),
      ).toBeInTheDocument();
    });
  });

  it('shows server error when submission fails', async () => {
    mockSubmit.mockRejectedValue(
      new Error('You already have a pending application'),
    );
    render(<BecomeATeacher />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /Submit Application/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'You already have a pending application',
      );
    });
  });

  it('shows success state with application ID after submission', async () => {
    mockSubmit.mockResolvedValue({
      id: 'app-uuid-123',
      message: 'Application submitted successfully',
      status: 'pending',
    });
    render(<BecomeATeacher />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /Submit Application/i }));
    await waitFor(() => {
      expect(screen.getByText(/Application Submitted/i)).toBeInTheDocument();
    });
    expect(screen.getByText('app-uuid-123')).toBeInTheDocument();
  });

  it('does not show success state before submission', () => {
    render(<BecomeATeacher />);
    expect(screen.queryByText(/Application Submitted/i)).not.toBeInTheDocument();
  });
});
