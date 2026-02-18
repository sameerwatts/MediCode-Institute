import { render, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';
import Button from './index';

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    await userEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with all variant options without crashing', () => {
    const { unmount: u1 } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByText('Primary')).toBeInTheDocument();
    u1();

    const { unmount: u2 } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    u2();

    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByText('Outline')).toBeInTheDocument();
  });

  it('renders with all size options without crashing', () => {
    const { unmount: u1 } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText('Small')).toBeInTheDocument();
    u1();

    const { unmount: u2 } = render(<Button size="md">Medium</Button>);
    expect(screen.getByText('Medium')).toBeInTheDocument();
    u2();

    render(<Button size="lg">Large</Button>);
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('passes through disabled attribute', () => {
    render(<Button disabled>Go</Button>);
    expect(screen.getByRole('button', { name: 'Go' })).toBeDisabled();
  });

  it('passes through type attribute', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit');
  });
});
