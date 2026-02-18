import styled from 'styled-components';
import { Link } from 'react-router-dom';
import media from 'styles/media';

export const StyledNav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1000;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const StyledNavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
`;

export const StyledLogo = styled(Link)`
  font-size: ${({ theme }) => theme.typography.h3};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};

  span {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const StyledNavLinks = styled.ul<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(-150%)')};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: transform 0.3s ease, visibility 0.3s ease;
  gap: ${({ theme }) => theme.spacing.sm};

  ${media.md} {
    position: static;
    flex-direction: row;
    transform: none;
    visibility: visible;
    box-shadow: none;
    padding: 0;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

export const StyledNavLink = styled(Link)<{ $isActive: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-weight: ${({ $isActive }) => ($isActive ? 600 : 500)};
  color: ${({ theme, $isActive }) => ($isActive ? theme.colors.primary : theme.colors.darkGray)};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const StyledHamburger = styled.button`
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: none;
  padding: ${({ theme }) => theme.spacing.sm};

  span {
    display: block;
    width: 24px;
    height: 2px;
    background: ${({ theme }) => theme.colors.dark};
    transition: transform 0.3s;
  }

  ${media.md} {
    display: none;
  }
`;
