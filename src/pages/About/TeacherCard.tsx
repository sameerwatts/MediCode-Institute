import React from 'react';
import { ITeacher } from 'types';
import {
  StyledTeacherCard,
  StyledAvatar,
  StyledTeacherName,
  StyledDesignation,
  StyledDeptBadge,
  StyledBio,
} from './styles';

interface ITeacherCardProps {
  teacher: ITeacher;
}

const TeacherCard: React.FC<ITeacherCardProps> = ({ teacher }) => {
  return (
    <StyledTeacherCard>
      <StyledAvatar src={teacher.avatar} alt={`${teacher.name} avatar`} />
      <StyledTeacherName>{teacher.name}</StyledTeacherName>
      <StyledDesignation>{teacher.designation}</StyledDesignation>
      <StyledDeptBadge $dept={teacher.department}>
        {teacher.department === 'medical' ? 'Medical' : 'Computer Science'}
      </StyledDeptBadge>
      <StyledBio>{teacher.bio}</StyledBio>
    </StyledTeacherCard>
  );
};

export default TeacherCard;
