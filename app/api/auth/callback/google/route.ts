import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    console.error('[oauth/callback] No code in callback. params:', Object.fromEntries(searchParams));
    return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url));
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';
  console.log('[oauth/callback] Calling exchange endpoint:', `${apiBase}/auth/google/exchange`);

  let res: Response;
  try {
    res = await fetch(`${apiBase}/auth/google/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri: process.env.GOOGLE_CALLBACK_URL }),
    });
  } catch (err) {
    console.error('[oauth/callback] Fetch to backend failed (network error):', err);
    return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url));
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('[oauth/callback] Backend returned error:', res.status, err);
    const errorParam = err?.detail === 'oauth_role_not_permitted' ? 'oauth_role_error' : 'oauth_failed';
    return NextResponse.redirect(new URL(`/login?error=${errorParam}`, request.url));
  }

  const { access_token, refresh_token } = await res.json();
  const isSecure = process.env.NODE_ENV === 'production';
  const response = NextResponse.redirect(new URL('/', request.url));

  response.cookies.set('access_token', access_token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 30 * 60,
    path: '/',
  });
  response.cookies.set('refresh_token', refresh_token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/api/auth/refresh',
  });

  return response;
}
