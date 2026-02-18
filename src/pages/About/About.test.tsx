import { render, screen } from 'test-utils';
import About from './index';

describe('About', () => {
  beforeEach(() => {
    render(<About />);
  });

  it('renders the page heading', () => {
    expect(screen.getByText('About MediCode Institute')).toBeInTheDocument();
  });

  it('renders the Mission section', () => {
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
    expect(screen.getByText(/bridge the gap/)).toBeInTheDocument();
  });

  it('renders the Vision section', () => {
    expect(screen.getByText('Our Vision')).toBeInTheDocument();
  });

  it('renders the What We Offer section with all 4 offerings', () => {
    expect(screen.getByText('Medical Courses')).toBeInTheDocument();
    expect(screen.getByText('CS Courses')).toBeInTheDocument();
    expect(screen.getByText('Interactive Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Live Sessions')).toBeInTheDocument();
  });

  it('renders all 4 teacher cards', () => {
    expect(screen.getByText('Dr. Priya Sharma')).toBeInTheDocument();
    expect(screen.getByText('Dr. Rajesh Verma')).toBeInTheDocument();
    expect(screen.getByText('Ankit Patel')).toBeInTheDocument();
    expect(screen.getByText('Sneha Gupta')).toBeInTheDocument();
  });

  it('renders the contact section', () => {
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(screen.getByText('contact@medicode.in')).toBeInTheDocument();
  });
});
