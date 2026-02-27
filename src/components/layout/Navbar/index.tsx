'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/data/navigation';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMenu();
  };

  return (
    <nav className="sticky top-0 z-[1000] bg-white shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" onClick={closeMenu} className="text-h3 font-extrabold text-primary">
          Medi<span className="text-secondary">Code</span>
        </Link>

        {/* Backdrop overlay — mobile only */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-[1001] md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}

        {/* Sidebar drawer */}
        <ul
          className={`flex flex-col fixed top-0 left-0 h-screen w-[75%] bg-white p-6 shadow-xl gap-2
            z-[1002] transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            md:static md:h-auto md:w-auto md:flex-row md:translate-x-0 md:shadow-none md:p-0 md:gap-8 md:z-auto`}
        >
          {/* Brand + close button — mobile only */}
          <li className="md:hidden flex items-center justify-between mb-4 pb-4 border-b border-light-gray">
            <span className="text-h3 font-extrabold text-primary">
              Medi<span className="text-secondary">Code</span>
            </span>
            <button
              onClick={closeMenu}
              aria-label="Close menu"
              className="p-1 text-dark-gray hover:text-primary transition-colors"
            >
              ✕
            </button>
          </li>

          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                onClick={closeMenu}
                className={`block px-4 py-2 transition-colors duration-200 hover:text-primary
                  ${pathname === link.path ? 'font-semibold text-primary' : 'font-medium text-dark-gray'}`}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {!isLoading && (
            <li className="md:hidden mt-auto pt-4 border-t border-light-gray">
              {isAuthenticated ? (
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm-text font-semibold text-dark">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    aria-label="Sign out"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-light text-dark-gray hover:bg-red-50 hover:text-red-500 active:scale-90 transition-all duration-150 ease-out"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
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
              ) : (
                <div className="flex flex-col gap-2 px-4">
                  <Link href="/login" onClick={closeMenu}>
                    <Button variant="outline" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={closeMenu}>
                    <Button variant="primary" size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </li>
          )}
        </ul>

        {!isLoading && (
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm-text font-semibold text-dark-gray">{user?.name}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}

        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className="flex flex-col items-center justify-center gap-[5px] w-12 h-12 md:hidden rounded-full bg-light active:scale-90 transition-transform duration-150 ease-out"
        >
          <span className="block w-5 h-[2px] bg-dark rounded-full" />
          <span className="block w-5 h-[2px] bg-dark rounded-full" />
          <span className="block w-[10px] h-[2px] bg-dark rounded-full self-start ml-[14px]" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
