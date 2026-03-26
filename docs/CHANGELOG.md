# Changelog

All notable changes to MediCode Institute will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/)

---

## [Unreleased]

## [feature/fetch-teachers-from-db] — 2026-03-26

### Added
- `GET /api/teachers` public backend endpoint — joins `users` (role=teacher) with `teacher_applications` (status=registered) to serve teacher profiles
- `teacher.py` Pydantic schema, `teacher_public_service.py` service, `teachers.py` router (backend)
- `listTeachers()` in `teacherService.ts` (frontend)

### Changed
- About page "Meet Our Team" section now fetches teachers from the database instead of static frontend data
- About page converted to client component with loading, error, and empty states
- About tests updated to mock API calls — 424 total passing

## [improvement/autofill-teacher-application] — 2026-03-24

### Changed
- Teacher application form auto-fills Full Name and Email Address for logged-in students (read-only, cannot be changed)
- 3 new tests for autofill behavior — 421 total passing

## [feature/forgot-password] — 2026-03-23

### Added
- Password reset flow — "Forgot your password?" link on login page, email-based reset via Resend
- `PasswordResetToken` model + Alembic migration — single-use, 15-minute expiry tokens
- `password_reset_service.py` — token generation, validation, consumption (follows InviteToken pattern)
- `send_password_reset()` in email service — styled HTML email with reset button via Resend
- `POST /api/auth/forgot-password` — public endpoint, prevents user enumeration with generic response
- `POST /api/auth/reset-password` — validates token, hashes new password, marks token used
- `/forgot-password` page — email form with success/error states
- `/reset-password` page — token validation, password + confirm form, auto-redirect to login
- `forgotPassword()` and `resetPassword()` in `authService.ts`
- 10 new frontend tests (ForgotPassword + ResetPassword views) — 418 total passing

## [feature/parallax-homepage] — 2026-03-23

### Added
- Parallax scrolling effect on homepage — Hero, Stats, and CTA sections now have fixed background images with dark overlays
- Scroll-reveal animations — Features, Popular Courses, Categories, and Teacher CTA sections fade/slide into view on scroll
- Reusable `ParallaxSection` and `ScrollReveal` components + `useScrollReveal` hook
- 3 high-quality Unsplash background images (medical tech, library, students collaborating)
- Mobile fallback for iOS Safari (disables `background-attachment: fixed`)
- IntersectionObserver mock in test setup for compatibility

## [improvement/hide-quiz-blog-pages] — 2026-03-21

### Changed
- Temporarily hidden Quiz and Blog pages from navigation (navbar, footer) and routes (return 404)
- All quiz/blog code preserved in comments with TODO markers for future re-enabling

## [feature/courses-listing-api-integration] — 2026-03-21

### Changed
- Courses listing page (`/courses`) now fetches published courses from the API instead of showing static dummy data
- Each course card links to `/courses/[slug]` detail page where students can enroll
- Category filter (All / Medical / CS) sends filter param to API
- Courses without thumbnails show a gradient placeholder with first letter
- Loading and error states added to courses listing
- 13 new tests (replaced 6 dummy-data tests) — 407 total passing

## [improvement/content-page-publish-button] — 2026-03-20

### Changed
- Added publish/unpublish toggle and status badge to course content management page header — teachers can publish directly while editing content without navigating back to Edit Details

## [fix/tiptap-ssr-hydration] — 2026-03-20

### Fixed
- TipTap editor and renderer crash on SSR/hydration — added `immediatelyRender: false` to both `TipTapEditor` and `TipTapRenderer` `useEditor` calls

## [fix/teacher-dashboard-nav-link] — 2026-03-20

### Fixed
- Missing "Teacher Dashboard" navigation link for teacher-role users in desktop Navbar and mobile sidebar
- Added 6 new tests for teacher nav link visibility (3 Navbar + 3 AppSidebar)

## [feature/subtopic-reader-page] — 2026-03-20

### Added
- Subtopic reader page (`src/views/Courses/SubtopicReader/`) — enrollment-gated lesson viewer with breadcrumb, topic label, numbered title, prev/next lesson navigation
- `TipTapRenderer` component (`src/components/course/TipTapRenderer/`) — read-only TipTap renderer with syntax highlighting, images, and tables
- Dynamic route `app/(public)/courses/[slug]/learn/[subtopicId]/page.tsx` for lesson pages
- 15 new tests (3 TipTapRenderer + 12 SubtopicReader) — 393 total passing
- PR 27/27 of course management feature — **Course Management System complete!**

