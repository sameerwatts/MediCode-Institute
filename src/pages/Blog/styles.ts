import styled from 'styled-components';
import media from 'styles/media';

export const StyledBlogPage = styled.section`
  padding: 2rem 0 3rem;
`;

export const StyledFilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

interface IStyledFilterTabProps {
  $active: boolean;
}

export const StyledFilterTab = styled.button<IStyledFilterTabProps>`
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  background-color: ${({ $active }) => ($active ? '#2563EB' : '#E2E8F0')};
  color: ${({ $active }) => ($active ? '#FFFFFF' : '#475569')};

  &:hover {
    background-color: ${({ $active }) => ($active ? '#1D4ED8' : '#CBD5E1')};
  }
`;

export const StyledBlogGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const StyledBlogCard = styled.article`
  background-color: #FFFFFF;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }
`;

export const StyledThumbnail = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

interface IStyledCategoryBadgeProps {
  $category: 'medical' | 'cs' | 'general';
}

const categoryColors: Record<string, string> = {
  medical: '#7C3AED',
  cs: '#2563EB',
  general: '#10B981',
};

export const StyledCategoryBadge = styled.span<IStyledCategoryBadgeProps>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #FFFFFF;
  background-color: ${({ $category }) => categoryColors[$category]};
  text-transform: capitalize;
`;

export const StyledCardBody = styled.div`
  padding: 1rem 1.5rem 1.5rem;
`;

export const StyledCardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1E293B;
  margin: 0.75rem 0 0.5rem;
  line-height: 1.4;
`;

export const StyledCardExcerpt = styled.p`
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 1rem;
`;

export const StyledCardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #94A3B8;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

export const StyledReadMore = styled.span`
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2563EB;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const StyledEmptyState = styled.p`
  text-align: center;
  color: #94A3B8;
  font-size: 1rem;
  padding: 3rem 0;
  grid-column: 1 / -1;
`;
