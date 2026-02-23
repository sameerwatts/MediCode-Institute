'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';

const ROLE_BADGE: Record<string, string> = {
  student: 'bg-primary-light text-primary',
  teacher: 'bg-secondary text-white',
  admin: 'bg-dark text-white',
};

const Dashboard: React.FC = () => {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <Loader />;
  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-light py-section px-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <h1 className="text-h1 font-extrabold text-dark">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-body text-dark-gray mt-2">
            Here&apos;s your MediCode dashboard.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-h3 font-extrabold text-primary select-none">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-h4 font-bold text-dark">{user.name}</h2>
              <p className="text-sm-text text-dark-gray">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm-text font-semibold text-dark-gray">Role:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm-text font-semibold capitalize ${
                ROLE_BADGE[user.role] ?? 'bg-light-gray text-dark'
              }`}
            >
              {user.role}
            </span>
          </div>

          <div className="border-t border-light-gray pt-6">
            <Button variant="outline" size="md" onClick={handleLogout} className="w-full">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
