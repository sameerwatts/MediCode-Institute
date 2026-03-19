"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import FormInput from "@/components/common/FormInput";
import FormTextarea from "@/components/common/FormTextarea";
import FormRadioGroup from "@/components/common/FormRadioGroup";
import Button from "@/components/common/Button";
import { createCourse } from "@/services/teacherCourseService";

const courseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be under 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  category: z.enum(["medical", "cs"], {
    message: "Please select a category",
  }),
  thumbnail_url: z
    .string()
    .url("Enter a valid URL")
    .max(500, "URL too long")
    .or(z.literal("")),
});

type CourseFormValues = z.infer<typeof courseSchema>;

const categoryOptions = [
  { label: "Medical Sciences", value: "medical" },
  { label: "Computer Science", value: "cs" },
];

const CourseForm: React.FC = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
      thumbnail_url: "",
    },
  });

  const onSubmit = async (data: CourseFormValues) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      const result = await createCourse({
        title: data.title,
        description: data.description,
        category: data.category,
        thumbnail_url: data.thumbnail_url || undefined,
      });
      router.push(`/teacher/courses/${result.id}`);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Failed to create course."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-h3 font-bold text-dark">Create New Course</h1>
        <p className="text-sm-text text-dark-gray mt-1">
          Fill in the details below to create a new draft course.
        </p>
      </div>

      <div className="max-w-2xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl border border-light-gray p-6 space-y-5"
        >
          {serverError && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm-text">
              {serverError}
            </div>
          )}

          <FormInput
            label="Course Title"
            placeholder="e.g. Introduction to Human Anatomy"
            error={errors.title?.message}
            {...register("title")}
          />

          <FormTextarea
            label="Description"
            placeholder="Describe what students will learn in this course..."
            rows={4}
            error={errors.description?.message}
            {...register("description")}
          />

          <FormRadioGroup
            label="Category"
            options={categoryOptions}
            error={errors.category?.message}
            {...register("category")}
          />

          <FormInput
            label="Thumbnail URL (optional)"
            placeholder="https://example.com/image.png"
            error={errors.thumbnail_url?.message}
            {...register("thumbnail_url")}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Course"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => router.push("/teacher/courses")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