## [feature/course-detail-enrollment] — 2026-03-20

### Added
- Course detail page (`src/views/Courses/CourseDetail/`) — public course info with category badge, teacher name, topic/lesson counts, thumbnail, breadcrumb navigation
- `TopicAccordion` component (`src/components/course/TopicAccordion/`) — expandable topic list with subtopic access (locked for guests, "Read" links for enrolled students)
- Enrollment flow — guests redirected to login, authenticated users enroll for free, enrolled badge displays enrollment date
- Dynamic route `app/(public)/courses/[slug]/page.tsx` for public course pages
- 22 new tests (8 TopicAccordion + 14 CourseDetail) — 378 total passing
- PR 26/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/auto-save-image-upload] — 2026-03-19

### Added
- `useAutoSave` hook (`src/hooks/useAutoSave.ts`) — generic debounced auto-save with status tracking (idle/saving/saved/error)
- Image upload in TipTap editor — toolbar button opens file picker, plus drag-and-drop and paste support via `onImageUpload` prop
- `SaveStatusIndicator` component — persistent "Saving..." / "All changes saved" / "Save failed" indicator
- "Manage Content" link on edit course page → navigates to content management page
- PR 25/27 of course management feature (see `docs/course-management-architecture.md`)

### Changed
- `CourseForm` (edit mode) — replaced Save button with auto-save on field change (~1s debounce), save status in header
- `CourseContent` — content editor uses auto-save instead of immediate save on every keystroke
- `TipTapEditor` — accepts `onImageUpload` prop for file-based image insertion
- `TipTapToolbar` — Image button triggers file upload when `onImageUpload` available, falls back to URL prompt

## [feature/course-content-page] — 2026-03-19

### Added
- Course content management page (`src/views/Teacher/CourseContent/`) — topic tree sidebar + TipTap editor pane
- Topic CRUD: inline add/edit/delete topics with keyboard support (Enter to save, Escape to cancel)
- Subtopic CRUD: inline add/edit/delete subtopics, click to select and open in editor
- Content editing: TipTap editor loads subtopic content, saves on update
- `app/teacher/courses/[courseId]/content/page.tsx` route
- PR 24/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/tiptap-editor] — 2026-03-19

