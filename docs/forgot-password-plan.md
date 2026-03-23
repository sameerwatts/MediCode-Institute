# Forgot Password Feature

## Context
Users (students, teachers, admins) have no way to recover their account if they forget their password. This feature adds a standard email-link-based password reset flow — the same pattern used by Google, GitHub, and Stripe.

## Decisions
- **Flow:** Email link (not verification code) — fewer steps, industry standard
- **Roles:** All roles including admin can reset
- **Token expiry:** 15 minutes
- **Post-reset:** Redirect to login page with success message

## User Flow
1. User clicks "Forgot your password?" on the login page
2. Navigated to `/forgot-password` — enters their email, clicks "Send Reset Link"
3. Backend creates a `PasswordResetToken`, emails a link: `{frontend_url}/reset-password?token=xxx`
4. User clicks link in email → lands on `/reset-password?token=xxx`
5. Page validates token, shows "Set New Password" form (password + confirm)
6. On submit, backend verifies token again, hashes new password, updates user, marks token used
7. Redirect to `/login` with success message ("Password reset successful. Please sign in.")

**Security:** If email doesn't exist, still show "If an account exists, we've sent a reset link" (prevents user enumeration).

---

## Backend Changes

### 1. New model: `backend/app/models/password_reset_token.py`
Follow the `InviteToken` pattern exactly:
```
Table: password_reset_tokens
- id: UUID (PK)
- token: String(64), unique, indexed
- user_id: UUID, FK to users.id
- expires_at: DateTime (15 min from creation)
- used_at: DateTime, nullable
- created_at: DateTime, server_default=now()
```

### 2. New service: `backend/app/services/password_reset_service.py`
Follow `invite_service.py` pattern:
- `generate_reset_token(db, user) → PasswordResetToken` — invalidate previous unused tokens for same user, create new one with `secrets.token_hex(32)`, 15-min expiry
- `validate_reset_token(db, token_str) → (token, user, error_reason)` — returns `("invalid" | "used" | "expired")` on failure
- `consume_reset_token(db, token) → None` — sets `used_at = now`

### 3. Add email function: `backend/app/services/email_service.py`
Add `send_password_reset(email, name, reset_token)`:
- Constructs URL: `{settings.frontend_url}/reset-password?token={token}`
- HTML email with styled "Reset Password" button (same style as invite email)
- Subject: "Reset Your Password — MediCode Institute"

### 4. New schemas: `backend/app/schemas/password_reset.py`
- `ForgotPasswordRequest`: email (str)
- `ResetPasswordRequest`: token (str), new_password (str, min 6 chars)
- `ForgotPasswordResponse`: message (str)
- `ResetPasswordResponse`: message (str)

### 5. New router: `backend/app/routers/password_reset.py`
Two endpoints:

**`POST /api/auth/forgot-password`** (public, no auth required)
- Input: `ForgotPasswordRequest` (email)
- Look up user by email
- If user exists AND has a password_hash (skip OAuth-only users): generate token, send email
- Always return `{"message": "If an account exists, we've sent a reset link."}` (prevent enumeration)

**`POST /api/auth/reset-password`** (public, no auth required)
- Input: `ResetPasswordRequest` (token, new_password)
- Validate token → get user
- Hash new password, update `user.password_hash`
- Consume token (mark used_at)
- Return `{"message": "Password reset successful. Please sign in."}`
- On invalid/expired/used token: return 400 with appropriate message

### 6. Register router: `backend/app/main.py`
Add `app.include_router(password_reset.router)`

### 7. Register model in Alembic: `backend/alembic/env.py`
Add `from app.models import password_reset_token` to imports

### 8. Create migration
`alembic revision --autogenerate -m "add password_reset_tokens table"`
`alembic upgrade head`

---

## Frontend Changes

### 9. New service functions: `src/services/authService.ts`
Add two functions:
- `forgotPassword(email: string): Promise<{ message: string }>` — POST `/api/auth/forgot-password`
- `resetPassword(token: string, newPassword: string): Promise<{ message: string }>` — POST `/api/auth/reset-password`

