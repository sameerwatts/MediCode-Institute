import { render, screen } from 'test-utils';
import Card from './index';

describe('Card', () => {
  it('renders children content', () => {
    render(<Card><p>Hello</p></Card>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders an image when image prop is provided', () => {
    render(<Card image="test.jpg" imageAlt="Test image">Content</Card>);
    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test.jpg');
  });

  it('does not render an image when image prop is omitted', () => {
    render(<Card>Content</Card>);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('defaults imageAlt to empty string when not provided', () => {
    const { container } = render(<Card image="test.jpg">Content</Card>);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', '');
  });
});
