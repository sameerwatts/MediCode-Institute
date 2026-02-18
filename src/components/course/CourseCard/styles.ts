import styled from 'styled-components';

export const StyledCourseCard = styled.div`
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

export const StyledThumbnail = styled.div`
  position: relative;

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
`;

export const StyledBadge = styled.span<{ $category: 'medical' | 'cs' }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  left: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background: ${({ theme, $category }) =>
    $category === 'medical' ? theme.colors.medical : theme.colors.cs};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.xs};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-transform: uppercase;
`;

export const StyledCardBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const StyledTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.dark};
`;

export const StyledTeacher = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }

  span {
    font-size: ${({ theme }) => theme.typography.small};
    color: ${({ theme }) => theme.colors.darkGray};
  }
`;

export const StyledMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.small};
  color: ${({ theme }) => theme.colors.gray};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const StyledPrice = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  .current {
    font-size: ${({ theme }) => theme.typography.h4};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }

  .original {
    font-size: ${({ theme }) => theme.typography.small};
    color: ${({ theme }) => theme.colors.gray};
    text-decoration: line-through;
  }
`;
