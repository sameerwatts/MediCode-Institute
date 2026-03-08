import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
    response_type: 'code',
    scope: 'openid email profile',
    state,
  });

  const response = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
  );

  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  });

  return response;
}