### Added
- `TipTapEditor` component (`src/components/course/TipTapEditor/`) — rich text editor with JSON output for course content authoring
- `TipTapToolbar` — formatting toolbar with bold, italic, strike, code, headings (H1–H3), lists, blockquote, code block (with syntax highlighting via lowlight), table, image insert, horizontal rule, undo/redo
- TipTap dependencies: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-code-block-lowlight`, `@tiptap/extension-table` (+ row/cell/header), `lowlight`
- `@tailwindcss/typography` plugin for `prose` styling in editor content area
- PR 23/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/edit-course-publish] — 2026-03-19

### Changed
- `CourseForm` now supports edit mode — accepts optional `courseId` prop, loads existing course data, saves changes via `updateCourse()`
- Publish/unpublish toggle button with status badge in edit mode header

### Added
- `app/teacher/courses/[courseId]/page.tsx` — dynamic route for editing a course
- PR 22/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/create-course-form] — 2026-03-19

### Added
- Create course form (`src/views/Teacher/CourseForm/`) — React Hook Form + Zod validation, title, description, category, optional thumbnail URL
- `app/teacher/courses/new/page.tsx` route
- PR 21/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/teacher-courses-list] — 2026-03-19

### Added
- Teacher courses list page (`src/views/Teacher/CoursesList/`) — status filter, course cards with thumbnails and badges, pagination, empty state
- `app/teacher/courses/page.tsx` route
- PR 20/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/teacher-dashboard-home] — 2026-03-19

### Added
- Teacher dashboard page (`src/views/Teacher/Dashboard/`) — stat cards for total/published/draft courses, quick action links
- `app/teacher/page.tsx` route
- PR 19/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/teacher-layout-sidebar] — 2026-03-19

### Added
- `teacher` variant in AppSidebar with Dashboard + My Courses navigation
- TeacherHeader component (`src/components/teacher/TeacherHeader/`)
- TeacherLayout view (`src/views/Teacher/TeacherLayout/`) — role-gated shell with sidebar + header
- `app/teacher/layout.tsx` route layout
- PR 18/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/frontend-api-services] — 2026-03-19

### Added
- Public/student course API service (`src/services/courseService.ts`) — list, detail, enroll, enrollment status, subtopic content
- Teacher course API service (`src/services/teacherCourseService.ts`) — course CRUD, publish/unpublish, topic CRUD, subtopic CRUD, image upload
- PR 17/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/course-types] — 2026-03-19

### Added
- Course management TypeScript types in `src/types/index.ts` — ICourseSummary, ICourseDetail, ICourseTeacherDetail, ITopicDetail, ITopicTeacherDetail, ISubtopicSummary, ISubtopicContent, IEnrollment, IPaginatedCourses
- PR 16/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/image-upload-endpoint] — 2026-03-19

### Added
- `POST /api/teacher/upload-image` endpoint in `backend/app/routers/teacher.py` — validates file type + size (5 MB max), uploads to Supabase Storage, returns public URL
- PR 15/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/supabase-storage-service] — 2026-03-19

### Added
- Supabase Storage settings in `backend/app/config.py` — `supabase_url`, `supabase_service_role_key`, `supabase_storage_bucket`
- Storage service (`backend/app/services/storage_service.py`) — upload images to Supabase Storage, return public URLs
- Updated `.env.example` with Supabase Storage env vars
- PR 14/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/enrollment-subtopic-content-endpoints] — 2026-03-19

### Added
- Enrollment + subtopic content endpoints in `backend/app/routers/courses.py` — enroll, check enrollment status, get subtopic content (with enrollment + course membership verification)
- PR 13/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/public-course-endpoints] — 2026-03-19

### Added
- Public course router (`backend/app/routers/courses.py`) — list published courses (paginated, filterable, searchable) and course detail with teacher name + TOC
- Registered courses router in `backend/app/main.py`
- PR 12/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/teacher-topic-subtopic-endpoints] — 2026-03-19

### Added
- Teacher topic + subtopic endpoints in `backend/app/routers/teacher.py` — create/update/delete topics and subtopics with ownership verification up the chain
- PR 11/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/teacher-course-endpoints] — 2026-03-19

### Added
- Teacher course CRUD router (`backend/app/routers/teacher.py`) — create, list, detail, update, delete, publish, unpublish endpoints with role + ownership enforcement
- Registered teacher router in `backend/app/main.py`
- PR 10/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/public-queries-enrollment-service] — 2026-03-19

### Added
- Public query functions in `course_service.py` — list published courses (paginated, filterable, searchable), get course by slug, get full detail with teacher name + nested TOC, get subtopic content
- Enrollment functions in `course_service.py` — enroll student, check enrollment status
- PR 9/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/topic-subtopic-crud-service] — 2026-03-19

### Added
- Topic CRUD functions in `course_service.py` — create (auto-ordered), get by ID, update, delete, list by course
- Subtopic CRUD functions in `course_service.py` — create (auto-ordered), get by ID, update (title/content/order), delete, list by topic
- PR 8/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/course-crud-service] — 2026-03-19

### Added
- Course CRUD service (`backend/app/services/course_service.py`) — create, read, update, delete courses with slug generation, ownership verification, pagination, publish/unpublish
- PR 7/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/enrollment-schemas] — 2026-03-19

### Added
- Enrollment Pydantic schemas in `backend/app/schemas/course.py`
- `EnrollResponse`: success message + enrolled_at timestamp
- `EnrollmentStatusResponse`: enrolled boolean + optional enrolled_at
- PR 6/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/course-topic-subtopic-schemas] — 2026-03-19

### Added
- Pydantic schemas for Course, Topic, and Subtopic APIs (`backend/app/schemas/course.py`)
- Course schemas: create/update requests, paginated list response, public detail (TOC), teacher detail (full content), create/publish responses
- Topic schemas: create/update requests, summary, detail with subtopics, teacher detail with full content
- Subtopic schemas: create/update requests, summary (TOC), detail with JSONB content
- PR 5/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/enrollment-model] — 2026-03-19

### Added
- `Enrollment` SQLAlchemy model (`backend/app/models/enrollment.py`) — `enrollments` table with UUID PK, student_id FK→users, course_id FK→courses, enrolled_at timestamp
- UNIQUE constraint on (student_id, course_id) to prevent duplicate enrollments
- Alembic migration `create_enrollments_table`
- Registered Enrollment model in `backend/app/models/__init__.py`
- PR 4/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/subtopic-model] — 2026-03-19

### Added
- `Subtopic` SQLAlchemy model (`backend/app/models/subtopic.py`) — `subtopics` table with UUID PK, topic_id FK→topics (CASCADE delete), title, JSONB content for TipTap rich text, order (default 0), timestamps
- Alembic migration `create_subtopics_table` — creates subtopics table with composite index on (topic_id, order) for efficient ordered listing
- Registered Subtopic model in `backend/app/models/__init__.py`
- PR 3/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/topic-model] — 2026-03-19

### Added
- `Topic` SQLAlchemy model (`backend/app/models/topic.py`) — `topics` table with UUID PK, course_id FK→courses (CASCADE delete), title, order (default 0), timestamps
- Alembic migration `create_topics_table` — creates topics table with composite index on (course_id, order) for efficient ordered listing
- Registered Topic model in `backend/app/models/__init__.py`
- PR 2/27 of course management feature (see `docs/course-management-architecture.md`)

## [feature/course-model] — 2026-03-19

### Added
- `Course` SQLAlchemy model (`backend/app/models/course.py`) — `courses` table with UUID PK, teacher_id FK→users, title, slug (unique indexed), description, category (medical/cs), thumbnail_url, status (draft/published), timestamps
- Alembic migration `create_courses_table` — creates courses table with CHECK constraints on category and status, unique slug index, FK to users
- Registered Course model in `backend/app/models/__init__.py` and `backend/alembic/env.py`
- PR 1/27 of course management feature (see `docs/course-management-architecture.md`)

## [fix/invite-upgrade-student-to-teacher] — 2026-03-18

### Fixed
- Existing students can now accept teacher invite without "email already exists" error — role is upgraded from student to teacher instead of blocking registration

## [fix/hide-teacher-links-by-role] — 2026-03-18

### Fixed
- Footer "Become a Teacher" link hidden for teachers and admins
- Home "Share Your Expertise" CTA section hidden for teachers and admins

### Changed
- Extracted `TeacherCTASection` client component from `Home/index.tsx` (keeps Home as server component)
- Footer converted to client component to support `useAuth` hook

## [fix/redirect-teacher-admin-from-apply] — 2026-03-18

### Fixed
- Teachers and admins navigating to `/become-a-teacher` are now redirected to home page

## [fix/application-rejection-cooldown] — 2026-03-18

### Fixed
- `POST /api/applications` now enforces a 60-second cooldown after rejection before the same email can re-apply (returns 429)

## [fix/block-teacher-admin-applications] — 2026-03-18

### Added
- `rejection_cooldown_seconds` config setting (default 60s) in `backend/app/config.py`

### Fixed
- `POST /api/applications` now rejects submissions from emails already registered as teacher or admin (returns 403)

## [fix/admin-mobile-responsive] — 2026-03-08

### Fixed
- Admin panel mobile layout: collapsible sidebar with PageShiftWrapper-style animation (translateX(80vw), shadow, border-radius) matching regular mobile nav
- Admin Dashboard link missing from mobile nav drawer (SidebarDrawer) — now visible for admin users with correct active state via `pathname.startsWith('/admin')`
- TeacherRequests and StudentsList tables now horizontally scrollable on mobile (`overflow-x-auto`, `min-w` on table)
- Search inputs now full-width on mobile (`flex-1`), fixed width on desktop (`md:w-64 md:flex-none`)
- Admin sidebar was independently scrollable — removed `overflow-y-auto` from nav to match regular sidebar behavior
- Main page content locked (non-scrollable) when admin sidebar is open
- Hamburger button in AdminHeader now `w-12 h-12` matching regular Navbar hamburger size

### Added
- AdminHeader: hamburger button (mobile-only) with `onToggleSidebar` prop
- Mobile-First Responsive Design section added to `docs/CLAUDE.md` with 8 specific rules for tables, search inputs, filter buttons, and admin layout

### Added
- `TeacherApplication` SQLAlchemy model (`backend/app/models/teacher_application.py`) — `teacher_applications` table with UUID PK, applicant fields (name, email, phone, subject_area, qualifications, experience_years, teaching_philosophy), status tracking (pending/approved/rejected/registered), admin review fields, and FK references to `users` table
- Alembic migration for `teacher_applications` table with CHECK constraints on `subject_area` and `status`, email index, and foreign keys to `users`
- `InviteToken` SQLAlchemy model (`backend/app/models/invite_token.py`) — `invite_tokens` table with UUID PK, 64-char unique token, email, FK to `teacher_applications`, expiry timestamp, and used_at tracking
- Alembic migration for `invite_tokens` table with unique token index and FK to `teacher_applications`
- `create_admin` CLI command (`backend/app/cli/create_admin.py`) — server-side only script to provision admin accounts via `python -m app.cli.create_admin --name --email --password`; uses bcrypt hashing, duplicate email check, min 8-char password validation
- `require_admin` and `require_teacher` FastAPI dependencies (`backend/app/dependencies/roles.py`) — role-based access control that builds on `get_current_user`; returns 403 Forbidden if authenticated user lacks the required role
- Pydantic request/response schemas for teacher applications (`backend/app/schemas/application.py`) — covers submit, status check, admin list/detail/approve/reject/resend, and invite token validation
- Invite token service (`backend/app/services/invite_service.py`) — generate (256-bit cryptographic token, 72h expiry, auto-invalidates old tokens), validate (checks expired/used/invalid), and consume (marks as used) logic
- Public application API routes (`backend/app/routers/applications.py`) — `POST /api/applications` (submit with duplicate-pending/approved checks) and `GET /api/applications/status` (check by email + application_id)
- Admin application API routes (`backend/app/routers/admin.py`) — 5 endpoints: paginated list (search by name/email, filter by status, 10/page), full detail (with invite token status), approve (generates invite token), reject (optional reason), resend invite (invalidates old token)
- `docs/become-a-teacher-architecture.md` — complete 19-PR architecture plan for gated teacher onboarding pipeline (application form → admin review → invite token → teacher signup → onboarding)
- Full API request/response schemas for all 11 endpoints (public, admin, modified auth)
- Admin pagination specification (10/page, newest first, searchable by name/email, status filter)
- Admin notification email on new teacher applications (sent to all admin-role users from DB)
- `GET /api/auth/validate-invite?token=` endpoint — read-only invite token validation, returns applicant name/email if valid or reason (expired/used/invalid) if not
- Email service (`backend/app/services/email_service.py`) using Resend Python SDK — 4 email functions: application received (to applicant), new application (to all admins), application approved (invite link with 72h expiry), application rejected (with optional reason); all fire-and-forget (failures logged, never block the operation)
- `resend_api_key`, `email_from`, and `frontend_url` settings in `config.py` + `.env.example` — empty API key disables emails in development
- `FormTextarea` component (`src/components/common/FormTextarea/`) — textarea with label, error state, character count, configurable rows and maxLength; follows FormInput pattern with Tailwind styling
- 14 new tests for `FormTextarea` — total now 191 tests across 28 suites
- `FormRadioGroup` component (`src/components/common/FormRadioGroup/`) — radio button group with fieldset/legend, error state, configurable options array; follows FormInput pattern with Tailwind styling
- 10 new tests for `FormRadioGroup` — total now 201 tests across 29 suites
- `Modal` component (`src/components/common/Modal/`) — accessible dialog with backdrop overlay, title, children slot, confirm/cancel actions, configurable confirm variant (primary/danger); closes on backdrop or X button click
- `StatusBadge` component (`src/components/common/StatusBadge/`) — colored pill badge for application statuses: pending (yellow), approved (green), rejected (red), registered (blue)
- 21 new tests for `Modal` + `StatusBadge` — total now 222 tests across 31 suites
- `/become-a-teacher` page (`app/become-a-teacher/`, `src/views/BecomeATeacher/`) — public application form (RHF + Zod) with 7 fields: name, email, phone, subject area (radio), experience years, qualifications, teaching philosophy; shows success card with application ID on submit, server error banner on failure
- `applicationService.ts` (`src/services/applicationService.ts`) — `submitApplication()` and `checkApplicationStatus()` API calls (axios, follows authService pattern)
- Types added to `src/types/index.ts` — `TApplicationStatus`, `TSubjectArea`, `ITeacherApplication`, `IApplicationSubmitResponse`, `IApplicationStatusCheck`, `IInviteValidation`
- Footer updated with "Become a Teacher" link under Quick Links
- Home page updated with "Share Your Expertise" CTA section linking to `/become-a-teacher`
- 13 new tests for `BecomeATeacher` — total now 235 tests across 32 suites
- `/application-status` page (`app/application-status/`, `src/views/ApplicationStatus/`) — status check form (email + application ID); shows `StatusBadge`, status message, submitted/reviewed dates; server error banner on not-found or API errors; link back to `/become-a-teacher`
- 13 new tests for `ApplicationStatus` — total now 248 tests across 33 suites
- Admin shell (`app/admin/layout.tsx`, `src/views/Admin/AdminLayout/`) — full-viewport fixed layout (covers main Navbar/Footer), role guard redirects non-admins to `/login`, renders `AdminSidebar` + `AdminHeader` + page content
- `AdminSidebar` component — dark sidebar with MediCode brand, Teacher Requests nav link (active-state highlight), Sign Out button
- `AdminHeader` component — top bar with user initial avatar + name
- `app/admin/page.tsx` — redirects `/admin` → `/admin/teacher-requests`
- `adminService.ts` — 5 API functions: `getApplications()`, `getApplicationDetail()`, `approveApplication()`, `rejectApplication()`, `resendInvite()`
- Admin types added to `src/types/index.ts`: `IAdminApplicationListItem`, `IAdminApplicationDetail`, `IPaginatedApplications`, `IApproveResponse`, `IRejectResponse`, `IResendInviteResponse`
- 16 new tests for admin shell components — total now 265 tests across 36 suites
- `TeacherRequests` view (`src/views/Admin/TeacherRequests/`) — paginated table of teacher applications with search by name/email, status filter tabs (All / Pending / Approved / Rejected / Registered), Previous/Next pagination, and per-row View link
- `TeacherRequestDetail` view (`src/views/Admin/TeacherRequestDetail/`) — full applicant profile card (name, email, phone, subject, experience, qualifications, teaching philosophy, admin notes, invite expiry); shows `StatusBadge`; refresh on action; Back to requests link
- `ApplicationActions` component (`src/components/admin/ApplicationActions/`) — approve (pending → sends invite), reject with optional reason textarea, resend invite (approved → new token); each action guarded by a `Modal` confirmation; inline success/error messages
- `app/admin/teacher-requests/page.tsx` — `/admin/teacher-requests` list route (static)
- `app/admin/teacher-requests/[id]/page.tsx` — `/admin/teacher-requests/:id` dynamic detail route
- 28 new tests for admin dashboard components — total now 293 tests across 39 suites
- `validateInviteToken(token)` function in `src/services/authService.ts` — GET `/api/auth/validate-invite?token=`, returns `IInviteValidation`; gracefully returns `{ valid: false, reason: 'invalid' }` on API errors
- `signup()` in `authService.ts` updated to accept optional `inviteToken?: string`; if present, sends `invite_token` field in the register request body
- `AuthContext.signup` updated to accept and forward optional `inviteToken?` to `apiSignup()`
- `IAuthContext.signup` type updated with optional `inviteToken?` parameter
- `app/signup/page.tsx` wrapped in `<Suspense>` to support `useSearchParams()` in the client component
- `/signup` invite token flow — detects `?invite=<token>` in URL, validates the token via API, then: **valid token** → shows "Complete Your Registration" form with name+email pre-filled (locked, readOnly) and includes token in register request, redirects to `/teacher/onboarding` on success; **invalid/expired/used token** → hides form entirely, shows inline error card (title + detail message) with a "Check Application Status" link to `/application-status`
- 13 new tests for invite signup flow across 4 describe blocks (valid token, expired, used, invalid) — total now 306 tests across 39 suites
- `src/services/teacherService.ts` — `submitOnboarding(data: IOnboardingData)` API function calling `POST /api/teacher/onboarding`; swap-ready for real FastAPI backend + Supabase Storage photo upload
- `app/teacher/onboarding/page.tsx` — `/teacher/onboarding` App Router page (static)
- `src/views/Teacher/Onboarding/index.tsx` — Profile enrichment form: circular photo upload button with local preview (`URL.createObjectURL`), Designation text field, Department radio group (Medical Sciences / Computer Science), Bio textarea (20–500 chars); client-side auth guard (redirects to `/login` if unauthenticated); success card with "Go to Dashboard" link on submission
- 15 new tests for TeacherOnboarding — total now **321 tests across 40 suites**

### Changed
- Application submission (`POST /api/applications`) now sends confirmation email to applicant and notification emails to all admin users
- Admin approve/reject/resend-invite endpoints now send corresponding emails to applicants (replaced TODO comments)
- `POST /api/auth/register` now accepts optional `invite_token` field — if present, validates the token, enforces email match, sets role to `teacher`, consumes the token, and links user to the application (status→registered)
- `create_user()` in `auth_service.py` now accepts optional `role` parameter (defaults to `student`)
- `RegisterRequest` schema updated with optional `invite_token: str` field
- Moved all project docs (CLAUDE.md, architecture.md, brainstorm.md, deployment-workflow.md, project_status.md, CHANGELOG.md, vercel-deployment-plan.md) from project root into `docs/` folder — README.md stays at root
- Fixed `.env.example` link in CLAUDE.md to point to `../backend/.env.example`
- **Replaced Cloudinary with Supabase Storage** for all file storage (teacher photos, future CV uploads) across all docs, config, and architecture files
- Split PR 18 into PR 18 (invite signup flow) + PR 19 (teacher onboarding with Supabase Storage photo upload)
- Updated `next.config.ts` image hostname from `res.cloudinary.com` to `*.supabase.co`

---

## [0.3.0] - 2026-02-27

### Added
- Custom brand favicon (`app/icon.svg`) — rounded square with blue→green diagonal gradient (`#2563EB`→`#10B981`) and bold white "MC" initials; auto-detected by Next.js App Router
- `icons` field added to `metadata` in `app/layout.tsx` for explicit favicon declaration
- 39 new tests covering 7 previously untested components: `HeroSection`, `FeaturesSection`, `StatsSection`, `CTASection`, `WelcomeBanner`, `PageShiftWrapper`, `SidebarDrawer` — total now 177 tests across 27 suites

