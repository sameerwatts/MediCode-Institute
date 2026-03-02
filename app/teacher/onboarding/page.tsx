import type { Metadata } from 'next';
import TeacherOnboarding from '@/views/Teacher/Onboarding';

export const metadata: Metadata = {
  title: 'Complete Your Profile | MediCode Institute',
};

export default function TeacherOnboardingPage() {
  return <TeacherOnboarding />;
}
