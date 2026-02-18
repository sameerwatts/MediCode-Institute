import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { navLinks } from 'data/navigation';
import {
  StyledNav,
  StyledNavContainer,
  StyledLogo,
  StyledNavLinks,
  StyledNavLink,
  StyledHamburger,
} from './styles';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <StyledNav>
      <StyledNavContainer>
        <StyledLogo to="/" onClick={closeMenu}>
          Medi<span>Code</span>
        </StyledLogo>

        <StyledNavLinks $isOpen={isOpen}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <StyledNavLink
                to={link.path}
                $isActive={location.pathname === link.path}
                onClick={closeMenu}
              >
                {link.label}
              </StyledNavLink>
            </li>
          ))}
        </StyledNavLinks>

        <StyledHamburger onClick={toggleMenu} aria-label="Toggle menu">
          <span />
          <span />
          <span />
        </StyledHamburger>
      </StyledNavContainer>
    </StyledNav>
  );
};

export default Navbar;
