import React from 'react';
import { render, screen } from '@/test-utils';
import Quiz from './index';

describe('Quiz', () => {
  beforeEach(() => {
    render(<Quiz />);
  });

  it('renders the page heading', () => {
    expect(screen.getByText('Practice Quizzes')).toBeInTheDocument();
  });

  it('renders all 4 quiz cards with their titles', () => {
    expect(screen.getByText('Human Anatomy Basics')).toBeInTheDocument();
    expect(screen.getByText('Pharmacology Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Data Structures Challenge')).toBeInTheDocument();
  });

  it('renders category badges', () => {
    const medicalBadges = screen.getAllByText('Medical');
    const csBadges = screen.getAllByText('CS');
    expect(medicalBadges.length).toBe(2);
    expect(csBadges.length).toBe(2);
  });

  it('renders difficulty badges', () => {
    expect(screen.getAllByText('Easy').length).toBe(2);
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  it('renders quiz meta info', () => {
    const questionCounts = screen.getAllByText('5 questions');
    expect(questionCounts.length).toBe(4);
    expect(screen.getAllByText('10 min').length).toBe(3);
    expect(screen.getByText('15 min')).toBeInTheDocument();
  });

  it('renders Start Quiz buttons', () => {
    const buttons = screen.getAllByText('Start Quiz');
    expect(buttons.length).toBe(4);
  });
});
