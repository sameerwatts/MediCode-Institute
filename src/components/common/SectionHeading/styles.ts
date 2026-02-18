import styled from 'styled-components';
import media from 'styles/media';

export const StyledSectionHeading = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

export const StyledTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.h3};
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  ${media.md} {
    font-size: ${({ theme }) => theme.typography.h2};
  }
`;

export const StyledSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.darkGray};
  max-width: 600px;
  margin: 0 auto;
`;
