import styled from 'styled-components';
import media from 'styles/media';

export const StyledQuizPage = styled.section`
  padding: 2rem 0 3rem;
`;

export const StyledQuizGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.lg} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${media.xl} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const StyledQuizCard = styled.div`
  background-color: #FFFFFF;
  border-radius: 0.75rem;
  border: 1px solid #E2E8F0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

export const StyledBadgeRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

interface IStyledBadgeProps {
  $color: string;
}

export const StyledBadge = styled.span<IStyledBadgeProps>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #FFFFFF;
  background-color: ${({ $color }) => $color};
`;

export const StyledQuizTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
`;

export const StyledQuizDescription = styled.p`
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.5;
  margin: 0;
`;

export const StyledQuizMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #94A3B8;
  margin-top: auto;
  padding-top: 0.5rem;
`;

export const StyledMetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const StyledCardFooter = styled.div`
  padding-top: 0.5rem;
`;
