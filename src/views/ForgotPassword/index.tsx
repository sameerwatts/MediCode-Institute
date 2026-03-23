'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import { forgotPassword } from '@/services/authService';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Enter a valid email address' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setServerError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    try {
      const res = await forgotPassword(data.email);
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
          Forgot Password
        </h1>
        <p className="text-sm-text text-dark-gray text-center mb-8">
          Enter your email and we&apos;ll send you a reset link
        </p>

        {serverError && (
          <div
            role="alert"
            className="bg-red-50 border border-error rounded-md px-4 py-3 mb-6 text-error text-sm-text"
          >
            {serverError}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="bg-green-50 border border-green-300 rounded-md px-4 py-3 mb-6 text-green-700 text-sm-text"
          >
            {successMessage}
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full mt-2"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;
