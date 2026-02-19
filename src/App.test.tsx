import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders Navbar on every page', async () => {
    render(<App />);
    expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
  });

  it('renders Footer on every page', async () => {
    render(<App />);
    expect(screen.getByText(/MediCode Institute. All rights reserved/)).toBeInTheDocument();
  });

  it('renders Home page on "/" route', async () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(await screen.findByText('Bridge Medicine & Technology')).toBeInTheDocument();
  });

  it('renders Courses page on "/courses" route', async () => {
    window.history.pushState({}, '', '/courses');
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'All Courses' })).toBeInTheDocument();
  });

  it('renders About page on "/about" route', async () => {
    window.history.pushState({}, '', '/about');
    render(<App />);
    expect(await screen.findByText('About MediCode Institute')).toBeInTheDocument();
  });

  it('renders NotFound page on unknown route', async () => {
    window.history.pushState({}, '', '/nonexistent');
    render(<App />);
    expect(await screen.findByText('404')).toBeInTheDocument();
  });

  it('renders Quiz page on "/quiz" route', async () => {
    window.history.pushState({}, '', '/quiz');
    render(<App />);
    expect(await screen.findByText('Practice Quizzes')).toBeInTheDocument();
  });
});
