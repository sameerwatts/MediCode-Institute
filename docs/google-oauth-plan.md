# Plan: Google OAuth for Student Login

## Context
Students currently must manually enter email + password to sign up or log in. The goal is to add "Continue with Google" as a frictionless alternative — clicking it auto-registers (if new) or logs in (if existing) the student. Teacher and Admin login flows are unchanged. Apple Sign-In is deferred to a future PR.

**Key decisions:**
- Google only (Apple later)
- Auto-link: if Google email matches an existing email/password account → link and log in
- OAuth students have no password (keep it simple, no "set password" UI)
- Block Google OAuth for teacher/admin role (return error if matched)

---

## Architecture: Next.js Route Handlers (avoids proxy redirect issues)

The existing Next.js proxy (`/api/*` → FastAPI) cannot reliably pass 302 redirects through to the browser for OAuth flows. The clean solution is **Next.js Route Handlers** for the OAuth initiation and callback — they run server-side on the correct domain, can set httpOnly cookies natively, and bypass the proxy entirely.

```
[Browser] clicks Google button
  → navigates to /api/auth/google   (Next.js Route Handler, takes precedence over proxy rewrite)
  → Route Handler: generates CSRF state, sets state cookie, redirects browser → Google

[Google] authenticates user
  → redirects browser → /api/auth/callback/google   (Next.js Route Handler)
  → Route Handler: validates CSRF state, calls FastAPI POST /api/auth/google/exchange
  → FastAPI: exchanges code, finds/creates/links user, returns { access_token, refresh_token, user }
  → Route Handler: sets httpOnly cookies (on Vercel/Next.js domain ✓), redirects to /

[Browser] lands at / with auth cookies set
  → AuthContext.getMe() restores auth state normally
```

---

## Database Changes

### User model (`backend/app/models/user.py`)
```python
password_hash = Column(String, nullable=True)   # was nullable=False — OAuth users have no password
google_id     = Column(String(255), nullable=True)   # Google's "sub" field
auth_provider = Column(String(20), nullable=False, default="local")  # 'local' | 'google' | 'both'
```

### New Alembic migration
File: `backend/alembic/versions/YYYYMMDD_HHMM_add_google_oauth_to_users.py`
```sql
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL;
CREATE UNIQUE INDEX ix_users_google_id ON users (google_id) WHERE google_id IS NOT NULL;
ALTER TABLE users ADD COLUMN auth_provider VARCHAR(20) NOT NULL DEFAULT 'local';
```

---

## PR 1 — Backend: DB Schema for OAuth
**Branch:** `backend/feature/oauth-db-schema`

**Files changed:**
- `backend/app/models/user.py` — make `password_hash` nullable, add `google_id` + `auth_provider`
- `backend/alembic/versions/…_add_google_oauth_to_users.py` — new migration
- `backend/app/routers/auth.py` — add guard in `login()` endpoint (line ~142):
  ```python
  # Before: verify_password(request.password, user.password_hash)  <-- crashes if None
  # After:
  if not user or not user.password_hash or not auth_service.verify_password(request.password, user.password_hash):
      raise HTTPException(status_code=401, detail="Invalid email or password.")
  ```
  This guard must ship with the migration — without it, any OAuth user who later tries email/password login would get a crash.

---

## PR 2 — Backend: Google OAuth Exchange Endpoint
**Branch:** `backend/feature/google-oauth-api`
**Merges after:** PR 1

### New endpoint
`POST /api/auth/google/exchange`
Called by the Next.js Route Handler (server-to-server). Returns JSON with JWT tokens — the Route Handler sets the cookies. No cookie logic in FastAPI for this flow.

```python
class GoogleExchangeRequest(BaseModel):
    code: str
    redirect_uri: str   # must match what was registered in Google Cloud Console

class GoogleExchangeResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: UserResponse
```

### New `auth_service.py` functions

**`exchange_google_code(code, redirect_uri) → dict | None`**
```
1. POST https://oauth2.googleapis.com/token with code, client_id, client_secret, redirect_uri, grant_type=authorization_code
2. GET https://www.googleapis.com/oauth2/v2/userinfo using returned access_token
3. Verify verified_email == true
4. Return { google_id, email, name, picture } or None on any failure
```

**`find_or_create_google_user(db, google_user) → User`**
```
1. Look up by google_id  → if found: update avatar_url, return user
2. Look up by email      → if found:
     - if role in (teacher, admin): raise ValueError("oauth_role_not_permitted")
     - else: set google_id, set auth_provider="both", return user  (account linking)
3. Neither found         → create new User(role="student", google_id=…, auth_provider="google", password_hash=None)
```

### New config (`backend/app/config.py`)
```python
google_client_id: str = ""
google_client_secret: str = ""
```

