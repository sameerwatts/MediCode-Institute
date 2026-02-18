import { render, screen } from 'test-utils';
import PageWrapper from './index';

describe('PageWrapper', () => {
  it('renders children content', () => {
    render(<PageWrapper><p>Child content</p></PageWrapper>);
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});
