'use client';

import React from 'react';

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  confirmVariant?: 'danger' | 'primary';
}

const Modal: React.FC<IModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  confirmVariant = 'primary',
}) => {
  if (!isOpen) return null;

  const confirmButtonClass =
    confirmVariant === 'danger'
      ? 'bg-error hover:bg-red-700 text-white'
      : 'bg-primary hover:bg-primary-dark text-white';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-h4 font-semibold text-dark">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray hover:text-dark-gray transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 text-body text-dark-gray">{children}</div>

        {(onConfirm || confirmText) && (
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm-text font-medium text-dark-gray border border-light-gray rounded-md hover:bg-light transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm-text font-medium rounded-md transition-colors ${confirmButtonClass}`}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
