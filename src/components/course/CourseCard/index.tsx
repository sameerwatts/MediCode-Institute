import React from 'react';
import { ICourse } from '@/types';
import { formatPrice } from '@/utils/helpers';

interface ICourseCardProps {
  course: ICourse;
}

const CourseCard: React.FC<ICourseCardProps> = ({ course }) => {
  const badgeColor = course.category === 'medical' ? 'bg-medical' : 'bg-cs';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <img src={course.thumbnail} alt={course.title} className="w-full h-[180px] object-cover" />
        <span className={`absolute top-2 left-2 px-2 py-1 ${badgeColor} text-white text-xs-text font-semibold rounded-sm uppercase`}>
          {course.category === 'medical' ? 'Medical' : 'CS'}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-body font-semibold text-dark mb-2">{course.title}</h3>

        <div className="flex items-center gap-2 mb-4">
          <img src={course.teacher.avatar} alt={course.teacher.name} className="w-7 h-7 rounded-full" />
          <span className="text-sm-text text-dark-gray">{course.teacher.name}</span>
        </div>

        <div className="flex justify-between items-center text-sm-text text-gray mb-4">
          <span>{course.duration}</span>
          <span>{course.lessonsCount} lessons</span>
          <span>{course.level}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-h4 font-bold text-primary">{formatPrice(course.price)}</span>
          <span className="text-sm-text text-gray line-through">{formatPrice(course.originalPrice)}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
