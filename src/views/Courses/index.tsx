"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import SectionHeading from "@/components/common/SectionHeading";
import { listCourses } from "@/services/courseService";
import { ICourseSummary, TCourseCategory } from "@/types";

type FilterCategory = "all" | TCourseCategory;

interface IFilterOption {
  label: string;
  value: FilterCategory;
}

const filterOptions: IFilterOption[] = [
  { label: "All", value: "all" },
  { label: "Medical", value: "medical" },
  { label: "CS", value: "cs" },
];

const Courses: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [courses, setCourses] = useState<ICourseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params =
        activeFilter === "all" ? undefined : { category: activeFilter };
      const data = await listCourses(params);
      setCourses(data.items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load courses."
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return (
    <section className="py-8 pb-12 max-w-[1200px] mx-auto px-4">
      <SectionHeading
        title="All Courses"
        subtitle="Browse our comprehensive collection of courses"
      />

      <div className="flex gap-2 mb-8 flex-wrap">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setActiveFilter(option.value)}
            className={`px-6 py-2 rounded-full text-sm-text font-medium transition-colors duration-200
              ${
                activeFilter === option.value
                  ? "bg-primary text-white hover:bg-primary-dark"
                  : "bg-light-gray text-dark-gray hover:bg-[#CBD5E1]"
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-dark-gray text-sm-text">
          Loading courses...
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm-text">
          {error}
        </div>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray text-body py-12">
          No courses found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              {course.thumbnail_url ? (
                <div className="relative h-[180px]">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-2 left-2 px-2 py-1 ${
                      course.category === "medical" ? "bg-medical" : "bg-cs"
                    } text-white text-xs-text font-semibold rounded-sm uppercase`}
                  >
                    {course.category === "medical" ? "Medical" : "CS"}
                  </span>
                </div>
              ) : (
                <div className="h-[180px] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
                  <span className="text-primary/40 text-h2 font-bold">
                    {course.title.charAt(0)}
                  </span>
                  <span
                    className={`absolute top-2 left-2 px-2 py-1 ${
                      course.category === "medical" ? "bg-medical" : "bg-cs"
                    } text-white text-xs-text font-semibold rounded-sm uppercase`}
                  >
                    {course.category === "medical" ? "Medical" : "CS"}
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-body font-semibold text-dark mb-2">
                  {course.title}
                </h3>
                <p className="text-sm-text text-dark-gray line-clamp-2 mb-4">
                  {course.description}
                </p>
                <span className="text-sm-text text-primary font-medium">
                  View Course →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default Courses;
