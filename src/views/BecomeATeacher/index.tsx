'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import FormInput from '@/components/common/FormInput';
import FormTextarea from '@/components/common/FormTextarea';
import FormRadioGroup from '@/components/common/FormRadioGroup';
import Button from '@/components/common/Button';
import { submitApplication } from '@/services/applicationService';

const applicationSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  phone: z
    .string()
    .min(7, 'Enter a valid phone number')
    .max(20, 'Phone number too long'),
  subject_area: z.enum(['medical', 'cs'], {
    message: 'Please select a subject area',
  }),
  qualifications: z
    .string()
    .min(10, 'Please describe your qualifications (min 10 characters)'),
  experience_years: z
    .string()
    .min(1, 'Experience is required')
    .refine(
      (v) =>
        !isNaN(Number(v)) &&
        Number.isInteger(Number(v)) &&
        Number(v) >= 0 &&
        Number(v) <= 50,
      { message: 'Please enter a valid whole number (0–50)' },
    ),
  teaching_philosophy: z
    .string()
    .min(20, 'Please describe your teaching philosophy (min 20 characters)'),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

const subjectOptions = [
  { label: 'Medical Sciences', value: 'medical' },
  { label: 'Computer Science', value: 'cs' },
];

const BecomeATeacher: React.FC = () => {
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = async (data: ApplicationFormValues) => {
    setServerError('');
    setIsSubmitting(true);
    try {
      const res = await submitApplication({
        ...data,
        experience_years: parseInt(data.experience_years, 10),
      });
      setApplicationId(res.id);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Submission failed. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (applicationId) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-success text-h2 font-bold">&#10003;</span>
          </div>
          <h2 className="text-h2 font-extrabold text-dark mb-3">Application Submitted!</h2>
          <p className="text-body text-dark-gray mb-6 leading-relaxed">
            Thank you for applying to teach at MediCode Institute. We&apos;ll review your
            application and get back to you soon.
          </p>
          <div className="bg-light rounded-lg px-6 py-4 mb-6">
            <p className="text-sm-text text-dark-gray mb-1">Your application ID</p>
            <p className="font-mono font-semibold text-primary text-body">{applicationId}</p>
          </div>
          <p className="text-sm-text text-dark-gray mb-6">
            Save this ID to check your application status at any time.
          </p>
          <Link
            href="/application-status"
            className="text-primary font-semibold text-sm-text hover:underline"
          >
            Check application status
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen py-16 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-h2 font-extrabold text-dark mb-2">Become a Teacher</h1>
          <p className="text-body text-dark-gray mb-8 leading-relaxed">
            Share your expertise with thousands of students. Fill in the form below and
            our team will review your application within 3–5 business days.
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
              placeholder="Dr. Jane Smith"
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
              id="phone"
              label="Phone Number"
              type="text"
              placeholder="+91 98765 43210"
              error={errors.phone?.message}
              registration={register('phone')}
            />
            <FormRadioGroup
              name="subject_area"
              label="Subject Area"
              options={subjectOptions}
              error={errors.subject_area?.message}
              registration={register('subject_area')}
            />
            <FormInput
              id="experience_years"
              label="Years of Teaching Experience"
              type="text"
              placeholder="0"
              error={errors.experience_years?.message}
              registration={register('experience_years')}
            />
            <FormTextarea
              id="qualifications"
              label="Qualifications"
              placeholder="Describe your academic qualifications, certifications, and professional background..."
              error={errors.qualifications?.message}
              maxLength={1000}
              registration={register('qualifications')}
            />
            <FormTextarea
              id="teaching_philosophy"
              label="Teaching Philosophy"
              placeholder="Describe your approach to teaching, how you engage students, and what makes your classes effective..."
              error={errors.teaching_philosophy?.message}
              maxLength={1000}
              registration={register('teaching_philosophy')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeATeacher;
