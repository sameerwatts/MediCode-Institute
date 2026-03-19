"use client";

import { useParams } from "next/navigation";
import CourseForm from "@/views/Teacher/CourseForm";

export default function EditCoursePage() {
  const params = useParams<{ courseId: string }>();

  return <CourseForm courseId={params.courseId} />;
}
