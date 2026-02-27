# Become a Teacher — Full Architecture

## Context

MediCode Institute needs a way for aspiring teachers to apply, get vetted by an admin, and onboard as teacher-role users. Currently the platform only has student self-signup. This feature introduces a **gated teacher onboarding pipeline** with admin review, secure invite tokens, email notifications, and the first admin dashboard.

---

## Decisions Made

| Decision | Choice |
|----------|--------|
| Signup flow | **Hybrid** — detailed application form → admin review → same `/signup` page with invite token → teacher onboarding page |
| Application form | **Detailed** — name, email, phone, subject area, qualifications, experience, philosophy, optional CV |
| Admin panel | **Full shell** — sidebar + role guard, teacher requests as first module, future-proofed |
| Email service | **Resend** — 3,000 emails/month free, modern DX |
| Admin creation | **CLI command** — server-side only, no public signup for admins |

---

## Admin Account Provisioning

Admin accounts are **never** created through any web UI or public endpoint. They are provisioned via a secure CLI command that only someone with server access can run.

**CLI command:** `backend/app/cli/create_admin.py`

```bash
# Usage (run on server or locally)
python -m backend.app.cli.create_admin --name "Sameer" --email "admin@medicode.com" --password "secure-password"
```

**How it works:**
1. Accepts name, email, password via CLI args (or interactive prompts)
2. Checks if email already exists → error if so
3. Hashes password with bcrypt (same as regular auth)
4. Inserts user row with `role='admin'`
5. Prints confirmation

**Admin login:** Uses the normal `/login` page — same as students and teachers. The `/admin/*` routes are guarded client-side (`user.role === 'admin'` check) and server-side (`require_admin` dependency on all admin API endpoints).

**Why no admin signup page:**
- Zero attack surface — no public endpoint can create admins
- Standard practice (Django `createsuperuser`, Rails `db:seed`)
- Only the platform owner (you) should ever create admin accounts

**New files:**
- `backend/app/cli/__init__.py`
- `backend/app/cli/create_admin.py`

---

## End-to-End Flow

### Happy Path (Approval)
```
1. Visitor → /become-a-teacher → fills detailed form → submits
2. POST /api/applications → row created (status: "pending")
3. "Application Received" email sent with application ID
4. Admin → /admin/teacher-requests → reviews → clicks Approve
5. POST /api/admin/applications/{id}/approve
   → status="approved", invite token generated (64-char hex, 72h expiry)
   → "You're Approved!" email with /signup?invite=<token>
6. Applicant → /signup?invite=<token> → validates token → pre-fills name+email (locked)
7. POST /api/auth/register { name, email, password, invite_token }
   → creates user with role="teacher", consumes token, sets app status="registered"
8. Redirects to /teacher/onboarding → review/enrich profile
```

### Rejection Path
```
Admin clicks Reject (optional reason) → status="rejected" → rejection email sent → no invite link
```

### Re-invite Path
```
Admin → approved app with expired token → clicks "Re-send Invite" → old token invalidated → new token → new email
```

---

## Database Schema

### New: `teacher_applications`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| name | VARCHAR(100) NOT NULL | |
| email | VARCHAR(255) NOT NULL, indexed | |
| phone | VARCHAR(20) NOT NULL | |
| subject_area | VARCHAR(20) NOT NULL | CHECK: 'medical', 'cs' |
| qualifications | TEXT NOT NULL | |
| experience_years | INTEGER NOT NULL | |
| teaching_philosophy | TEXT NOT NULL | |
| resume_url | VARCHAR(500) nullable | Cloudinary URL (optional) |
| status | VARCHAR(20) NOT NULL DEFAULT 'pending' | CHECK: pending/approved/rejected/registered |
| admin_notes | TEXT nullable | Rejection reason or comments |
| reviewed_by | UUID FK → users(id) nullable | |
| reviewed_at | TIMESTAMP WITH TZ nullable | |
| user_id | UUID FK → users(id) nullable | Set on signup completion |
| created_at | TIMESTAMP WITH TZ DEFAULT now() | |
| updated_at | TIMESTAMP WITH TZ DEFAULT now() | |

### New: `invite_tokens`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| token | VARCHAR(64) UNIQUE, indexed | `secrets.token_hex(32)` |
| email | VARCHAR(255) NOT NULL | Must match at signup |
| application_id | UUID FK → teacher_applications(id) | |
| expires_at | TIMESTAMP WITH TZ NOT NULL | created_at + 72 hours |
| used_at | TIMESTAMP WITH TZ nullable | NULL until consumed |
| created_at | TIMESTAMP WITH TZ DEFAULT now() | |

