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
