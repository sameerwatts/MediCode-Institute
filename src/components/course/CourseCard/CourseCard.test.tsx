import React from 'react';
import { render, screen } from '@/test-utils';
import CourseCard from './index';
import { ICourse } from '@/types';

const mockTeacher = {
  id: 't1',
  name: 'Dr. Test Teacher',
  designation: 'Professor',
  department: 'medical' as const,
  bio: 'Test bio',
  avatar: 'https://example.com/avatar.jpg',
};

const mockCourse: ICourse = {
  id: 'c1',
  title: 'Test Course Title',
  description: 'Test description',
  category: 'medical',
  thumbnail: 'https://example.com/thumb.jpg',
  teacher: mockTeacher,
  price: 2999,
  originalPrice: 5999,
  duration: '40 hours',
  lessonsCount: 48,
  studentsEnrolled: 1240,
  rating: 4.8,
  level: 'Beginner',
};

describe('CourseCard', () => {
  beforeEach(() => {
    render(<CourseCard course={mockCourse} />);
  });

  it('displays the course title', () => {
    expect(screen.getByText('Test Course Title')).toBeInTheDocument();
  });

  it('displays the teacher name', () => {
    expect(screen.getByText('Dr. Test Teacher')).toBeInTheDocument();
  });

  it('displays the course thumbnail with correct alt text', () => {
    const img = screen.getByAltText('Test Course Title');
    expect(img).toHaveAttribute('src', 'https://example.com/thumb.jpg');
  });

  it('displays the teacher avatar with correct alt text', () => {
    const img = screen.getByAltText('Dr. Test Teacher');
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('displays the category badge text', () => {
    expect(screen.getByText('Medical')).toBeInTheDocument();
  });

  it('displays the formatted price in INR', () => {
    expect(screen.getByText(/2,999/)).toBeInTheDocument();
  });

  it('displays the original price', () => {
    expect(screen.getByText(/5,999/)).toBeInTheDocument();
  });

  it('displays course meta information', () => {
    expect(screen.getByText('40 hours')).toBeInTheDocument();
    expect(screen.getByText('48 lessons')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
  });
});
