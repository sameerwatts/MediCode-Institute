"use client";

import { useParams } from "next/navigation";
import SubtopicReader from "@/views/Courses/SubtopicReader";

export default function SubtopicReaderPage() {
  const params = useParams<{ slug: string; subtopicId: string }>();

  return <SubtopicReader slug={params.slug} subtopicId={params.subtopicId} />;
}
