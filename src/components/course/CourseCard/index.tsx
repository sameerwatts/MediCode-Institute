import React from 'react';
import { ICourse } from 'types';
import { formatPrice } from 'utils/helpers';
import {
  StyledCourseCard,
  StyledThumbnail,
  StyledBadge,
  StyledCardBody,
  StyledTitle,
  StyledTeacher,
  StyledMeta,
  StyledPrice,
} from './styles';

interface ICourseCardProps {
  course: ICourse;
}

const CourseCard: React.FC<ICourseCardProps> = ({ course }) => {
  return (
    <StyledCourseCard>
      <StyledThumbnail>
        <img src={course.thumbnail} alt={course.title} />
        <StyledBadge $category={course.category}>
          {course.category === 'medical' ? 'Medical' : 'CS'}
        </StyledBadge>
      </StyledThumbnail>

      <StyledCardBody>
        <StyledTitle>{course.title}</StyledTitle>

        <StyledTeacher>
          <img src={course.teacher.avatar} alt={course.teacher.name} />
          <span>{course.teacher.name}</span>
        </StyledTeacher>

        <StyledMeta>
          <span>{course.duration}</span>
          <span>{course.lessonsCount} lessons</span>
          <span>{course.level}</span>
        </StyledMeta>

        <StyledPrice>
          <span className="current">{formatPrice(course.price)}</span>
          <span className="original">{formatPrice(course.originalPrice)}</span>
        </StyledPrice>
      </StyledCardBody>
    </StyledCourseCard>
  );
};

export default CourseCard;
