'use client';

import React, { useState } from 'react';
import Modal from '@/components/common/Modal';
import {
  approveApplication,
  rejectApplication,
  resendInvite,
} from '@/services/adminService';
import { TApplicationStatus } from '@/types';

interface IApplicationActionsProps {
  id: string;
  status: TApplicationStatus;
  onActionComplete: () => void;
}

const ApplicationActions: React.FC<IApplicationActionsProps> = ({
  id,
  status,
  onActionComplete,
}) => {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [resendOpen, setResendOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const clearMessages = () => {
    setError('');
    setSuccessMsg('');
  };

  const handleApprove = async () => {
    setIsLoading(true);
    clearMessages();
    try {
      await approveApplication(id);
      setApproveOpen(false);
      setSuccessMsg('Application approved. Invite email sent.');
      onActionComplete();
    } catch (err) {
      setApproveOpen(false);
      setError(err instanceof Error ? err.message : 'Failed to approve application.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    clearMessages();
    try {
      await rejectApplication(id, rejectReason || undefined);
      setRejectOpen(false);
      setRejectReason('');
      setSuccessMsg('Application rejected.');
      onActionComplete();
    } catch (err) {
      setRejectOpen(false);
      setError(err instanceof Error ? err.message : 'Failed to reject application.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    clearMessages();
    try {
      await resendInvite(id);
      setResendOpen(false);
      setSuccessMsg('New invite email sent. Previous invite invalidated.');
      onActionComplete();
    } catch (err) {
      setResendOpen(false);
      setError(err instanceof Error ? err.message : 'Failed to resend invite.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'registered') {
    return (
      <p className="text-sm-text text-dark-gray italic">
        Teacher has registered. No further actions required.
      </p>
    );
  }

  if (status === 'rejected') {
    return (
      <p className="text-sm-text text-dark-gray italic">
        Application was rejected. No further actions available.
      </p>
    );
  }

  return (
    <div>
      {error && (
        <div
          role="alert"
          className="bg-red-50 border border-error rounded-md px-4 py-3 mb-4 text-error text-sm-text"
        >
          {error}
        </div>
      )}
      {successMsg && (
        <div
          role="status"
          className="bg-green-50 border border-success rounded-md px-4 py-3 mb-4 text-success text-sm-text"
        >
          {successMsg}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {status === 'pending' && (
          <>
            <button
              onClick={() => { clearMessages(); setApproveOpen(true); }}
              disabled={isLoading}
              className="px-4 py-2 bg-success text-white text-sm-text font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => { clearMessages(); setRejectOpen(true); }}
              disabled={isLoading}
              className="px-4 py-2 bg-error text-white text-sm-text font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Reject
            </button>
          </>
        )}
        {status === 'approved' && (
          <button
            onClick={() => { clearMessages(); setResendOpen(true); }}
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-white text-sm-text font-medium rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            Resend Invite
          </button>
        )}
      </div>

      <Modal
        isOpen={approveOpen}
        onClose={() => setApproveOpen(false)}
        title="Approve Application"
        confirmText="Approve"
        onConfirm={handleApprove}
        confirmVariant="primary"
        isLoading={isLoading}
      >
        Are you sure you want to approve this application? An invite email will
        be sent to the applicant.
      </Modal>

      <Modal
        isOpen={rejectOpen}
        onClose={() => { setRejectOpen(false); setRejectReason(''); }}
        title="Reject Application"
        confirmText="Reject"
        onConfirm={handleReject}
        confirmVariant="danger"
        isLoading={isLoading}
      >
        <p className="mb-3">Are you sure you want to reject this application?</p>
        <label
          htmlFor="reject-reason"
          className="block text-sm-text font-medium text-dark mb-1"
        >
          Reason (optional)
        </label>
        <textarea
          id="reject-reason"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={3}
          placeholder="Provide a reason for rejection..."
          className="w-full border border-light-gray rounded-md px-3 py-2 text-sm-text text-dark focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />
      </Modal>

      <Modal
        isOpen={resendOpen}
        onClose={() => setResendOpen(false)}
        title="Resend Invite"
        confirmText="Resend"
        onConfirm={handleResend}
        confirmVariant="primary"
        isLoading={isLoading}
      >
        A new invite link will be sent to the applicant. The previous invite
        will be invalidated.
      </Modal>
    </div>
  );
};

export default ApplicationActions;
