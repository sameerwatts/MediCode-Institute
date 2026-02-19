'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/data/navigation';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

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
        </ul>

        <button onClick={toggleMenu} aria-label="Toggle menu" className="flex flex-col gap-1 p-2 md:hidden">
          <span className="block w-6 h-0.5 bg-dark transition-transform duration-300" />
          <span className="block w-6 h-0.5 bg-dark transition-transform duration-300" />
          <span className="block w-6 h-0.5 bg-dark transition-transform duration-300" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
