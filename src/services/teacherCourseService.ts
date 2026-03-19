/**
 * teacherCourseService.ts — Teacher API calls for course management.
 * All endpoints require teacher role (enforced server-side via require_teacher).
 */

import axios from 'axios';
import {
  IPaginatedCourses,
  ICourseSummary,
  ICourseTeacherDetail,
  ISubtopicContent,
  TCourseCategory,
} from '@/types';

const api = axios.create({
  baseURL: '/api/teacher',
  withCredentials: true,
});

function toError(err: unknown, fallback: string): never {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === 'string') throw new Error(detail);
  }
  throw new Error(err instanceof Error ? err.message : fallback);
}

// ─── Course CRUD ──────────────────────────────────────────────────────────────

export async function createCourse(data: {
  title: string;
  description: string;
  category: TCourseCategory;
  thumbnail_url?: string;
}): Promise<{ id: string; slug: string; message: string }> {
  try {
    const res = await api.post('/courses', data);
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to create course.');
  }
}

export async function listMyCourses(params?: {
  page?: number;
  status?: string;
}): Promise<IPaginatedCourses> {
  try {
    const res = await api.get<IPaginatedCourses>('/courses', { params });
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to load courses.');
  }
}

export async function getCourseDetail(
  courseId: string,
): Promise<ICourseTeacherDetail> {
  try {
    const res = await api.get<ICourseTeacherDetail>(`/courses/${courseId}`);
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to load course.');
  }
}

export async function updateCourse(
  courseId: string,
  data: {
    title?: string;
    description?: string;
    category?: TCourseCategory;
    thumbnail_url?: string;
  },
): Promise<ICourseSummary> {
  try {
    const res = await api.put<ICourseSummary>(`/courses/${courseId}`, data);
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to update course.');
  }
}

export async function deleteCourse(courseId: string): Promise<void> {
  try {
    await api.delete(`/courses/${courseId}`);
  } catch (err) {
    return toError(err, 'Failed to delete course.');
  }
}

export async function publishCourse(
  courseId: string,
): Promise<{ message: string; status: string }> {
  try {
    const res = await api.post(`/courses/${courseId}/publish`);
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to publish course.');
  }
}

export async function unpublishCourse(
  courseId: string,
): Promise<{ message: string; status: string }> {
  try {
    const res = await api.post(`/courses/${courseId}/unpublish`);
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to unpublish course.');
  }
}

// ─── Topic CRUD ───────────────────────────────────────────────────────────────

export async function createTopic(
  courseId: string,
  data: { title: string },
): Promise<{ id: string; title: string; order: number }> {
  try {
    const res = await api.post(`/courses/${courseId}/topics`, data);
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to create topic.');
  }
}

export async function updateTopic(
  topicId: string,
  data: { title?: string; order?: number },
): Promise<{ id: string; title: string; order: number }> {
  try {
    const res = await api.put(`/topics/${topicId}`, data);
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to update topic.');
  }
}

export async function deleteTopic(topicId: string): Promise<void> {
  try {
    await api.delete(`/topics/${topicId}`);
  } catch (err) {
    return toError(err, 'Failed to delete topic.');
  }
}

// ─── Subtopic CRUD ────────────────────────────────────────────────────────────

export async function createSubtopic(
  topicId: string,
  data: { title: string },
): Promise<ISubtopicContent> {
  try {
    const res = await api.post<ISubtopicContent>(
      `/topics/${topicId}/subtopics`,
      data,
    );
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to create subtopic.');
  }
}

export async function updateSubtopic(
  subtopicId: string,
  data: {
    title?: string;
    content?: Record<string, unknown>;
    order?: number;
  },
): Promise<ISubtopicContent> {
  try {
    const res = await api.put<ISubtopicContent>(
      `/subtopics/${subtopicId}`,
      data,
    );
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to update subtopic.');
  }
}

export async function deleteSubtopic(subtopicId: string): Promise<void> {
  try {
    await api.delete(`/subtopics/${subtopicId}`);
  } catch (err) {
    return toError(err, 'Failed to delete subtopic.');
  }
}

// ─── Image upload ─────────────────────────────────────────────────────────────

export async function uploadImage(
  file: File,
  folder?: string,
): Promise<{ url: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<{ url: string }>('/upload-image', formData, {
      params: folder ? { folder } : undefined,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to upload image.');
  }
}
