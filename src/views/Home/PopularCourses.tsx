"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SectionHeading from "@/components/common/SectionHeading";
import ScrollReveal from "@/components/common/ScrollReveal";
import Button from "@/components/common/Button";
import { listCourses } from "@/services/courseService";
import { ICourseSummary } from "@/types";

const PopularCourses: React.FC = () => {
  const [courses, setCourses] = useState<ICourseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listCourses({ page: 1 })
      .then((data) => {
        if (!cancelled) setCourses(data.items.slice(0, 3));
      })
      .catch(() => {
        // Silently fail — section just won't show courses
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="py-section px-6 max-w-[1200px] mx-auto">
        <SectionHeading
          title="Popular Courses"
          subtitle="Start learning with our most enrolled courses"
        />
        <div className="text-center py-8 text-dark-gray text-sm-text">
          Loading courses...
        </div>
      </section>
    );
  }

  if (courses.length === 0) return null;

  return (
    <section className="py-section px-6 max-w-[1200px] mx-auto">
      <SectionHeading
        title="Popular Courses"
        subtitle="Start learning with our most enrolled courses"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <ScrollReveal key={course.id} delay={index}>
          <Link
            href={`/courses/${course.slug}`}
            className="block bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
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
          </ScrollReveal>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link href="/courses">
          <Button variant="outline">View All Courses</Button>
        </Link>
      </div>
    </section>
  );
};

export default PopularCourses;
