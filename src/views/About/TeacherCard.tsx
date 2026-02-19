import React from 'react';
import Image from 'next/image';
import { ITeacher } from '@/types';

interface ITeacherCardProps {
  teacher: ITeacher;
}

const TeacherCard: React.FC<ITeacherCardProps> = ({ teacher }) => {
  const badgeColor = teacher.department === 'medical' ? 'bg-medical' : 'bg-cs';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden text-center px-6 py-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <Image
        src={teacher.avatar}
        alt={`${teacher.name} avatar`}
        width={96}
        height={96}
        className="rounded-full object-cover mx-auto mb-4"
      />
      <h4 className="text-h4 text-dark mb-1">{teacher.name}</h4>
      <p className="text-sm-text text-dark-gray mb-2">{teacher.designation}</p>
      <span className={`inline-block px-4 py-1 text-xs-text font-semibold text-white ${badgeColor} rounded-full mb-2 uppercase tracking-wide`}>
        {teacher.department === 'medical' ? 'Medical' : 'Computer Science'}
      </span>
      <p className="text-sm-text text-gray leading-normal">{teacher.bio}</p>
    </div>
  );
};

export default TeacherCard;
