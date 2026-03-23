import { Suspense } from 'react';
import ResetPassword from '@/views/ResetPassword';
import Loader from '@/components/common/Loader';

export const metadata = {
  title: 'Reset Password | MediCode Institute',
  description: 'Set a new password for your MediCode Institute account.',
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ResetPassword />
    </Suspense>
  );
}
