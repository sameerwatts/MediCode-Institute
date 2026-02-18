import styled from 'styled-components';
import { Link } from 'react-router-dom';
import media from 'styles/media';

export const StyledFooter = styled.footer`
  background: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.gray};
  padding: ${({ theme }) => `${theme.spacing.section} ${theme.spacing.md} ${theme.spacing.xl}`};
`;

export const StyledFooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.md} {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
`;

export const StyledFooterBrand = styled.div`
  h3 {
    font-size: ${({ theme }) => theme.typography.h3};
    color: ${({ theme }) => theme.colors.white};
    margin-bottom: ${({ theme }) => theme.spacing.md};

    span {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }

  p {
    line-height: 1.8;
    font-size: ${({ theme }) => theme.typography.small};
  }
`;

export const StyledFooterColumn = styled.div`
  h4 {
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.typography.body};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

export const StyledFooterLink = styled(Link)`
  display: block;
  font-size: ${({ theme }) => theme.typography.small};
  padding: ${({ theme }) => theme.spacing.xs} 0;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const StyledCopyright = styled.div`
  max-width: 1200px;
  margin: ${({ theme }) => theme.spacing.xl} auto 0;
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.darkGray};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.small};
`;
