"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { listMyCourses } from "@/services/teacherCourseService";
import { IPaginatedCourses } from "@/types";

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
];

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const CoursesList: React.FC = () => {
  const [data, setData] = useState<IPaginatedCourses | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await listMyCourses({
        status: statusFilter || undefined,
        page,
      });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load courses.");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleStatusChange = (status: string) => {
    setPage(1);
    setStatusFilter(status);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-h3 font-bold text-dark">My Courses</h1>
          <p className="text-sm-text text-dark-gray mt-1">
            Create and manage your courses.
          </p>
        </div>
        <Link
          href="/teacher/courses/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm-text font-medium rounded-lg hover:bg-primary/90 transition-colors self-start"
        >
          + New Course
        </Link>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleStatusChange(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm-text font-medium transition-colors flex-shrink-0 ${
              statusFilter === opt.value
                ? "bg-primary text-white"
                : "bg-white text-dark-gray border border-light-gray hover:bg-light"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm-text">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-12 text-dark-gray text-sm-text">
          Loading courses...
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && data && data.items.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-light-gray">
          <p className="text-dark-gray text-body mb-4">
            {statusFilter
              ? "No courses match this filter."
              : "You haven't created any courses yet."}
          </p>
          {!statusFilter && (
            <Link
              href="/teacher/courses/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm-text font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              + Create Your First Course
            </Link>
          )}
        </div>
      )}

      {/* Course cards */}
      {!isLoading && data && data.items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {data.items.map((course) => (
            <Link
              key={course.id}
              href={`/teacher/courses/${course.id}`}
              className="bg-white rounded-xl border border-light-gray p-5 hover:shadow-md transition-shadow"
            >
              {course.thumbnail_url && (
                <div className="w-full h-32 rounded-lg bg-light mb-3 overflow-hidden">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    course.status === "published"
                      ? "bg-green-50 text-green-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {course.status}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-light text-dark-gray">
                  {course.category}
                </span>
              </div>
              <h3 className="text-body font-semibold text-dark mb-1 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-sm-text text-dark-gray line-clamp-2 mb-2">
                {course.description}
              </p>
              <p className="text-xs text-gray">
                Created {formatDate(course.created_at)}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.total > data.page_size && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg text-sm-text font-medium bg-white border border-light-gray hover:bg-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm-text text-dark-gray">
            Page {data.page} of {Math.ceil(data.total / data.page_size)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!data.has_next}
            className="px-4 py-2 rounded-lg text-sm-text font-medium bg-white border border-light-gray hover:bg-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
