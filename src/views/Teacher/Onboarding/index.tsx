'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import FormInput from '@/components/common/FormInput';
import FormTextarea from '@/components/common/FormTextarea';
import FormRadioGroup from '@/components/common/FormRadioGroup';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import { submitOnboarding } from '@/services/teacherService';

const onboardingSchema = z.object({
  designation: z
    .string()
    .min(2, { message: 'Designation is required' })
    .max(100, { message: 'Designation must be under 100 characters' }),
  department: z.enum(['medical', 'cs'], {
    message: 'Please select a department',
  }),
  bio: z
    .string()
    .min(20, { message: 'Bio must be at least 20 characters' })
    .max(500, { message: 'Bio must be under 500 characters' }),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const departmentOptions = [
  { label: 'Medical Sciences', value: 'medical' },
  { label: 'Computer Science', value: 'cs' },
];

const TeacherOnboarding: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return <Loader />;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: OnboardingFormValues) => {
    setServerError('');
    setIsSubmitting(true);
    try {
      // photo_url will be set once Supabase Storage is wired up
      await submitOnboarding({
        bio: data.bio,
        designation: data.designation,
        department: data.department,
      });
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Failed to save profile. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-success"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-h2 font-extrabold text-dark mb-3">Profile Complete!</h2>
          <p className="text-body text-dark-gray mb-8 leading-relaxed">
            Your teacher profile has been saved. You&apos;re all set to start creating
            courses on MediCode Institute.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-lg text-sm-text hover:bg-primary-dark transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen py-16 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-h2 font-extrabold text-dark mb-2">Complete Your Profile</h1>
          <p className="text-body text-dark-gray mb-8 leading-relaxed">
            Tell students about yourself. This information will appear on your public
            teacher profile.
          </p>

          {/* Photo upload */}
          <div className="flex flex-col items-center mb-8">
            <button
              type="button"
              aria-label="Upload profile photo"
              onClick={() => fileInputRef.current?.click()}
              className="w-28 h-28 rounded-full border-2 border-dashed border-light-gray bg-light flex items-center justify-center overflow-hidden hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt="Profile photo preview"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <svg
                  className="w-10 h-10 text-gray"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              aria-label="Profile photo"
              className="sr-only"
              onChange={handlePhotoChange}
            />
            <p className="text-sm-text text-dark-gray mt-2">
              Click to upload a profile photo
            </p>
          </div>

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
              id="designation"
              label="Designation"
              type="text"
              placeholder="e.g. Senior Cardiologist, Data Scientist"
              error={errors.designation?.message}
              registration={register('designation')}
            />
            <FormRadioGroup
              name="department"
              label="Department"
              options={departmentOptions}
              error={errors.department?.message}
              registration={register('department')}
            />
            <FormTextarea
              id="bio"
              label="Bio"
              placeholder="Tell students about your background, expertise, and teaching style..."
              error={errors.bio?.message}
              maxLength={500}
              rows={5}
              registration={register('bio')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherOnboarding;
