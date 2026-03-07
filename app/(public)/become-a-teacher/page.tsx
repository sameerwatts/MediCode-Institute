import type { Metadata } from 'next';
import BecomeATeacher from '@/views/BecomeATeacher';

export const metadata: Metadata = {
  title: 'Become a Teacher | MediCode Institute',
  description:
    'Share your expertise and teach thousands of students at MediCode Institute. Apply to join our faculty today.',
};

export default function BecomeATeacherPage() {
  return <BecomeATeacher />;
}
