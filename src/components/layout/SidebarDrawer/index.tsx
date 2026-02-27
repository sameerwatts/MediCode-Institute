"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/context/SidebarContext";
import Button from "@/components/common/Button";

const SidebarDrawer: React.FC = () => {
  const { closeMenu } = useSidebar();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    closeMenu();
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-[80%] bg-white z-10 flex flex-col p-6 md:hidden">
      {/* Brand */}
      <div className="mb-4 pb-4 border-b border-light-gray">
        <span className="text-h3 font-extrabold text-primary">
          Medi<span className="text-secondary">Code</span>
        </span>
      </div>

      {/* Nav links */}
      <ul className="flex flex-col gap-1">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              href={link.path}
              onClick={closeMenu}
              className={`block px-4 py-2.5 rounded-lg transition-colors duration-200 hover:text-primary hover:bg-light
                ${pathname === link.path ? "font-semibold text-primary bg-primary-light" : "font-medium text-dark-gray"}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Auth section pinned to bottom */}
      {!isLoading && (
        <div className="mt-auto pt-4 border-t border-light-gray">
          {isAuthenticated ? (
            <div className="flex items-center justify-between px-2">
              <span className="text-sm-text font-semibold text-dark">
                {user?.name}
              </span>
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
          ) : (
            <div className="flex flex-col gap-2">
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
        </div>
      )}
    </div>
  );
};

export default SidebarDrawer;
