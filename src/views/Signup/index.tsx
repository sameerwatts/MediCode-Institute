'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';

const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(50, { message: 'Name must be under 50 characters' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const { signup, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || isAuthenticated) return <Loader />;

  const onSubmit = async (data: SignupFormValues) => {
    setServerError('');
    setIsSubmitting(true);
    try {
      await signup(data.name, data.email, data.password);
      router.push('/dashboard');
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Sign up failed. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-h2 font-extrabold text-dark mb-2 text-center">
          Create Account
        </h1>
        <p className="text-sm-text text-dark-gray text-center mb-8">
          Join MediCode Institute today
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
            id="name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            registration={register('name')}
          />
          <FormInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            registration={register('email')}
          />
          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            error={errors.password?.message}
            showToggle
            registration={register('password')}
          />
          <FormInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            error={errors.confirmPassword?.message}
            showToggle
            registration={register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full mt-2"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm-text text-dark-gray mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
