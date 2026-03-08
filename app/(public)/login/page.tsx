import { Suspense } from 'react';
import Login from '@/views/Login';
import Loader from '@/components/common/Loader';

export const metadata = {
  title: 'Sign In | MediCode Institute',
  description: 'Sign in to your MediCode Institute account.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Login />
    </Suspense>
  );
}
