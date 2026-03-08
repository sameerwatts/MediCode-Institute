'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const OAUTH_ERRORS: Record<string, string> = {
  oauth_failed: 'Google sign-in failed. Please try again.',
  oauth_state_error: 'Google sign-in session expired or was tampered with. Please try again.',
  oauth_exchange_failed: 'Google sign-in failed. Please try again.',
  oauth_role_error: 'Google sign-in is only available for student accounts.',
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
);

const Login: React.FC = () => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error && OAUTH_ERRORS[error]) {
      setServerError(OAUTH_ERRORS[error]);
    }
  }, [searchParams]);

  if (isLoading || isAuthenticated) return <Loader />;

  const onSubmit = async (data: LoginFormValues) => {
    setServerError('');
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      router.push('/');
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Login failed. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-h2 font-extrabold text-dark mb-2 text-center">
          Welcome Back
        </h1>
        <p className="text-sm-text text-dark-gray text-center mb-8">
          Sign in to your MediCode account
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
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            showToggle
            registration={register('password')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full mt-2"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">or</span>
          </div>
        </div>

        {/* Google sign-in */}
        <button
          type="button"
          onClick={() => { window.location.href = '/api/auth/google'; }}
          className="w-full inline-flex items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-8 py-4 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all duration-200"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="text-center text-sm-text text-dark-gray mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
