/**
 * adminService.ts — API calls for admin teacher application management.
 * All endpoints require admin role (enforced server-side via require_admin).
 */

import axios from 'axios';
import {
  IPaginatedApplications,
  IAdminApplicationDetail,
  IApproveResponse,
  IRejectResponse,
  IResendInviteResponse,
  IPaginatedStudents,
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

export async function getApplications(params?: {
  status?: string;
  search?: string;
  page?: number;
}): Promise<IPaginatedApplications> {
  try {
    const res = await api.get<IPaginatedApplications>('/admin/applications', {
      params,
    });
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to load applications.');
  }
}

export async function getApplicationDetail(
  id: string,
): Promise<IAdminApplicationDetail> {
  try {
    const res = await api.get<IAdminApplicationDetail>(
      `/admin/applications/${id}`,
    );
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to load application detail.');
  }
}

export async function approveApplication(id: string): Promise<IApproveResponse> {
  try {
    const res = await api.post<IApproveResponse>(
      `/admin/applications/${id}/approve`,
    );
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to approve application.');
  }
}

export async function rejectApplication(
  id: string,
  reason?: string,
): Promise<IRejectResponse> {
  try {
    const res = await api.post<IRejectResponse>(
      `/admin/applications/${id}/reject`,
      { reason },
    );
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to reject application.');
  }
}

export async function resendInvite(id: string): Promise<IResendInviteResponse> {
  try {
    const res = await api.post<IResendInviteResponse>(
      `/admin/applications/${id}/resend-invite`,
    );
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to resend invite.');
  }
}

export async function getStudents(params?: {
  search?: string;
  page?: number;
}): Promise<IPaginatedStudents> {
  try {
    const res = await api.get<IPaginatedStudents>('/admin/students', { params });
    return res.data;
  } catch (err) {
    return toError(err, 'Failed to load students.');
  }
}
