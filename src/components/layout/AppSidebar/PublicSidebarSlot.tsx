'use client';

import React from 'react';
import { useSidebar } from '@/context/SidebarContext';
import AppSidebar from './index';

const PublicSidebarSlot: React.FC = () => {
  const { closeMenu } = useSidebar();
  return <AppSidebar variant="public" onClose={closeMenu} />;
};

export default PublicSidebarSlot;
