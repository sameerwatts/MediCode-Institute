import React from 'react';
import { render, screen } from '@/test-utils';
import NotFound from './index';

describe('NotFound', () => {
  beforeEach(() => {
    render(<NotFound />);
  });

  it('renders the 404 error code', () => {
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders the Page Not Found heading', () => {
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('renders a descriptive subtitle', () => {
    expect(screen.getByText(/doesn't exist or has been moved/)).toBeInTheDocument();
  });

  it('renders a link to the home page', () => {
    const link = screen.getByText('Go Home').closest('a');
    expect(link).toHaveAttribute('href', '/');
  });
});