### Changed
- `deployment-workflow.md` — added Step 3 (Update Changelog & Project Status before every push), fixed duplicate Step 6 numbering, updated Quick Reference to 17 steps

---

### Added
- Mock auth layer (`src/services/authService.ts`) — localStorage-backed login/signup, drop-in ready for real FastAPI + Axios
- `AuthContext` + `AuthProvider` — global user state with `isLoading` guard, login/signup/logout
- `useAuth` hook — typed `IAuthContext` wrapper around `AuthContext`
- `FormInput` component — reusable labeled input with error state and password show/hide toggle
- `/login` page — React Hook Form + Zod validation, server error banner, redirects to home on success
- `/signup` page — 4-field form (name, email, password ≥8 chars, confirm), auto-login on success, redirects to home
- `/dashboard` page — protected client page with auth guard (redirects to `/login` if unauthenticated)
- `WelcomeBanner` component — client component that shows "Welcome back, {first name}!" at the top of the home page when authenticated
- Auth-aware Navbar — Login + Sign Up buttons when unauthenticated; user name + Sign Out when logged in (desktop + mobile)
- `IUser` and `IAuthContext` types added to `src/types/index.ts`
- 48 new tests (138 total across 20 suites)

### Changed
- After login or signup, users are redirected to `/` (home) instead of `/dashboard`
- Already-authenticated users visiting `/login` or `/signup` are redirected to `/`
- `app/layout.tsx` — wrapped body with `AuthProvider`
- `src/test-utils.tsx` — render wrapper now includes `AuthProvider`
- `src/setupTests.ts` — `beforeEach(() => localStorage.clear())` to isolate auth state between tests

