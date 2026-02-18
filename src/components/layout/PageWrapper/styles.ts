import styled from 'styled-components';

export const StyledPageWrapper = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.md}`};
  min-height: calc(100vh - 64px - 300px);
`;
