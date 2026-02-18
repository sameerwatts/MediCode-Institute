import styled from 'styled-components';
import media from 'styles/media';

export const StyledSection = styled.section`
  padding: ${({ theme }) => theme.spacing.section} ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

export const StyledMissionBlock = styled.div`
  max-width: 800px;
  margin: 0 auto ${({ theme }) => theme.spacing.xxl};
  text-align: center;
`;

export const StyledMissionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.h3};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const StyledMissionText = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.darkGray};
  line-height: 1.7;
`;

export const StyledOfferGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.lg} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const StyledOfferCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

export const StyledOfferIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const StyledOfferTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.h4};
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const StyledOfferDesc = styled.p`
  font-size: ${({ theme }) => theme.typography.small};
  color: ${({ theme }) => theme.colors.darkGray};
  line-height: 1.5;
`;

export const StyledTeamGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.lg} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const StyledTeacherCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

export const StyledAvatar = styled.img`
  width: 96px;
  height: 96px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  object-fit: cover;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
`;

export const StyledTeacherName = styled.h4`
  font-size: ${({ theme }) => theme.typography.h4};
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const StyledDesignation = styled.p`
  font-size: ${({ theme }) => theme.typography.small};
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const StyledDeptBadge = styled.span<{ $dept: 'medical' | 'cs' }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.xs};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme, $dept }) =>
    $dept === 'medical' ? theme.colors.medical : theme.colors.cs};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StyledBio = styled.p`
  font-size: ${({ theme }) => theme.typography.small};
  color: ${({ theme }) => theme.colors.gray};
  line-height: 1.5;
`;

export const StyledContactSection = styled.section`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.primaryDark} 100%
  );
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.section} ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

export const StyledContactTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.h2};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const StyledContactEmail = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  opacity: 0.9;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  a {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: underline;
  }
`;
