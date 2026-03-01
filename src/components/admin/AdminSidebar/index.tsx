'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface IAdminSidebarProps {
  onLogout: () => void;
}

const navItems = [
  { label: 'Teacher Requests', href: '/admin/teacher-requests' },
];

const AdminSidebar: React.FC<IAdminSidebarProps> = ({ onLogout }) => {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 bg-dark flex flex-col h-full">
      <div className="px-6 py-5 border-b border-dark-gray">
        <span className="text-h4 font-extrabold text-white">
          Medi<span className="text-secondary">Code</span>
        </span>
        <p className="text-sm-text text-gray mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Admin navigation">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm-text font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray hover:bg-dark-gray/40 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-dark-gray">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm-text font-medium text-gray hover:bg-dark-gray/40 hover:text-white transition-colors duration-150"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
