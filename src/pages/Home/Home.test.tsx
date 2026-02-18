import { render, screen } from 'test-utils';
import Home from './index';

describe('Home', () => {
  beforeEach(() => {
    render(<Home />);
  });

  it('renders the HeroSection with headline', () => {
    expect(screen.getByText('Bridge Medicine & Technology')).toBeInTheDocument();
  });

  it('renders the hero CTA button', () => {
    expect(screen.getByText('Explore Courses')).toBeInTheDocument();
  });

  it('renders the FeaturesSection with all 4 features', () => {
    expect(screen.getByText('Expert Faculty')).toBeInTheDocument();
    expect(screen.getByText('Interactive Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Flexible Learning')).toBeInTheDocument();
    expect(screen.getByText('Dual Curriculum')).toBeInTheDocument();
  });

  it('renders the Popular Courses section heading', () => {
    expect(screen.getByText('Popular Courses')).toBeInTheDocument();
  });

  it('renders exactly 3 popular course cards', () => {
    expect(screen.getByText('Complete Human Anatomy')).toBeInTheDocument();
    expect(screen.getByText('Clinical Cardiology Essentials')).toBeInTheDocument();
    expect(screen.getByText('Pharmacology Made Easy')).toBeInTheDocument();
  });

  it('renders the Explore Categories section', () => {
    expect(screen.getByText('Medical Sciences')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
  });

  it('renders the StatsSection with stat values', () => {
    expect(screen.getByText('10,000+')).toBeInTheDocument();
    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText('20+')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('renders the CTA section', () => {
    expect(screen.getByText('Start Your Learning Journey Today')).toBeInTheDocument();
  });

  it('renders the View All Courses link', () => {
    expect(screen.getByText('View All Courses')).toBeInTheDocument();
  });
});
