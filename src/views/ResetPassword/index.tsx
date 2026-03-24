'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import { resetPassword } from '@/services/authService';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, router]);

  if (!token) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-h2 font-extrabold text-dark mb-4">
            Invalid Reset Link
          </h1>
          <p className="text-sm-text text-dark-gray mb-6">
            This password reset link is invalid or missing. Please request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="text-primary font-semibold hover:underline"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setServerError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    try {
      const res = await resetPassword(token, data.password);
      setSuccessMessage(res.message);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-h2 font-extrabold text-dark mb-2 text-center">
          Set New Password
        </h1>
        <p className="text-sm-text text-dark-gray text-center mb-8">
          Enter your new password below
        </p>

        {serverError && (
          <div
            role="alert"
            className="bg-red-50 border border-error rounded-md px-4 py-3 mb-6 text-error text-sm-text"
          >
            {serverError}
            {(serverError.includes('expired') || serverError.includes('already been used')) && (
              <p className="mt-2">
                <Link
                  href="/forgot-password"
                  className="text-primary font-semibold hover:underline"
                >
                  Request a new reset link
                </Link>
              </p>
            )}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="bg-green-50 border border-green-300 rounded-md px-4 py-3 mb-6 text-green-700 text-sm-text"
          >
            {successMessage} Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormInput
            id="password"
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            error={errors.password?.message}
            showToggle
            registration={register('password')}
          />
          <FormInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your new password"
            error={errors.confirmPassword?.message}
            showToggle
            registration={register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting || !!successMessage}
            className="w-full mt-2"
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>

        <p className="text-center text-sm-text text-dark-gray mt-6">
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
