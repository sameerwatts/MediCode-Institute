'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import StatusBadge from '@/components/common/StatusBadge';
import { checkApplicationStatus } from '@/services/applicationService';
import { IApplicationStatusCheck, TApplicationStatus } from '@/types';

const statusCheckSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  application_id: z.string().min(1, 'Application ID is required'),
});

type StatusCheckFormValues = z.infer<typeof statusCheckSchema>;

const statusMessages: Record<TApplicationStatus, string> = {
  pending:
    "Your application is being reviewed by our team. We'll notify you via email once a decision has been made.",
  approved:
    'Your application has been approved! Please check your email for the invite link to complete your teacher signup.',
  rejected:
    'Unfortunately, your application was not approved at this time. You are welcome to apply again in the future.',
  registered:
    'Your teacher account is active. You can log in and access your teacher dashboard.',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const ApplicationStatus: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [serverError, setServerError] = useState('');
  const [result, setResult] = useState<IApplicationStatusCheck | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StatusCheckFormValues>({
    resolver: zodResolver(statusCheckSchema),
  });

  const onSubmit = async (data: StatusCheckFormValues) => {
    setServerError('');
    setResult(null);
    setIsChecking(true);
    try {
      const res = await checkApplicationStatus(data.email, data.application_id);
      setResult(res);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Failed to find application. Please check your details.',
      );
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-light min-h-screen py-16 px-4">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-h2 font-extrabold text-dark mb-2">
            Application Status
          </h1>
          <p className="text-body text-dark-gray mb-8 leading-relaxed">
            Enter your email and application ID to check the status of your
            teacher application.
          </p>

          {serverError && (
            <div
              role="alert"
              className="bg-red-50 border border-error rounded-md px-4 py-3 mb-6 text-error text-sm-text"
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              registration={register('email')}
            />
            <FormInput
              id="application_id"
              label="Application ID"
              type="text"
              placeholder="e.g. 3f2a1b4c-..."
              error={errors.application_id?.message}
              registration={register('application_id')}
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isChecking}
              className="w-full mt-2"
            >
              {isChecking ? 'Checking...' : 'Check Status'}
            </Button>
          </form>

          {result && (
            <div className="mt-8 border-t border-light-gray pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm-text font-semibold text-dark">
                  Status
                </span>
                <StatusBadge status={result.status} />
              </div>

              <p className="text-sm-text text-dark-gray mb-4 leading-relaxed">
                {statusMessages[result.status]}
              </p>

              <div className="space-y-2 text-sm-text text-dark-gray">
                <div className="flex justify-between">
                  <span>Submitted</span>
                  <span className="font-medium text-dark">
                    {formatDate(result.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Reviewed</span>
                  <span className="font-medium text-dark">
                    {result.reviewed_at ? formatDate(result.reviewed_at) : 'Pending review'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-sm-text text-dark-gray mt-8">
            Want to apply?{' '}
            <Link
              href="/become-a-teacher"
              className="text-primary font-semibold hover:underline"
            >
              Become a Teacher
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;
