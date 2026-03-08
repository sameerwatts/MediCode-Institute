import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /**
   * API Proxy — forwards /api/* requests to the FastAPI backend.
   *
   * Why proxy instead of calling FastAPI directly?
   * With httpOnly cookies, the browser needs the cookie and the API to share
   * the same origin. By proxying through Next.js, the browser always talks to
   * localhost:3000 — cookies are first-party and samesite rules never apply.
   *
   * In development:  /api/auth/login → http://localhost:8000/api/auth/login
   * In production:   /api/auth/login → https://your-render-app.onrender.com/api/auth/login
   *
   * Set NEXT_PUBLIC_API_BASE_URL in .env.local (dev) and Vercel env vars (prod).
   */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api'}/:path*`,
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
