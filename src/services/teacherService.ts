import axios from 'axios';

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

import { ITeacher } from '@/types';

interface TeacherListResponse {
  items: ITeacher[];
}

export async function listTeachers(): Promise<ITeacher[]> {
  try {
    const res = await api.get<TeacherListResponse>('/teachers');
    return res.data.items;
  } catch (err) {
    return toError(err, 'Failed to load teachers.');
  }
}

export interface IOnboardingData {
  bio: string;
  designation: string;
  department: 'medical' | 'cs';
  photo_url?: string;
}

export async function submitOnboarding(data: IOnboardingData): Promise<void> {
  try {
    await api.post('/teacher/onboarding', data);
  } catch (err) {
    return toError(err, 'Failed to save profile. Please try again.');
  }
}
