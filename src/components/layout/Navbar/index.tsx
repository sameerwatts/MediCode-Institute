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

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <nav className="sticky top-0 z-[1000] bg-white shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" onClick={closeMenu} className="text-h3 font-extrabold text-primary">
          Medi<span className="text-secondary">Code</span>
        </Link>

        <ul
          className={`flex flex-col fixed top-16 left-0 right-0 bg-white p-4 shadow-md gap-2 transition-all duration-300
            ${isOpen ? 'translate-y-0 visible' : '-translate-y-[150%] invisible'}
            md:static md:flex-row md:translate-y-0 md:visible md:shadow-none md:p-0 md:gap-8`}
        >
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
            <li className="md:hidden border-t border-light-gray pt-2 mt-2">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2 px-4">
                  <span className="text-sm-text font-semibold text-dark">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-left text-sm-text text-dark-gray hover:text-primary transition-colors"
                  >
                    Sign Out
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
          className="flex flex-col gap-1 p-2 md:hidden"
        >
          <span className="block w-6 h-0.5 bg-dark transition-transform duration-300" />
          <span className="block w-6 h-0.5 bg-dark transition-transform duration-300" />
          <span className="block w-6 h-0.5 bg-dark transition-transform duration-300" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
