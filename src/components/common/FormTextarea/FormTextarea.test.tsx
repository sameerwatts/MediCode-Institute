import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import FormTextarea from './index';

const noop = {};

describe('FormTextarea', () => {
  it('renders the label text', () => {
    render(<FormTextarea id="bio" label="Biography" registration={noop} />);
    expect(screen.getByText('Biography')).toBeInTheDocument();
  });

  it('associates label with textarea via htmlFor', () => {
    render(<FormTextarea id="bio" label="Biography" registration={noop} />);
    expect(screen.getByLabelText('Biography')).toBeInTheDocument();
  });

  it('renders a textarea element', () => {
    render(<FormTextarea id="bio" label="Biography" registration={noop} />);
    expect(screen.getByLabelText('Biography').tagName).toBe('TEXTAREA');
  });

  it('renders placeholder text', () => {
    render(
      <FormTextarea id="bio" label="Biography" placeholder="Tell us about yourself" registration={noop} />,
    );
    expect(screen.getByPlaceholderText('Tell us about yourself')).toBeInTheDocument();
  });

  it('renders error message when error prop is provided', () => {
    render(<FormTextarea id="bio" label="Biography" error="Required" registration={noop} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('does not render error when no error prop is provided', () => {
    render(<FormTextarea id="bio" label="Biography" registration={noop} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('applies error border class when error exists', () => {
    render(<FormTextarea id="bio" label="Biography" error="Required" registration={noop} />);
    expect(screen.getByLabelText('Biography')).toHaveClass('border-error');
  });

  it('applies normal border class when no error', () => {
    render(<FormTextarea id="bio" label="Biography" registration={noop} />);
    expect(screen.getByLabelText('Biography')).toHaveClass('border-light-gray');
  });

  it('renders with default 4 rows', () => {
    render(<FormTextarea id="bio" label="Biography" registration={noop} />);
    expect(screen.getByLabelText('Biography')).toHaveAttribute('rows', '4');
  });

  it('renders with custom rows', () => {
    render(<FormTextarea id="bio" label="Biography" rows={6} registration={noop} />);
    expect(screen.getByLabelText('Biography')).toHaveAttribute('rows', '6');
  });

  it('renders character count when maxLength is provided', () => {
    render(<FormTextarea id="bio" label="Biography" maxLength={500} registration={noop} />);
    expect(screen.getByText('0/500')).toBeInTheDocument();
  });

  it('does not render character count when maxLength is not provided', () => {
    render(<FormTextarea id="bio" label="Biography" registration={noop} />);
    expect(screen.queryByText(/\/\d+/)).not.toBeInTheDocument();
  });

  it('updates character count on input', async () => {
    render(<FormTextarea id="bio" label="Biography" maxLength={500} registration={noop} />);
    const textarea = screen.getByLabelText('Biography');
    await userEvent.type(textarea, 'Hello');
    expect(screen.getByText('5/500')).toBeInTheDocument();
  });

  it('sets maxLength attribute on textarea', () => {
    render(<FormTextarea id="bio" label="Biography" maxLength={200} registration={noop} />);
    expect(screen.getByLabelText('Biography')).toHaveAttribute('maxlength', '200');
  });
});
