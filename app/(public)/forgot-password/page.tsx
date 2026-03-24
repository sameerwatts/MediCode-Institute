import { Suspense } from 'react';
import ForgotPassword from '@/views/ForgotPassword';
import Loader from '@/components/common/Loader';

export const metadata = {
  title: 'Forgot Password | MediCode Institute',
  description: 'Reset your MediCode Institute account password.',
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ForgotPassword />
    </Suspense>
  );
}
