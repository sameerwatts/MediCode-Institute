import React from 'react';
import { render, screen, fireEvent } from '@/test-utils';
import Modal from './index';

describe('Modal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders the title', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Confirm Action">
        <p>Are you sure?</p>
      </Modal>,
    );
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <p>This is the modal body</p>
      </Modal>,
    );
    expect(screen.getByText('This is the modal body')).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>,
    );
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>,
    );
    fireEvent.click(screen.getByText('Content'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>,
    );
    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders confirm and cancel buttons when onConfirm is provided', () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        title="Test"
        onConfirm={() => {}}
        confirmText="Approve"
      >
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText('Approve')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = jest.fn();
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        title="Test"
        onConfirm={onConfirm}
        confirmText="Yes"
      >
        <p>Content</p>
      </Modal>,
    );
    fireEvent.click(screen.getByText('Yes'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('renders custom cancelText', () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        title="Test"
        onConfirm={() => {}}
        confirmText="Confirm"
        cancelText="Go Back"
      >
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('does not render action buttons when onConfirm is not provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('has aria-modal attribute', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });
});
