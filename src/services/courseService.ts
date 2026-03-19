/**
 * courseService.ts — Public and student API calls for courses.
 * Browsing is public. Enrollment and content access require authentication.
 */

import axios from 'axios';
import {
  IPaginatedCourses,
  ICourseDetail,
  IEnrollment,
  ISubtopicContent,
} from '@/types';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

function toError(err: unknown, fallback: string): never {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === 'string') throw new Error(detail);
  }
  throw new Error(err instanceof Error ? err.message : fallback);
}

export async function listCourses(params?: {
  page?: number;
  category?: string;
  search?: string;
}): Promise<IPaginatedCourses> {
  try {
    const res = await api.get<IPaginatedCourses>('/courses', { params });
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to load courses.');
  }
}

export async function getCourseBySlug(slug: string): Promise<ICourseDetail> {
  try {
    const res = await api.get<ICourseDetail>(`/courses/${slug}`);
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to load course.');
  }
}

export async function enrollInCourse(
  slug: string,
): Promise<{ message: string; enrolled_at: string }> {
  try {
    const res = await api.post(`/courses/${slug}/enroll`);
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to enroll.');
  }
}

export async function getEnrollmentStatus(
  slug: string,
): Promise<IEnrollment> {
  try {
    const res = await api.get<IEnrollment>(
      `/courses/${slug}/enrollment-status`,
    );
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to check enrollment status.');
  }
}

export async function getSubtopicContent(
  slug: string,
  subtopicId: string,
): Promise<ISubtopicContent> {
  try {
    const res = await api.get<ISubtopicContent>(
      `/courses/${slug}/subtopics/${subtopicId}`,
    );
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to load subtopic content.');
  }
}
