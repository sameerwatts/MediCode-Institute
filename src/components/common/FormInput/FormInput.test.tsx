import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import FormInput from './index';

const noop = {};

describe('FormInput', () => {
  it('renders the label text', () => {
    render(<FormInput id="email" label="Email Address" registration={noop} />);
    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('associates label with input via htmlFor', () => {
    render(<FormInput id="email" label="Email Address" registration={noop} />);
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
  });

  it('renders error message when error prop is provided', () => {
    render(<FormInput id="email" label="Email" error="Email is required" registration={noop} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
  });

  it('does not render error when no error prop is provided', () => {
    render(<FormInput id="email" label="Email" registration={noop} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('applies error border class when error exists', () => {
    render(<FormInput id="email" label="Email" error="Required" registration={noop} />);
    expect(screen.getByLabelText('Email')).toHaveClass('border-error');
  });

  it('applies normal border class when no error', () => {
    render(<FormInput id="email" label="Email" registration={noop} />);
    expect(screen.getByLabelText('Email')).toHaveClass('border-light-gray');
  });

  it('does not render show/hide toggle when showToggle is false', () => {
    render(
      <FormInput id="pw" label="Password" type="password" registration={noop} />,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders show/hide toggle when showToggle is true and type is password', () => {
    render(
      <FormInput id="pw" label="Password" type="password" showToggle registration={noop} />,
    );
    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
  });

  it('toggles password visibility when toggle button is clicked', async () => {
    render(
      <FormInput id="pw" label="Password" type="password" showToggle registration={noop} />,
    );
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');

    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input).toHaveAttribute('type', 'text');

    await userEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('applies readOnly styles when registration includes readOnly', () => {
    render(<FormInput id="name" label="Full Name" registration={{ readOnly: true }} />);
    const input = screen.getByLabelText('Full Name');
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveClass('read-only:bg-gray-100');
    expect(input).toHaveClass('read-only:cursor-not-allowed');
  });

  it('updates aria-label after toggling password visibility', async () => {
    render(
      <FormInput id="pw" label="Password" type="password" showToggle registration={noop} />,
    );
    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
  });
});