## [0.2.1] - 2026-02-20

### Added
- `vercel-deployment-plan.md` — one-time Vercel account setup guide, env vars, domain config, and dashboard reference
- GitHub Actions CI pipeline (`.github/workflows/ci.yml`) — runs lint → build → test on every PR push (Node 20, npm ci)
- `deployment-workflow.md` — step-by-step process: feature branch → CI → Vercel Preview → owner approval → production merge

### Fixed
- Next.js `<Image>` config now allows SVG images from `placehold.co` (previously blocked by missing `dangerouslyAllowSVG` setting)
- Replaced remaining `<img>` tags with Next.js `<Image />` to resolve lint warnings

### Infrastructure
- **Vercel production deployment live** — static site auto-deployed from `main` branch
- **End-to-end deployment workflow validated** — feature branch → CI (3/3 green) → Vercel Preview auto-created → Playwright checks passed → PR closed without merge (test only)

## [0.2.0] - 2026-02-18

### Changed
- **Migrated from Create React App to Next.js 15** (App Router)
- **Replaced styled-components with Tailwind CSS** (zero-runtime, SSR-safe)
- Upgraded TypeScript from v4 to v5 (enables `moduleResolution: "bundler"`)
- Replaced react-router-dom with Next.js file-system routing
- Replaced `baseUrl: "src"` with `@/*` path alias
- Renamed `src/pages/` to `src/views/` to avoid Next.js Pages Router conflict
- All components rewritten with Tailwind utility classes
- Navbar and Footer use `next/link` instead of react-router-dom `Link`
- Navbar uses `usePathname` from `next/navigation` for active link

