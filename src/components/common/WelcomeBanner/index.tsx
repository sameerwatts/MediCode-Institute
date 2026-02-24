'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const WelcomeBanner: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading || !isAuthenticated || !user) return null;

  return (
    <div className="bg-primary-light border-b border-primary/20 px-6 py-3 text-center">
      <p className="text-primary font-semibold text-body">
        Welcome back, {user.name.split(' ')[0]}!
      </p>
    </div>
  );
};

export default WelcomeBanner;
