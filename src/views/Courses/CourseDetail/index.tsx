"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import TopicAccordion from "@/components/course/TopicAccordion";
import Button from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import {
  getCourseBySlug,
  enrollInCourse,
  getEnrollmentStatus,
} from "@/services/courseService";
import { ICourseDetail } from "@/types";

interface ICourseDetailProps {
  slug: string;
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const CourseDetail: React.FC<ICourseDetailProps> = ({ slug }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<ICourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrolledAt, setEnrolledAt] = useState<string | null>(null);

  const loadCourse = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getCourseBySlug(slug);
      setCourse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load course.");
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  const checkEnrollment = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const status = await getEnrollmentStatus(slug);
      setIsEnrolled(status.enrolled);
      setEnrolledAt(status.enrolled_at);
    } catch {
      // Not enrolled or not authenticated — ignore
    }
  }, [slug, isAuthenticated]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  useEffect(() => {
    if (course) {
      checkEnrollment();
    }
  }, [course, checkEnrollment]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${slug}`);
      return;
    }
    setIsEnrolling(true);
    try {
      const result = await enrollInCourse(slug);
      setIsEnrolled(true);
      setEnrolledAt(result.enrolled_at);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enroll.");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-dark-gray text-sm-text">
        Loading course...
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm-text">
          {error}
        </div>
      </div>
    );
  }

  if (!course) return null;

  const totalLessons = course.topics.reduce(
    (sum, t) => sum + t.subtopics.length,
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm-text text-dark-gray mb-6">
        <button
          type="button"
          onClick={() => router.push("/courses")}
          className="hover:text-primary transition-colors"
        >
          Courses
        </button>
        <span className="mx-2">/</span>
        <span className="text-dark">{course.title}</span>
      </nav>

      {/* Course header */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-medium ${
                course.category === "medical"
                  ? "bg-purple-50 text-purple-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {course.category === "medical"
                ? "Medical Sciences"
                : "Computer Science"}
            </span>
          </div>

          <h1 className="text-h2 font-bold text-dark mb-3">{course.title}</h1>

          <p className="text-body text-dark-gray mb-4">{course.description}</p>

          <div className="flex flex-wrap gap-4 text-sm-text text-dark-gray mb-6">
            <span>By {course.teacher_name}</span>
            <span>
              {course.topics.length}{" "}
              {course.topics.length === 1 ? "topic" : "topics"}
            </span>
            <span>
              {totalLessons} {totalLessons === 1 ? "lesson" : "lessons"}
            </span>
            <span>Updated {formatDate(course.updated_at)}</span>
          </div>

          {/* Enrollment CTA */}
          {isEnrolled ? (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 text-sm-text font-medium rounded-lg">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Enrolled{enrolledAt ? ` on ${formatDate(enrolledAt)}` : ""}
            </div>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={isEnrolling}
              onClick={handleEnroll}
            >
              {isEnrolling
                ? "Enrolling..."
                : isAuthenticated
                  ? "Enroll for Free"
                  : "Log in to Enroll"}
            </Button>
          )}
        </div>

        {/* Thumbnail */}
        {course.thumbnail_url && (
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="rounded-xl overflow-hidden border border-light-gray">
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm-text">
          {error}
        </div>
      )}

      {/* Course content / TOC */}
      <div>
        <h2 className="text-h3 font-bold text-dark mb-4">Course Content</h2>
        <TopicAccordion
          topics={course.topics}
          courseSlug={slug}
          isEnrolled={isEnrolled}
        />
      </div>
    </div>
  );
};

export default CourseDetail;
