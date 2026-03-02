import { Suspense } from 'react';
import type { Metadata } from 'next';
import Signup from '@/views/Signup';
import Loader from '@/components/common/Loader';

export const metadata: Metadata = {
  title: 'Sign Up | MediCode Institute',
  description: 'Create your MediCode Institute account.',
};

export default function SignupPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Signup />
    </Suspense>
  );
}
