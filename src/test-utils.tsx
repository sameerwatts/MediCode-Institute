import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'styles/theme';

const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>{children}</BrowserRouter>
  </ThemeProvider>
);

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllProviders, ...options });

export const renderWithMemoryRouter = (
  ui: ReactElement,
  { initialEntries = ['/'], ...options }: Omit<RenderOptions, 'wrapper'> & { initialEntries?: string[] } = {}
) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </ThemeProvider>,
    options
  );

export * from '@testing-library/react';
export { customRender as render };
