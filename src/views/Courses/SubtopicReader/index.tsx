"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TipTapRenderer from "@/components/course/TipTapRenderer";
import { useAuth } from "@/hooks/useAuth";
import {
  getCourseBySlug,
  getSubtopicContent,
  getEnrollmentStatus,
} from "@/services/courseService";
import { ICourseDetail, ISubtopicContent } from "@/types";

interface ISubtopicReaderProps {
  slug: string;
  subtopicId: string;
}

interface IFlatSubtopic {
  id: string;
  title: string;
  topicTitle: string;
  topicIndex: number;
  subIndex: number;
}

const SubtopicReader: React.FC<ISubtopicReaderProps> = ({
  slug,
  subtopicId,
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState<ICourseDetail | null>(null);
  const [subtopic, setSubtopic] = useState<ISubtopicContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const flatSubtopics: IFlatSubtopic[] = useMemo(() => {
    if (!course) return [];
    return course.topics.flatMap((topic, tIdx) =>
      topic.subtopics.map((sub, sIdx) => ({
        id: sub.id,
        title: sub.title,
        topicTitle: topic.title,
        topicIndex: tIdx,
        subIndex: sIdx,
      }))
    );
  }, [course]);

  const currentIndex = useMemo(
    () => flatSubtopics.findIndex((s) => s.id === subtopicId),
    [flatSubtopics, subtopicId]
  );

  const prevSubtopic = currentIndex > 0 ? flatSubtopics[currentIndex - 1] : null;
  const nextSubtopic =
    currentIndex >= 0 && currentIndex < flatSubtopics.length - 1
      ? flatSubtopics[currentIndex + 1]
      : null;
  const currentFlat = currentIndex >= 0 ? flatSubtopics[currentIndex] : null;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      if (!isAuthenticated) {
        router.push(`/login?redirect=/courses/${slug}/learn/${subtopicId}`);
        return;
      }

      const enrollStatus = await getEnrollmentStatus(slug);
      if (!enrollStatus.enrolled) {
        setError("You must enroll in this course to access its content.");
        setIsLoading(false);
        return;
      }

      const [courseData, subtopicData] = await Promise.all([
        getCourseBySlug(slug),
        getSubtopicContent(slug, subtopicId),
      ]);
      setCourse(courseData);
      setSubtopic(subtopicData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load content.");
    } finally {
      setIsLoading(false);
    }
  }, [slug, subtopicId, isAuthenticated, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="text-center py-12 text-dark-gray text-sm-text">
        Loading lesson...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm-text">
          {error}
        </div>
        <Link
          href={`/courses/${slug}`}
          className="inline-block mt-4 text-sm-text text-primary hover:underline"
        >
          Back to course
        </Link>
      </div>
    );
  }

  if (!course || !subtopic) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm-text text-dark-gray mb-6 flex flex-wrap items-center gap-1">
        <Link href="/courses" className="hover:text-primary transition-colors">
          Courses
        </Link>
        <span>/</span>
        <Link
          href={`/courses/${slug}`}
          className="hover:text-primary transition-colors"
        >
          {course.title}
        </Link>
        <span>/</span>
        <span className="text-dark">{subtopic.title}</span>
      </nav>

      {/* Lesson header */}
      <div className="mb-6">
        {currentFlat && (
          <p className="text-xs text-dark-gray mb-1">
            {currentFlat.topicTitle}
          </p>
        )}
        <h1 className="text-h2 font-bold text-dark">
          {currentFlat
            ? `${currentFlat.topicIndex + 1}.${currentFlat.subIndex + 1} ${subtopic.title}`
            : subtopic.title}
        </h1>
      </div>

      {/* Content */}
      <div className="border border-light-gray rounded-xl bg-white overflow-hidden mb-8">
        <TipTapRenderer content={subtopic.content} />
      </div>

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between">
        {prevSubtopic ? (
          <Link
            href={`/courses/${slug}/learn/${prevSubtopic.id}`}
            className="flex items-center gap-2 text-sm-text text-primary hover:underline"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {prevSubtopic.title}
          </Link>
        ) : (
          <span />
        )}
        {nextSubtopic ? (
          <Link
            href={`/courses/${slug}/learn/${nextSubtopic.id}`}
            className="flex items-center gap-2 text-sm-text text-primary hover:underline"
          >
            {nextSubtopic.title}
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ) : (
          <Link
            href={`/courses/${slug}`}
            className="flex items-center gap-2 text-sm-text text-primary hover:underline"
          >
            Back to course
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SubtopicReader;
