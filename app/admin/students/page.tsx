import type { Metadata } from 'next';
import StudentsList from '@/views/Admin/StudentsList';

export const metadata: Metadata = {
  title: 'Students | MediCode Admin',
};

export default function StudentsPage() {
  return <StudentsList />;
}
