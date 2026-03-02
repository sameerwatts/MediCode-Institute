'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/data/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/context/SidebarContext';
import Button from '@/components/common/Button';

const Navbar: React.FC = () => {
  const { toggleMenu } = useSidebar();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-[1000] bg-white shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-16">

        {/* Hamburger — mobile left */}
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className="flex flex-col items-center justify-center gap-[5px] w-12 h-12 md:hidden rounded-full bg-light active:scale-90 transition-transform duration-150 ease-out"
        >
          <span className="block w-5 h-[2px] bg-dark rounded-full" />
          <span className="block w-5 h-[2px] bg-dark rounded-full" />
          <span className="block w-[10px] h-[2px] bg-dark rounded-full self-start ml-[14px]" />
        </button>

        {/* Logo — right on mobile, left on desktop */}
        <Link href="/" className="text-h3 font-extrabold text-primary">
          Medi<span className="text-secondary">Code</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className={`transition-colors duration-200 hover:text-primary
                  ${pathname === link.path ? 'font-semibold text-primary' : 'font-medium text-dark-gray'}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth */}
        {!isLoading && (
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin/teacher-requests"
                    className="text-sm-text font-semibold text-primary hover:text-primary-dark transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <span className="text-sm-text font-semibold text-dark-gray">{user?.name}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
