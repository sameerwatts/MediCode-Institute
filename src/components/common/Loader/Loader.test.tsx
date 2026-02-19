import React from 'react';
import { render } from '@/test-utils';
import Loader from './index';

describe('Loader', () => {
  it('renders without crashing', () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('contains a spinner element', () => {
    const { container } = render(<Loader />);
    expect(container.querySelectorAll('div').length).toBeGreaterThanOrEqual(1);
  });
});
