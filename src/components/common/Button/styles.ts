import styled, { css } from 'styled-components';

interface IStyledButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: css`
    padding: 0.5rem 1rem;
    font-size: ${({ theme }) => theme.typography.small};
  `,
  md: css`
    padding: 0.75rem 1.5rem;
    font-size: ${({ theme }) => theme.typography.body};
  `,
  lg: css`
    padding: 1rem 2rem;
    font-size: ${({ theme }) => theme.typography.h4};
  `,
};

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    &:hover {
      background: ${({ theme }) => theme.colors.primaryDark};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.white};
    &:hover {
      background: ${({ theme }) => theme.colors.secondaryDark};
    }
  `,
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 2px solid ${({ theme }) => theme.colors.primary};
    &:hover {
      background: ${({ theme }) => theme.colors.primaryLight};
    }
  `,
};

export const StyledButton = styled.button<IStyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  ${({ size = 'md' }) => sizeStyles[size]}
  ${({ variant = 'primary' }) => variantStyles[variant]}
`;
