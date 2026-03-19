"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import FormInput from "@/components/common/FormInput";
import FormTextarea from "@/components/common/FormTextarea";
import FormRadioGroup from "@/components/common/FormRadioGroup";
import Button from "@/components/common/Button";
import {
  createCourse,
  getCourseDetail,
  updateCourse,
  publishCourse,
  unpublishCourse,
} from "@/services/teacherCourseService";
import { ICourseTeacherDetail } from "@/types";

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

interface ICourseFormProps {
  courseId?: string;
}

const CourseForm: React.FC<ICourseFormProps> = ({ courseId }) => {
  const router = useRouter();
  const isEditMode = Boolean(courseId);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [course, setCourse] = useState<ICourseTeacherDetail | null>(null);

  const {
    register,
    handleSubmit,
    reset,
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

  useEffect(() => {
    if (!courseId) return;

    const loadCourse = async () => {
      setIsLoading(true);
      try {
        const data = await getCourseDetail(courseId);
        setCourse(data);
        reset({
          title: data.title,
          description: data.description,
          category: data.category,
          thumbnail_url: data.thumbnail_url || "",
        });
      } catch (err) {
        setServerError(
          err instanceof Error ? err.message : "Failed to load course."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId, reset]);

  const onSubmit = async (data: CourseFormValues) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      if (isEditMode && courseId) {
        const result = await updateCourse(courseId, {
          title: data.title,
          description: data.description,
          category: data.category,
          thumbnail_url: data.thumbnail_url || undefined,
        });
        setCourse((prev) =>
          prev ? { ...prev, ...result, topics: prev.topics } : prev
        );
      } else {
        const result = await createCourse({
          title: data.title,
          description: data.description,
          category: data.category,
          thumbnail_url: data.thumbnail_url || undefined,
        });
        router.push(`/teacher/courses/${result.id}`);
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Failed to save course."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!courseId || !course) return;
    setServerError("");
    setIsPublishing(true);
    try {
      if (course.status === "published") {
        await unpublishCourse(courseId);
        setCourse((prev) => (prev ? { ...prev, status: "draft" } : prev));
      } else {
        await publishCourse(courseId);
        setCourse((prev) => (prev ? { ...prev, status: "published" } : prev));
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Failed to update course status."
      );
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-dark-gray text-sm-text">
        Loading course...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-h3 font-bold text-dark">
            {isEditMode ? "Edit Course" : "Create New Course"}
          </h1>
          <p className="text-sm-text text-dark-gray mt-1">
            {isEditMode
              ? "Update your course details below."
              : "Fill in the details below to create a new draft course."}
          </p>
        </div>
        {isEditMode && course && (
          <div className="flex items-center gap-3 self-start">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                course.status === "published"
                  ? "bg-green-50 text-green-700"
                  : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {course.status}
            </span>
            <Button
              type="button"
              variant={course.status === "published" ? "outline" : "primary"}
              size="md"
              disabled={isPublishing}
              onClick={handlePublishToggle}
            >
              {isPublishing
                ? "Updating..."
                : course.status === "published"
                  ? "Unpublish"
                  : "Publish"}
            </Button>
          </div>
        )}
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
            id="title"
            label="Course Title"
            placeholder="e.g. Introduction to Human Anatomy"
            error={errors.title?.message}
            registration={register("title")}
          />

          <FormTextarea
            id="description"
            label="Description"
            placeholder="Describe what students will learn in this course..."
            rows={4}
            error={errors.description?.message}
            registration={register("description")}
          />

          <FormRadioGroup
            name="category"
            label="Category"
            options={categoryOptions}
            error={errors.category?.message}
            registration={register("category")}
          />

          <FormInput
            id="thumbnail_url"
            label="Thumbnail URL (optional)"
            placeholder="https://example.com/image.png"
            error={errors.thumbnail_url?.message}
            registration={register("thumbnail_url")}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Course"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => router.push("/teacher/courses")}
            >
              {isEditMode ? "Back to Courses" : "Cancel"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
