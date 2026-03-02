import TeacherRequestDetail from '@/views/Admin/TeacherRequestDetail';

interface IPageProps {
  params: Promise<{ id: string }>;
}

export default async function TeacherRequestDetailPage({ params }: IPageProps) {
  const { id } = await params;
  return <TeacherRequestDetail id={id} />;
}
