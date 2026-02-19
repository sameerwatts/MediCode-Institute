import React from 'react';
import { quizzes } from '@/data/quizzes';
import { IQuiz } from '@/types';
import SectionHeading from '@/components/common/SectionHeading';
import Button from '@/components/common/Button';
import { truncateText } from '@/utils/helpers';

const CATEGORY_COLORS: Record<IQuiz['category'], string> = {
  medical: 'bg-medical',
  cs: 'bg-cs',
};

const CATEGORY_LABELS: Record<IQuiz['category'], string> = {
  medical: 'Medical',
  cs: 'CS',
};

const DIFFICULTY_COLORS: Record<IQuiz['difficulty'], string> = {
  Easy: 'bg-success',
  Medium: 'bg-warning',
  Hard: 'bg-error',
};

const DESCRIPTION_MAX_LENGTH = 80;

interface IQuizCardProps {
  quiz: IQuiz;
}

const QuizCard: React.FC<IQuizCardProps> = ({ quiz }) => (
  <div className="bg-white rounded-lg border border-light-gray p-6 flex flex-col gap-3 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
    <div className="flex gap-2 flex-wrap">
      <span className={`inline-block px-3 py-1 rounded-full text-xs-text font-semibold text-white ${CATEGORY_COLORS[quiz.category]}`}>
        {CATEGORY_LABELS[quiz.category]}
      </span>
      <span className={`inline-block px-3 py-1 rounded-full text-xs-text font-semibold text-white ${DIFFICULTY_COLORS[quiz.difficulty]}`}>
        {quiz.difficulty}
      </span>
    </div>

    <h3 className="text-h4 font-semibold text-dark">{quiz.title}</h3>

    <p className="text-sm-text text-dark-gray leading-normal">
      {truncateText(quiz.description, DESCRIPTION_MAX_LENGTH)}
    </p>

    <div className="flex items-center gap-4 text-sm-text text-gray mt-auto pt-2">
      <span>{quiz.questionsCount} questions</span>
      <span>{quiz.duration}</span>
    </div>

    <div className="pt-2">
      <Button>Start Quiz</Button>
    </div>
  </div>
);

const Quiz: React.FC = () => (
  <section className="py-8 pb-12 max-w-[1200px] mx-auto px-4">
    <SectionHeading
      title="Practice Quizzes"
      subtitle="Test your knowledge with our interactive quizzes"
    />

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  </section>
);

export default Quiz;
