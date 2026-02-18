import { render, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';
import Blog from './index';

describe('Blog', () => {
  beforeEach(() => {
    render(<Blog />);
  });

  it('renders the page heading', () => {
    expect(screen.getByText('Blog & Articles')).toBeInTheDocument();
  });

  it('renders all filter tabs', () => {
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Medical')).toBeInTheDocument();
    expect(screen.getByText('CS')).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
  });

  it('shows all 5 blog cards by default', () => {
    expect(screen.getByText('How to Prepare for NEET PG 2026: A Complete Guide')).toBeInTheDocument();
    expect(screen.getByText(/Understanding ECG/)).toBeInTheDocument();
    expect(screen.getByText("React 19: What's New and How to Migrate")).toBeInTheDocument();
    expect(screen.getByText('Top 10 DSA Patterns for Coding Interviews')).toBeInTheDocument();
    expect(screen.getByText('Why Every Medical Student Should Learn to Code')).toBeInTheDocument();
  });

  it('displays blog author and read time', () => {
    expect(screen.getByText('Dr. Priya Sharma')).toBeInTheDocument();
    expect(screen.getByText('8 min read')).toBeInTheDocument();
  });

  it('displays formatted dates', () => {
    expect(screen.getByText(/15 January 2026|January 15, 2026/)).toBeInTheDocument();
  });

  it('filters to medical blogs when Medical tab is clicked', async () => {
    await userEvent.click(screen.getByText('Medical'));
    expect(screen.getByText('How to Prepare for NEET PG 2026: A Complete Guide')).toBeInTheDocument();
    expect(screen.getByText(/Understanding ECG/)).toBeInTheDocument();
    expect(screen.queryByText("React 19: What's New and How to Migrate")).not.toBeInTheDocument();
  });

  it('filters to CS blogs when CS tab is clicked', async () => {
    await userEvent.click(screen.getByText('CS'));
    expect(screen.getByText("React 19: What's New and How to Migrate")).toBeInTheDocument();
    expect(screen.getByText('Top 10 DSA Patterns for Coding Interviews')).toBeInTheDocument();
    expect(screen.queryByText('How to Prepare for NEET PG 2026: A Complete Guide')).not.toBeInTheDocument();
  });

  it('filters to general blogs when General tab is clicked', async () => {
    await userEvent.click(screen.getByText('General'));
    expect(screen.getByText(/Why Every Medical Student Should Learn to Code/)).toBeInTheDocument();
    expect(screen.queryByText('How to Prepare for NEET PG 2026: A Complete Guide')).not.toBeInTheDocument();
  });

  it('renders Read More link for each blog', () => {
    const readMoreLinks = screen.getAllByText(/Read More/);
    expect(readMoreLinks.length).toBe(5);
  });
});
