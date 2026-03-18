# Plan: Restrict "Become a Teacher" by Role & Email

## Context
Currently any user (logged in or not, any role) can see and access the "Become a Teacher" flow. The backend also accepts applications from emails that already belong to teachers or admins. This plan adds role-based visibility on the frontend and email/role validation on the backend.

## Rules
- **Show** "Become a Teacher" for: logged-out users, students
- **Hide** for: teachers, admins
- **Block** backend submission if email belongs to existing teacher/admin
- **Block** re-application for 1 minute after rejection (configurable)

---

## Changes

### 1. Backend: Add email & cooldown checks to `POST /api/applications`

**File:** `backend/app/routers/applications.py`

After the existing duplicate check (line 44), add two new checks before application creation (line 58):

**Check A — Existing teacher/admin email:**
- Import `get_user_by_email` from `app.services.auth_service`
- Query `users` table by submitted email
- If user exists with role `teacher` or `admin` → raise `403` with message "This email is already registered as a teacher or admin."

**Check B — Rejection cooldown:**
- Query `teacher_applications` for most recent rejected application with this email, ordered by `updated_at` desc
- If found and `updated_at` is within `rejection_cooldown_seconds` → raise `429` with message "Please wait before re-applying."

**File:** `backend/app/config.py`
- Add `rejection_cooldown_seconds: int = 60` to `Settings` class

---

### 2. Frontend: Redirect teachers/admins from `/become-a-teacher` page

**File:** `src/views/BecomeATeacher/index.tsx` (already `'use client'`)

- Import `useAuth` and `useRouter`
- After existing state declarations, add:
  ```tsx
  const { user, isLoading } = useAuth();
  const router = useRouter();
  ```
- Before the `if (applicationId)` block (line 87), add early return:
  ```tsx
  if (!isLoading && user && user.role !== 'student') {
    router.replace('/');
    return null;
  }
  if (isLoading) return null;
  ```

---

### 3. Frontend: Conditionally hide "Become a Teacher" link in Footer

**File:** `src/components/layout/Footer/index.tsx`

- Add `'use client'` directive
- Import `useAuth`
- Wrap the "Become a Teacher" `<Link>` (line 24) with conditional: only render if `!user || user.role === 'student'`

---

### 4. Frontend: Conditionally hide "Share Your Expertise" CTA on Home

**File:** `src/views/Home/index.tsx`

Extract lines 67-81 ("Share Your Expertise" section) into a new client component `TeacherCTASection` in `src/views/Home/TeacherCTASection.tsx`. This keeps `Home/index.tsx` as a server component (same pattern as `WelcomeBanner`, `HeroSection`, etc.).

`TeacherCTASection`:
- `'use client'`
- Import `useAuth`
- Return null if `user` exists and `user.role !== 'student'`
- Otherwise render the existing CTA section JSX

---

## Files Modified
1. `backend/app/config.py` — add `rejection_cooldown_seconds`
2. `backend/app/routers/applications.py` — add email + cooldown checks
3. `src/views/BecomeATeacher/index.tsx` — add auth redirect
4. `src/components/layout/Footer/index.tsx` — conditional link
5. `src/views/Home/index.tsx` — replace inline CTA with `<TeacherCTASection />`
6. `src/views/Home/TeacherCTASection.tsx` — new client component (extracted from Home)

## Key Reusable Code
- `get_user_by_email()` from `backend/app/services/auth_service.py` (line 91)
- `useAuth()` hook from `src/hooks/useAuth.ts`
- `settings` from `backend/app/config.py`

## Verification
1. **Backend:** Submit application with teacher email → expect 403. Submit with admin email → expect 403. Submit with student email → expect 201. Submit immediately after rejection → expect 429. Wait 1 min then resubmit → expect 201.
2. **Frontend:** Log in as teacher → Footer hides link, Home hides CTA, `/become-a-teacher` redirects to `/`. Log in as admin → same. Log in as student → all visible. Log out → all visible.
3. Run `npm run lint && npm run build && npm test`