### Existing `users` table — no changes needed

Already has `role ENUM('student', 'teacher', 'admin')`.

---

## Invite Token Security

| Property | How |
|----------|-----|
| Cryptographic | `secrets.token_hex(32)` — 256 bits of entropy |
| Single-use | `used_at` checked before signup, set after |
| Time-limited | 72-hour expiry enforced on every validation |
| Email-bound | Token tied to application email; signup email must match |
| Non-forwardable | Email match + single-use prevents sharing |
| Re-send safe | Old tokens auto-invalidated when new one generated |

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Submit teacher application |
| GET | `/api/applications/status?email=&application_id=` | Check status |
| GET | `/api/auth/validate-invite?token=` | Validate invite token (read-only) |

### Admin (require admin role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/applications?status=&search=&page=` | Paginated list |
| GET | `/api/admin/applications/{id}` | Full detail |
| POST | `/api/admin/applications/{id}/approve` | Approve + invite |
| POST | `/api/admin/applications/{id}/reject` | Reject |
| POST | `/api/admin/applications/{id}/resend-invite` | Re-send invite |

### Modified Auth
| Method | Endpoint | Change |
|--------|----------|--------|
| POST | `/api/auth/register` | Accept optional `invite_token`; if present, validate + set role=teacher |

---

## Frontend Pages

### New Pages
| Route | View Component | Description |
|-------|---------------|-------------|
| `/become-a-teacher` | `BecomeATeacher` | Public application form (RHF + Zod) |
| `/application-status` | `ApplicationStatus` | Check status by email + app ID |
| `/admin` (layout) | `AdminLayout` | Full-viewport admin shell (sidebar + header + role guard) |
| `/admin/teacher-requests` | `TeacherRequests` | Filterable, searchable, paginated list |
| `/admin/teacher-requests/[id]` | `TeacherRequestDetail` | Full detail + approve/reject/resend actions |
| `/teacher/onboarding` | `TeacherOnboarding` | Post-signup profile completion |

### Modified Pages
| Route | Change |
|-------|--------|
| `/signup` | Detect `?invite=` token → validate → pre-fill name+email (locked) → include in register request → redirect to `/teacher/onboarding` |

### New Shared Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `FormTextarea` | `src/components/common/FormTextarea/` | Textarea with label, error state, char count |
| `FormRadioGroup` | `src/components/common/FormRadioGroup/` | Radio buttons for subject area |
| `Modal` | `src/components/common/Modal/` | Reusable confirm/reject modal |
| `StatusBadge` | `src/components/common/StatusBadge/` | Colored status indicator |
| `AdminSidebar` | `src/components/admin/AdminSidebar/` | Admin nav sidebar |
| `AdminHeader` | `src/components/admin/AdminHeader/` | Admin top bar |
| `ApplicationActions` | `src/components/admin/ApplicationActions/` | Approve/reject/resend buttons with modals |

### Modified Files
| File | Change |
|------|--------|
| `src/views/Signup/index.tsx` | Invite token detection, email lock, teacher redirect |
| `src/services/authService.ts` | Add `inviteToken` param to signup, add `validateInviteToken()` |
| `src/context/AuthContext.tsx` | Update signup signature to accept `inviteToken?` |
| `src/types/index.ts` | Add `ITeacherApplication`, `IApplicationStatusCheck`, `IInviteValidation` |

### New Service Files
| File | Functions |
|------|-----------|
| `src/services/applicationService.ts` | `submitApplication()`, `checkApplicationStatus()` |
| `src/services/adminService.ts` | `getApplications()`, `getApplicationDetail()`, `approveApplication()`, `rejectApplication()`, `resendInvite()` |

---

## Email Notifications (Resend)

| Trigger | Subject | Key Content |
|---------|---------|-------------|
| Application submitted | "Application Received" | Confirmation, app ID, status check link |
| Admin approves | "You're Approved!" | CTA button to `/signup?invite=<token>`, 72h expiry notice |
| Admin rejects | "Application Update" | Polite regret, optional reason, encouragement |