### New dependency
`backend/requirements.txt`: add `httpx>=0.27.0`

### New env vars (`backend/.env.example`)
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## PR 3 — Frontend: Google OAuth UI + Route Handlers
**Branch:** `frontend/feature/google-oauth-ui`
**Merges after:** PR 2

### New Next.js Route Handlers

**`app/api/auth/google/route.ts`** — Initiation
```typescript
export async function GET() {
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
    response_type: 'code',
    scope: 'openid email profile',
    state,
  });
  const response = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  response.cookies.set('oauth_state', state, { httpOnly: true, sameSite: 'lax', maxAge: 600, path: '/' });
  return response;
}
```

**`app/api/auth/callback/google/route.ts`** — Callback
```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const storedState = request.cookies.get('oauth_state')?.value;
  const errorUrl = '/login?error=oauth_failed';

  if (!code || !state || state !== storedState) return NextResponse.redirect(new URL(errorUrl, request.url));

  // Call FastAPI to exchange code for tokens
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, redirect_uri: process.env.GOOGLE_CALLBACK_URL }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const errorParam = err?.detail === 'oauth_role_not_permitted' ? 'oauth_role_error' : 'oauth_failed';
    return NextResponse.redirect(new URL(`/login?error=${errorParam}`, request.url));
  }

  const { access_token, refresh_token } = await res.json();
  const response = NextResponse.redirect(new URL('/', request.url));
  const isSecure = process.env.NODE_ENV === 'production';

  response.cookies.set('access_token', access_token, { httpOnly: true, secure: isSecure, sameSite: 'lax', maxAge: 30 * 60, path: '/' });
  response.cookies.set('refresh_token', refresh_token, { httpOnly: true, secure: isSecure, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/api/auth/refresh' });
  response.cookies.delete('oauth_state');
  return response;
}
```

### Login page (`src/views/Login/index.tsx`)

Add after the closing `</form>` tag and before the "Don't have an account?" paragraph:

```tsx
{/* Divider */}
<div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-200" />
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="bg-white px-4 text-gray-500">or</span>
  </div>
</div>

{/* Google button */}
<button
  type="button"
  onClick={() => { window.location.href = '/api/auth/google'; }}
  className="w-full inline-flex items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-8 py-4 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all duration-200"
>
  <GoogleIcon />   {/* inline SVG component — no external image dependency */}
  Continue with Google
</button>
```

Add `useSearchParams` error handling (read `?error=oauth_failed` or `?error=oauth_role_error` from URL on mount and display via existing `setServerError`). Requires `<Suspense>` wrapper — check `app/(public)/login/page.tsx` and add if missing.

### Other frontend changes
- `next.config.ts` — add `lh3.googleusercontent.com` to `images.remotePatterns` (Google profile pictures)
- `app/(public)/login/page.tsx` — ensure `<Suspense>` wraps `<Login />` (needed for `useSearchParams`)

### New env vars (frontend `.env.local` / Vercel dashboard)
```
GOOGLE_CLIENT_ID=...          # server-side only (Route Handler)
GOOGLE_CLIENT_SECRET=...      # NOT needed in frontend; exchange happens backend→FastAPI
GOOGLE_CALLBACK_URL=https://your-domain.vercel.app/api/auth/callback/google
```
Note: `GOOGLE_CALLBACK_URL` is the Route Handler URL — register this exact URL in Google Cloud Console.

---

## PR Sequence Summary

| # | Branch | Title | Depends on |
|---|--------|-------|------------|
| 1 | `backend/feature/oauth-db-schema` | feat: add google_id and auth_provider to users table | — |
| 2 | `backend/feature/google-oauth-api` | feat: add Google OAuth exchange endpoint to FastAPI | PR 1 merged |
| 3 | `frontend/feature/google-oauth-ui` | feat: add Google sign-in to login page | PR 2 merged |

---

## Google Cloud Console Setup (before PR 3 can be tested)
1. Go to https://console.cloud.google.com → Create/select project
2. APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Application type: **Web application**
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://your-domain.vercel.app/api/auth/callback/google` (prod)
5. Copy Client ID + Client Secret → add to `.env.local` + Vercel env vars

---

## Verification

1. **PR 1**: Run `alembic upgrade head`, check users table has new columns + nullable password_hash. Verify existing email/password login still works.
2. **PR 2**: Test `POST /api/auth/google/exchange` with a real Google auth code (use Playwright or curl). Verify new student is created with `role=student`, existing email account is linked with `auth_provider=both`, teacher email is rejected with `oauth_role_not_permitted`.
3. **PR 3 (E2E)**: Use Playwright to click "Continue with Google" on login page → complete Google consent → verify redirect to `/` → verify `getMe()` returns correct user → verify cookies are set on the correct domain.
