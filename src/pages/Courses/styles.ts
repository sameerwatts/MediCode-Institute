import styled from 'styled-components';
import media from 'styles/media';

export const StyledCoursesPage = styled.section`
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

export const StyledCourseGrid = styled.div`
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

export const StyledEmptyState = styled.p`
  text-align: center;
  color: #94A3B8;
  font-size: 1rem;
  padding: 3rem 0;
  grid-column: 1 / -1;
`;
