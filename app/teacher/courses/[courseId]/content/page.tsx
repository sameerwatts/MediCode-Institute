"use client";

import { useParams } from "next/navigation";
import CourseContent from "@/views/Teacher/CourseContent";

export default function CourseContentPage() {
  const params = useParams<{ courseId: string }>();

  return <CourseContent courseId={params.courseId} />;
}
