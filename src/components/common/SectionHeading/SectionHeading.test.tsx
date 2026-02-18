import { render, screen } from 'test-utils';
import SectionHeading from './index';

describe('SectionHeading', () => {
  it('renders the title text', () => {
    render(<SectionHeading title="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders the subtitle when provided', () => {
    render(<SectionHeading title="Hello" subtitle="World" />);
    expect(screen.getByText('World')).toBeInTheDocument();
  });

  it('does not render subtitle when omitted', () => {
    render(<SectionHeading title="Hello" />);
    expect(screen.queryByText('World')).not.toBeInTheDocument();
  });
});
