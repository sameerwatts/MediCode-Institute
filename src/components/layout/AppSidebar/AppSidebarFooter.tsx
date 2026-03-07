'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';

interface IAppSidebarFooterProps {
  variant: 'public' | 'admin';
  onClose: () => void;
  borderColor: string;
}

const PublicFooter: React.FC<{ onClose: () => void; borderColor: string }> = ({
  onClose,
  borderColor,
}) => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  if (isLoading) return null;

  return (
    <div className={`mt-auto pt-4 border-t ${borderColor}`}>
      {isAuthenticated ? (
        <div className="flex flex-col gap-2">
          {user?.role === 'admin' && (
            <Link
              href="/admin/teacher-requests"
              onClick={onClose}
              className={`block px-4 py-2.5 rounded-lg text-sm-text transition-colors duration-200 hover:text-primary hover:bg-light ${
                pathname.startsWith('/admin')
                  ? 'font-semibold text-primary bg-primary-light'
                  : 'font-medium text-dark-gray'
              }`}
            >
              Admin Dashboard
            </Link>
          )}
          <div className="flex items-center justify-between px-2">
            <span className="text-sm-text font-semibold text-dark">{user?.name}</span>
            <button
              onClick={handleLogout}
              aria-label="Sign out"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-light text-dark-gray hover:bg-red-50 hover:text-red-500 active:scale-90 transition-all duration-150 ease-out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Link href="/login" onClick={onClose}>
            <Button variant="outline" size="sm" className="w-full">
              Login
            </Button>
          </Link>
          <Link href="/signup" onClick={onClose}>
            <Button variant="primary" size="sm" className="w-full">
              Sign Up
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

const AdminFooter: React.FC<{ onClose: () => void; borderColor: string }> = ({
  onClose,
  borderColor,
}) => (
  <div className={`px-3 py-4 border-t ${borderColor}`}>
    <Link
      href="/"
      onClick={onClose}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm-text font-medium text-gray hover:bg-dark-gray/40 hover:text-white transition-colors duration-150"
    >
      ← Back to Home
    </Link>
  </div>
);

const AppSidebarFooter: React.FC<IAppSidebarFooterProps> = ({ variant, onClose, borderColor }) => {
  if (variant === 'admin') {
    return <AdminFooter onClose={onClose} borderColor={borderColor} />;
  }
  return <PublicFooter onClose={onClose} borderColor={borderColor} />;
};

export default AppSidebarFooter;