### 10. New page: `app/(public)/forgot-password/page.tsx`
Route page with metadata, renders `ForgotPassword` view

### 11. New view: `src/views/ForgotPassword/index.tsx`
- Zod schema: email validation
- React Hook Form
- Form: email input + "Send Reset Link" button
- On success: show green success message ("Check your email for a reset link")
- On error: show server error
- Link back to login
- Reuses: `FormInput`, `Button`, same card layout as Login page

### 12. New page: `app/(public)/reset-password/page.tsx`
Route page with `<Suspense>` (uses `useSearchParams`), renders `ResetPassword` view

### 13. New view: `src/views/ResetPassword/index.tsx`
- Reads `token` from URL search params
- If no token: show error state
- Zod schema: password (min 6) + confirmPassword (must match)
- React Hook Form
- Form: new password + confirm password (both with toggle) + "Reset Password" button
- On success: show success message, redirect to `/login` after 2 seconds
- On error (invalid/expired token): show error with link to try again
- Reuses: `FormInput`, `Button`, same card layout

### 14. Add "Forgot your password?" link: `src/views/Login/index.tsx`
Add a link between the password field and the Sign In button:
```tsx
<Link href="/forgot-password" className="text-primary text-sm-text hover:underline">
  Forgot your password?
</Link>
```

### 15. Tests: `src/views/ForgotPassword/ForgotPassword.test.tsx`
- Renders email input and submit button
- Shows validation error for invalid email
- Shows success message on successful submission
- Shows error message on API failure

### 16. Tests: `src/views/ResetPassword/ResetPassword.test.tsx`
- Renders password fields when token is present
- Shows error when no token in URL
- Shows validation error when passwords don't match
- Shows success message on successful reset

---

## File Summary

| File | Action |
|------|--------|
| `backend/app/models/password_reset_token.py` | CREATE |
| `backend/app/services/password_reset_service.py` | CREATE |
| `backend/app/schemas/password_reset.py` | CREATE |
| `backend/app/routers/password_reset.py` | CREATE |
| `backend/app/services/email_service.py` | MODIFY (add send_password_reset) |
| `backend/app/main.py` | MODIFY (register router) |
| `backend/alembic/env.py` | MODIFY (import new model) |
| `backend/alembic/versions/xxx_add_password_reset_tokens.py` | CREATE (auto) |
| `src/services/authService.ts` | MODIFY (add 2 functions) |
| `app/(public)/forgot-password/page.tsx` | CREATE |
| `src/views/ForgotPassword/index.tsx` | CREATE |
| `src/views/ForgotPassword/ForgotPassword.test.tsx` | CREATE |
| `app/(public)/reset-password/page.tsx` | CREATE |
| `src/views/ResetPassword/index.tsx` | CREATE |
| `src/views/ResetPassword/ResetPassword.test.tsx` | CREATE |
| `src/views/Login/index.tsx` | MODIFY (add forgot password link) |
| `docs/CHANGELOG.md` | MODIFY |
| `docs/project_status.md` | MODIFY |

## Existing Code to Reuse
- **Token pattern:** `backend/app/models/invite_token.py` + `backend/app/services/invite_service.py`
- **Email pattern:** `backend/app/services/email_service.py` (`_send()` helper, HTML template style)
- **Frontend form pattern:** `src/views/Login/index.tsx` (Zod + React Hook Form + FormInput + Button + error handling)
- **Auth service pattern:** `src/services/authService.ts` (`toError()` helper, axios instance)

## Verification
1. `cd backend && alembic upgrade head` — migration applies
2. `cd .. && npm run lint` — no errors
3. `npm run build` — compiles
4. `npm test` — all tests pass (existing + new)
5. Manual: login page shows "Forgot your password?" link
6. Manual: forgot-password page sends email, reset-password page resets password
7. Manual: expired/used tokens show appropriate errors
