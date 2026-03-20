import React from 'react';
import { render, screen, fireEvent } from '@/test-utils';
import TopicAccordion from './index';
import { ITopicDetail } from '@/types';

const mockTopics: ITopicDetail[] = [
  {
    id: 't1',
    title: 'Introduction to Anatomy',
    order: 1,
    subtopics: [
      { id: 's1', title: 'Cell Structure', order: 1 },
      { id: 's2', title: 'Tissue Types', order: 2 },
    ],
  },
  {
    id: 't2',
    title: 'Cardiovascular System',
    order: 2,
    subtopics: [
      { id: 's3', title: 'Heart Anatomy', order: 1 },
    ],
  },
];

describe('TopicAccordion', () => {
  it('renders empty message when no topics', () => {
    render(
      <TopicAccordion topics={[]} courseSlug="test-course" isEnrolled={false} />
    );
    expect(
      screen.getByText('No content has been added to this course yet.')
    ).toBeInTheDocument();
  });

  it('renders all topic titles', () => {
    render(
      <TopicAccordion
        topics={mockTopics}
        courseSlug="test-course"
        isEnrolled={false}
      />
    );
    expect(screen.getByText('1. Introduction to Anatomy')).toBeInTheDocument();
    expect(screen.getByText('2. Cardiovascular System')).toBeInTheDocument();
  });

  it('shows lesson count for each topic', () => {
    render(
      <TopicAccordion
        topics={mockTopics}
        courseSlug="test-course"
        isEnrolled={false}
      />
    );
    expect(screen.getByText('2 lessons')).toBeInTheDocument();
    expect(screen.getByText('1 lesson')).toBeInTheDocument();
  });

  it('opens the first topic by default', () => {
    render(
      <TopicAccordion
        topics={mockTopics}
        courseSlug="test-course"
        isEnrolled={false}
      />
    );
    expect(screen.getByText('1.1 Cell Structure')).toBeInTheDocument();
    expect(screen.getByText('1.2 Tissue Types')).toBeInTheDocument();
  });

  it('does not show subtopics for collapsed topics', () => {
    render(
      <TopicAccordion
        topics={mockTopics}
        courseSlug="test-course"
        isEnrolled={false}
      />
    );
    expect(screen.queryByText('2.1 Heart Anatomy')).not.toBeInTheDocument();
  });

  it('toggles a topic open and closed', () => {
    render(
      <TopicAccordion
        topics={mockTopics}
        courseSlug="test-course"
        isEnrolled={false}
      />
    );

    // Click second topic to open it
    fireEvent.click(screen.getByText('2. Cardiovascular System'));
    expect(screen.getByText('2.1 Heart Anatomy')).toBeInTheDocument();

    // First topic should now be closed
    expect(screen.queryByText('1.1 Cell Structure')).not.toBeInTheDocument();

    // Click second topic again to close it
    fireEvent.click(screen.getByText('2. Cardiovascular System'));
    expect(screen.queryByText('2.1 Heart Anatomy')).not.toBeInTheDocument();
  });

  it('shows "Locked" for subtopics when not enrolled', () => {
    render(
      <TopicAccordion
        topics={mockTopics}
        courseSlug="test-course"
        isEnrolled={false}
      />
    );
    const lockedLabels = screen.getAllByText('Locked');
    expect(lockedLabels).toHaveLength(2);
  });

  it('shows "Read" links for subtopics when enrolled', () => {
    render(
      <TopicAccordion
        topics={mockTopics}
        courseSlug="test-course"
        isEnrolled={true}
      />
    );
    const readLinks = screen.getAllByText('Read');
    expect(readLinks).toHaveLength(2);
    expect(readLinks[0].closest('a')).toHaveAttribute(
      'href',
      '/courses/test-course/learn/s1'
    );
    expect(readLinks[1].closest('a')).toHaveAttribute(
      'href',
      '/courses/test-course/learn/s2'
    );
  });
});
