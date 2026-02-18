import styled from 'styled-components';
import media from 'styles/media';

export const StyledHero = styled.section`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.dark} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.section} ${({ theme }) => theme.spacing.lg};
  text-align: center;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledHeroContent = styled.div`
  max-width: 800px;
`;

export const StyledHeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.h2};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.2;

  ${media.md} {
    font-size: ${({ theme }) => theme.typography.h1};
  }
`;

export const StyledHeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.lightGray};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  ${media.md} {
    font-size: 1.125rem;
  }
`;

export const StyledFeaturesGrid = styled.div`
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

export const StyledFeatureCard = styled.div`
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

export const StyledFeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const StyledFeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.h4};
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const StyledFeatureDesc = styled.p`
  font-size: ${({ theme }) => theme.typography.small};
  color: ${({ theme }) => theme.colors.darkGray};
  line-height: 1.5;
`;

export const StyledSection = styled.section`
  padding: ${({ theme }) => theme.spacing.section} ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

export const StyledCoursesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const StyledCategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StyledCategoryCard = styled.div<{ $variant: 'medical' | 'cs' }>`
  background: ${({ theme, $variant }) =>
    $variant === 'medical'
      ? `linear-gradient(135deg, ${theme.colors.medical}, #9333EA)`
      : `linear-gradient(135deg, ${theme.colors.cs}, #3B82F6)`};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xxl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

export const StyledCategoryIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const StyledCategoryTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.h3};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const StyledCategoryDesc = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  opacity: 0.9;
  line-height: 1.5;
`;

export const StyledStatsSection = styled.section`
  background: ${({ theme }) => theme.colors.primaryLight};
  padding: ${({ theme }) => theme.spacing.section} ${({ theme }) => theme.spacing.lg};
`;

export const StyledStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 1000px;
  margin: 0 auto;

  ${media.md} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const StyledStatItem = styled.div`
  text-align: center;
`;

export const StyledStatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.h2};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  ${media.md} {
    font-size: ${({ theme }) => theme.typography.h1};
  }
`;

export const StyledStatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.small};
  color: ${({ theme }) => theme.colors.darkGray};
  font-weight: 500;
`;

export const StyledCTASection = styled.section`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.section} ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

export const StyledCTATitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.h2};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const StyledCTAText = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  opacity: 0.9;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;
