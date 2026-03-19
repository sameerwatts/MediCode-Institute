"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { listMyCourses } from "@/services/teacherCourseService";
import { IPaginatedCourses } from "@/types";

interface IStats {
  totalCourses: number;
  draftCourses: number;
  publishedCourses: number;
}

const TeacherDashboard: React.FC = () => {
  const [stats, setStats] = useState<IStats>({
    totalCourses: 0,
    draftCourses: 0,
    publishedCourses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [allRes, draftRes, publishedRes] = await Promise.all([
          listMyCourses({ page: 1 }),
          listMyCourses({ page: 1, status: "draft" }),
          listMyCourses({ page: 1, status: "published" }),
        ]);
        setStats({
          totalCourses: allRes.total,
          draftCourses: draftRes.total,
          publishedCourses: publishedRes.total,
        });
      } catch {
        // Stats will remain at 0
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Courses", value: stats.totalCourses, color: "bg-primary-light text-primary" },
    { label: "Published", value: stats.publishedCourses, color: "bg-green-50 text-green-700" },
    { label: "Drafts", value: stats.draftCourses, color: "bg-yellow-50 text-yellow-700" },
  ];

  return (
    <div>
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-h3 font-bold text-dark">Teacher Dashboard</h1>
        <p className="text-body text-dark-gray">
          Manage your courses, topics, and content.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-light-gray p-5"
          >
            <p className="text-sm-text text-dark-gray mb-1">{card.label}</p>
            <p className={`text-h2 font-bold ${card.color} inline-block px-2 py-0.5 rounded-md`}>
              {isLoading ? "..." : card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-light-gray p-5">
        <h2 className="text-h5 font-semibold text-dark mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/teacher/courses/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm-text font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            + Create New Course
          </Link>
          <Link
            href="/teacher/courses"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-light text-dark-gray text-sm-text font-medium rounded-lg hover:bg-light-gray transition-colors"
          >
            View My Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
