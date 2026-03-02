'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { validateInviteToken } from '@/services/authService';
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

const INVITE_ERROR_MESSAGES: Record<string, { title: string; detail: string }> = {
  expired: {
    title: 'Invite Link Expired',
    detail:
      'This invite link has expired. Please ask your admin to resend the invite.',
  },
  used: {
    title: 'Invite Link Already Used',
    detail:
      'This invite link has already been used. An account was created with this link.',
  },
  invalid: {
    title: 'Invalid Invite Link',
    detail: 'This invite link is not valid. Please check the link in your email.',
  },
};

const Signup: React.FC = () => {
  const { signup, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('invite');

  const [tokenState, setTokenState] = useState<'none' | 'validating' | 'valid' | 'error'>(
    inviteToken ? 'validating' : 'none',
  );
  const [inviteData, setInviteData] = useState<{ name: string; email: string } | null>(null);
  const [inviteErrorReason, setInviteErrorReason] = useState('invalid');
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  // Validate invite token on mount if present
  useEffect(() => {
    if (!inviteToken) return;
    validateInviteToken(inviteToken).then((result) => {
      if (result.valid && result.name && result.email) {
        setInviteData({ name: result.name, email: result.email });
        setTokenState('valid');
      } else {
        setInviteErrorReason(result.reason ?? 'invalid');
        setTokenState('error');
      }
    });
  }, [inviteToken]);

  // Pre-fill form once invite data arrives
  useEffect(() => {
    if (inviteData) {
      reset({ name: inviteData.name, email: inviteData.email, password: '', confirmPassword: '' });
    }
  }, [inviteData, reset]);

  // Redirect already-authenticated users away
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || isAuthenticated || tokenState === 'validating') return <Loader />;

  // Invalid / expired / used invite — show inline error card, no form
  if (tokenState === 'error') {
    const errorInfo = INVITE_ERROR_MESSAGES[inviteErrorReason] ?? INVITE_ERROR_MESSAGES.invalid;
    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-error"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
          <h1 className="text-h3 font-bold text-dark mb-2">{errorInfo.title}</h1>
          <p className="text-sm-text text-dark-gray mb-6">{errorInfo.detail}</p>
          <Link
            href="/application-status"
            className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg text-sm-text hover:bg-primary-dark transition-colors"
          >
            Check Application Status
          </Link>
        </div>
      </div>
    );
  }

  const isInviteFlow = tokenState === 'valid';

  const onSubmit = async (data: SignupFormValues) => {
    setServerError('');
    setIsSubmitting(true);
    try {
      if (isInviteFlow) {
        await signup(data.name, data.email, data.password, inviteToken!);
      } else {
        await signup(data.name, data.email, data.password);
      }
      router.push(isInviteFlow ? '/teacher/onboarding' : '/');
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
          {isInviteFlow ? 'Complete Your Registration' : 'Create Account'}
        </h1>
        <p className="text-sm-text text-dark-gray text-center mb-8">
          {isInviteFlow
            ? 'You have been invited to join MediCode Institute as a teacher.'
            : 'Join MediCode Institute today'}
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
            registration={{ ...register('name'), readOnly: isInviteFlow }}
          />
          <FormInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            registration={{ ...register('email'), readOnly: isInviteFlow }}
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

        {!isInviteFlow && (
          <p className="text-center text-sm-text text-dark-gray mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;
