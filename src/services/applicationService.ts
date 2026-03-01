/**
 * applicationService.ts — API calls for teacher applications.
 * Follows the same pattern as authService.ts (axios + withCredentials).
 */

import axios from 'axios';
import {
  ITeacherApplication,
  IApplicationSubmitResponse,
  IApplicationStatusCheck,
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

export async function submitApplication(
  data: ITeacherApplication,
): Promise<IApplicationSubmitResponse> {
  try {
    const res = await api.post<IApplicationSubmitResponse>('/applications', data);
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to submit application. Please try again.');
  }
}

export async function checkApplicationStatus(
  email: string,
  applicationId: string,
): Promise<IApplicationStatusCheck> {
  try {
    const res = await api.get<IApplicationStatusCheck>('/applications/status', {
      params: { email, application_id: applicationId },
    });
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to check application status. Please try again.');
  }
}
