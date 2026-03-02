import type { Metadata } from 'next';
import TeacherRequests from '@/views/Admin/TeacherRequests';

export const metadata: Metadata = {
  title: 'Teacher Requests | MediCode Admin',
};

export default function TeacherRequestsPage() {
  return <TeacherRequests />;
}
