import TeacherLayout from '@/views/Teacher/TeacherLayout';

export default function TeacherRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeacherLayout>{children}</TeacherLayout>;
}
