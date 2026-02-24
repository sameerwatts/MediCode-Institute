/**
 * authService.ts — Real API calls to the FastAPI backend.
 *
 * Key concepts:
 *
 * axios.create({ withCredentials: true })
 *   `withCredentials` tells the browser to include cookies in every request.
 *   Without this, the browser silently strips the httpOnly cookie and FastAPI
 *   would always return 401. This one flag is what makes cookie auth work.
 *
 * baseURL: '/api'
 *   All requests go to /api/... which Next.js proxies to FastAPI (see next.config.ts).
 *   We never hardcode ports — the proxy handles routing in both dev and prod.
 *
 * getMe() catches 401 silently
 *   On app load, we call getMe() to check if the user is logged in.
 *   If there's no cookie (or it expired), FastAPI returns 401 — that's
 *   expected, not an error. We return null instead of throwing.
 */

import axios from 'axios';
import { IUser } from '@/types';

// Shared axios instance — withCredentials ensures cookies travel with every request
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export interface IAuthResponse {
  user: IUser;
  message: string;
}

export async function login(email: string, password: string): Promise<IUser> {
  const res = await api.post<IAuthResponse>('/auth/login', { email, password });
  // FastAPI set the access_token + refresh_token httpOnly cookies in the response.
  // The browser stored them automatically. We never see the token value here.
  return res.data.user;
}

export async function signup(
  name: string,
  email: string,
  password: string,
): Promise<IUser> {
  const res = await api.post<IAuthResponse>('/auth/register', { name, email, password });
  return res.data.user;
}

export async function logout(): Promise<void> {
  // FastAPI responds with delete_cookie() — the browser discards both tokens.
  await api.post('/auth/logout');
}

export async function getMe(): Promise<IUser | null> {
  try {
    const res = await api.get<IUser>('/auth/me');
    // FastAPI read the access_token cookie and returned the user.
    return res.data;
  } catch {
    // 401 = no valid cookie — user is not logged in. This is expected, not an error.
    return null;
  }
}
