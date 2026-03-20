"use client";

import { useParams } from "next/navigation";
import CourseDetail from "@/views/Courses/CourseDetail";

export default function CourseDetailPage() {
  const params = useParams<{ slug: string }>();

  return <CourseDetail slug={params.slug} />;
}
