import React from 'react';
import { quizzes } from 'data/quizzes';
import { IQuiz } from 'types';
import PageWrapper from 'components/layout/PageWrapper';
import SectionHeading from 'components/common/SectionHeading';
import Button from 'components/common/Button';
import { truncateText } from 'utils/helpers';
import {
  StyledQuizPage,
  StyledQuizGrid,
  StyledQuizCard,
  StyledBadgeRow,
  StyledBadge,
  StyledQuizTitle,
  StyledQuizDescription,
  StyledQuizMeta,
  StyledMetaItem,
  StyledCardFooter,
} from './styles';

const CATEGORY_COLORS: Record<IQuiz['category'], string> = {
  medical: '#7C3AED',
  cs: '#2563EB',
};

const CATEGORY_LABELS: Record<IQuiz['category'], string> = {
  medical: 'Medical',
  cs: 'CS',
};

const DIFFICULTY_COLORS: Record<IQuiz['difficulty'], string> = {
  Easy: '#22C55E',
  Medium: '#F59E0B',
  Hard: '#EF4444',
};

const DESCRIPTION_MAX_LENGTH = 80;

interface IQuizCardProps {
  quiz: IQuiz;
}

const QuizCard: React.FC<IQuizCardProps> = ({ quiz }) => (
  <StyledQuizCard>
    <StyledBadgeRow>
      <StyledBadge $color={CATEGORY_COLORS[quiz.category]}>
        {CATEGORY_LABELS[quiz.category]}
      </StyledBadge>
      <StyledBadge $color={DIFFICULTY_COLORS[quiz.difficulty]}>
        {quiz.difficulty}
      </StyledBadge>
    </StyledBadgeRow>

    <StyledQuizTitle>{quiz.title}</StyledQuizTitle>

    <StyledQuizDescription>
      {truncateText(quiz.description, DESCRIPTION_MAX_LENGTH)}
    </StyledQuizDescription>

    <StyledQuizMeta>
      <StyledMetaItem>{quiz.questionsCount} questions</StyledMetaItem>
      <StyledMetaItem>{quiz.duration}</StyledMetaItem>
    </StyledQuizMeta>

    <StyledCardFooter>
      <Button>Start Quiz</Button>
    </StyledCardFooter>
  </StyledQuizCard>
);

const Quiz: React.FC = () => (
  <PageWrapper>
    <StyledQuizPage>
      <SectionHeading
        title="Practice Quizzes"
        subtitle="Test your knowledge with our interactive quizzes"
      />

      <StyledQuizGrid>
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </StyledQuizGrid>
    </StyledQuizPage>
  </PageWrapper>
);

export default Quiz;
