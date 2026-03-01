import type { Metadata } from 'next';
import ApplicationStatus from '@/views/ApplicationStatus';

export const metadata: Metadata = {
  title: 'Application Status | MediCode Institute',
  description:
    'Check the status of your teacher application at MediCode Institute.',
};

export default function ApplicationStatusPage() {
  return <ApplicationStatus />;
}