### Added
- `app/` directory with App Router pages (layout.tsx, page.tsx, courses/, about/, quiz/, blogs/, not-found.tsx)
- Root layout with metadata, Navbar, and Footer
- Per-page metadata for SEO (title, description)
- Tailwind config mapping full design system (colors, typography, spacing, shadows)
- Jest standalone config with Babel transforms and Next.js mocks
- next/link, next/image, next/navigation test mocks

### Removed
- Create React App (react-scripts)
- styled-components and all styles.ts files
- react-router-dom
- web-vitals
- ScrollToTop component (Next.js handles natively)
- CRA public files (index.html, manifest.json, logos)
- Old App.tsx, index.tsx entry points
- styles/ directory (GlobalStyle, theme, media, styled.d.ts)

## [0.1.1] - 2026-02-17

### Added
- 90 tests across 16 test suites (React Testing Library + Jest)
- Project documentation updates (brainstorm, architecture, CLAUDE.md, changelog, project_status)

## [0.1.0] - 2026-02-17

### Added
- React + TypeScript project bootstrapped with Create React App
- Installed dependencies: styled-components, react-router-dom, formik, yup, axios
- TypeScript strict mode with baseUrl configured
- **Type system:** ICourse, ITeacher, IBlog, IQuiz, IQuizQuestion, INavLink interfaces
- **Theme:** Color palette, breakpoints, typography scale, spacing, shadows, border radii
- **Global styles:** CSS reset, Inter font import, base body styles
- **Utility helpers:** formatPrice (INR), formatDate, truncateText
- **Dummy data:** 4 teachers, 6 courses, 4 quizzes, 5 blog posts
- **Shared components:**
  - Button (primary/secondary/outline variants, sm/md/lg sizes)
  - Card (generic wrapper with image support)
  - SectionHeading (title + optional subtitle)
  - Loader (spinner for Suspense fallback)
  - Navbar (sticky, logo, nav links, mobile hamburger menu, active link highlighting)
  - Footer (multi-column layout, copyright)
  - PageWrapper (max-width container)
  - CourseCard (thumbnail, category badge, teacher info, price)
- **App shell:** ThemeProvider, GlobalStyle, BrowserRouter, lazy-loaded routes with Suspense
- **Pages:**
  - Home — Hero banner, features grid, popular courses, category cards, stats, CTA
  - Courses — Category filter tabs (All/Medical/CS), responsive course grid
  - About — Mission/vision, offerings grid, team member cards, contact CTA
  - Quiz — Quiz listing with category and difficulty badges
  - Blog — Category filter tabs (All/Medical/CS/General), blog card grid
  - 404 Not Found — Centered error display with Go Home button
- Mobile-first responsive design across all pages
- Zero build errors, zero lint errors