Backend: `backend/app/services/email_service.py` using `resend` Python SDK.

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Duplicate pending application | 409: "You already have a pending application" |
| Duplicate after rejection | Allow — new row, old stays in history |
| Duplicate after approval | 409: "Already approved. Check your email." |
| Token expired | Show error, admin can re-send |
| Token forwarded to wrong email | Signup fails: "Email does not match" |
| Token used twice | "This invite link has already been used" |
| Email already registered | 409: "Account already exists" |
| Email send fails | Log error, don't fail approval. Admin can re-send. |

---

## Implementation Sequence (18 PRs)

Small, focused PRs — each touches only a few files.

### Backend PRs

| PR | Branch | Scope | Key Files |
|----|--------|-------|-----------|
| 1 | `feature/teacher-app-model` | `TeacherApplication` SQLAlchemy model + Alembic migration | `models/teacher_application.py`, `models/__init__.py`, migration file |
| 2 | `feature/invite-token-model` | `InviteToken` SQLAlchemy model + Alembic migration | `models/invite_token.py`, `models/__init__.py`, migration file |
| 3 | `feature/create-admin-cli` | `create_admin` CLI command | `cli/__init__.py`, `cli/create_admin.py` |
| 4 | `feature/role-dependencies` | `require_admin` and `require_teacher` FastAPI dependencies | `dependencies/roles.py` |
| 5 | `feature/application-schemas` | Pydantic request/response schemas for applications | `schemas/application.py` |
| 6 | `feature/invite-service` | Invite token generation, validation, consumption logic | `services/invite_service.py` |
| 7 | `feature/application-routes` | Public application endpoints (submit + check status) | `routers/applications.py`, `main.py` |
| 8 | `feature/admin-routes` | Admin endpoints (list, detail, approve, reject, resend) | `routers/admin.py`, `main.py` |
| 9 | `feature/modify-auth-register` | Add `invite_token` to register + `validate-invite` endpoint | `routers/auth.py`, `schemas/auth.py`, `services/auth_service.py` |
| 10 | `feature/email-service` | Resend email service (received, approved, rejected emails) | `services/email_service.py`, `config.py`, wire into routers |

### Frontend PRs

| PR | Branch | Scope | Key Files |
|----|--------|-------|-----------|
| 11 | `feature/form-textarea` | `FormTextarea` component + tests | `src/components/common/FormTextarea/` |
| 12 | `feature/form-radio-group` | `FormRadioGroup` component + tests | `src/components/common/FormRadioGroup/` |
| 13 | `feature/modal-status-badge` | `Modal` + `StatusBadge` components + tests | `src/components/common/Modal/`, `src/components/common/StatusBadge/` |
| 14 | `feature/become-a-teacher-page` | `/become-a-teacher` application form page + `applicationService.ts` + types | `app/become-a-teacher/`, `src/views/BecomeATeacher/`, `src/services/applicationService.ts`, `src/types/index.ts` |
| 15 | `feature/application-status-page` | `/application-status` status check page | `app/application-status/`, `src/views/ApplicationStatus/` |
| 16 | `feature/admin-shell` | Admin layout (sidebar + header + role guard) + `adminService.ts` | `app/admin/layout.tsx`, `src/views/Admin/AdminLayout/`, `src/components/admin/`, `src/services/adminService.ts` |
| 17 | `feature/admin-teacher-requests` | Admin teacher requests list + detail + actions | `app/admin/teacher-requests/`, `src/views/Admin/TeacherRequests/`, `src/views/Admin/TeacherRequestDetail/`, `src/components/admin/ApplicationActions/` |
| 18 | `feature/invite-signup-onboarding` | Modified `/signup` (invite token handling) + `/teacher/onboarding` page | `src/views/Signup/index.tsx`, `src/services/authService.ts`, `src/context/AuthContext.tsx`, `app/teacher/onboarding/`, `src/views/Teacher/Onboarding/` |

---

## Verification

1. Submit application at `/become-a-teacher` → confirm DB row created, email received
2. Login as admin → `/admin/teacher-requests` → application appears in list
3. Approve → confirm invite token in DB, approval email received with link
4. Click invite link → `/signup?invite=...` → email pre-filled and locked
5. Complete signup → confirm user created with role=teacher, token consumed, app status=registered
6. Redirected to `/teacher/onboarding` → complete profile
7. Test rejection flow → rejection email, no invite link, status shows rejected
8. Test security: use expired token, wrong email, already-used token → all fail gracefully
9. Test re-send invite → old token invalidated, new email sent
10. `npm run lint && npm run build && npm test` — all pass
