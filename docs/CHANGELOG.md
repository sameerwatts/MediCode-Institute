# Changelog

All notable changes to MediCode Institute will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/)

---

## [Unreleased]

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
- `docs/become-a-teacher-architecture.md` — complete 19-PR architecture plan for gated teacher onboarding pipeline (application form → admin review → invite token → teacher signup → onboarding)
- Full API request/response schemas for all 11 endpoints (public, admin, modified auth)
- Admin pagination specification (10/page, newest first, searchable by name/email, status filter)
- Admin notification email on new teacher applications (sent to all admin-role users from DB)

### Changed
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
