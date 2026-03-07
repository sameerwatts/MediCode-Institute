import type { Metadata } from 'next';
import StudentDetail from '@/views/Admin/StudentDetail';

export const metadata: Metadata = { title: 'Student Detail | MediCode Admin' };

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StudentDetail id={id} />;
}
