import styled from 'styled-components';

export const StyledCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

export const StyledCardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

export const StyledCardBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;
