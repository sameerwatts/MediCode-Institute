# MediCode Institute — Project Status

## Current Phase
**Become a Teacher Feature** — PR 18 of 19: Invite signup flow.

## Current Branch
`feature/invite-signup-flow` — Modified /signup with invite token detection + error card (PR 18/19).

## What's Done
- [x] Git repo initialized and pushed to GitHub (SSH)
- [x] GitHub CLI (`gh`) installed and authenticated
- [x] brainstorm.md — Vision, features, tech stack, monetization, decisions finalized
- [x] architecture.md — System design, DB schema, API design, project structure, security, deployment
- [x] CLAUDE.md — Project guidelines
- [x] .env.example — Environment variable template for all services
- [x] .gitignore — Protects credentials and build artifacts
- [x] CHANGELOG.md — Release changelog (updated after every PR merge)
- [x] deployment-workflow.md — Full feature → CI → Preview → Production process
- [x] vercel-deployment-plan.md — One-time Vercel setup guide
- [x] **GitHub Actions CI** — lint → build → test runs automatically on every PR (Node 20)
- [x] **Vercel production deployment** — auto-deploys on merge to `main`
- [x] **End-to-end pipeline validated** — branch → CI (3/3 green) → Vercel Preview auto-created → Playwright checks passed
- [x] **Next.js 15 App Router** with file-system routing (app/ directory)
- [x] **Tailwind CSS** replacing styled-components (zero runtime CSS)
- [x] **TypeScript 5** with strict mode, bundler module resolution, @/* path alias
- [x] Types/interfaces defined (ICourse, ITeacher, IBlog, IQuiz, INavLink)
- [x] Tailwind theme mapping all design tokens (colors, typography, spacing, shadows)
- [x] Global styles with CSS reset and Inter font
- [x] Dummy data (4 teachers, 6 courses, 4 quizzes, 5 blogs)
- [x] Shared components (Button, Card, SectionHeading, Loader, Navbar, Footer, PageWrapper, CourseCard)
- [x] Root layout with Navbar + Footer
- [x] Home page — Hero, Features, Popular Courses, Categories, Stats, CTA (Server Component)
- [x] Courses page — Category filter tabs + course grid (Client Component)
- [x] About page — Mission/Vision, What We Offer, Team grid, Contact CTA (Server Component)
- [x] Quiz page — Quiz listing grid with category/difficulty badges (Server Component)
- [x] Blog page — Category filter tabs + blog card grid (Client Component)
- [x] 404 Not Found page
- [x] Mobile-responsive Navbar with hamburger menu (Client Component)
- [x] 90 tests passing with Jest + React Testing Library (16 suites)
- [x] `npm run build` passes — all 8 pages statically generated
- [x] SVG images from placehold.co allowed in Next.js Image config
- [x] Mock auth layer (localStorage-backed, swap-ready for FastAPI)
- [x] `AuthContext` + `useAuth` hook — global user state
- [x] `FormInput` component — labeled input with error state + password toggle
- [x] `/login` page — React Hook Form + Zod validation, redirects to home on success
- [x] `/signup` page — 4-field form with password confirm, redirects to home on success
- [x] `/dashboard` page — protected with client-side auth guard
- [x] `WelcomeBanner` — shows "Welcome back, {first name}!" on home page when logged in
- [x] Navbar updated — auth-aware (Login/Sign Up when guest, user name + Sign Out when authenticated)
- [x] 138 tests passing across 20 suites (48 new auth tests)
- [x] Custom brand favicon (`app/icon.svg`) — blue→green gradient with white "MC" initials
- [x] `deployment-workflow.md` updated — Step 3 added (update changelog + project_status before every push)
- [x] 177 tests passing across 27 suites — added 39 tests for 7 previously untested components (HeroSection, FeaturesSection, StatsSection, CTASection, WelcomeBanner, PageShiftWrapper, SidebarDrawer)
- [x] All project docs moved to `docs/` folder (CLAUDE.md, architecture.md, brainstorm.md, deployment-workflow.md, project_status.md, CHANGELOG.md, vercel-deployment-plan.md)
- [x] `docs/become-a-teacher-architecture.md` — complete 19-PR plan for teacher onboarding pipeline (with API schemas, pagination spec, Supabase Storage, admin notifications)
- [x] `TeacherApplication` SQLAlchemy model + Alembic migration (PR 1/19 of become-a-teacher feature)
- [x] `InviteToken` SQLAlchemy model + Alembic migration (PR 2/19 of become-a-teacher feature)
- [x] `create_admin` CLI command (PR 3/19 of become-a-teacher feature)
- [x] `require_admin` and `require_teacher` FastAPI dependencies (PR 4/19 of become-a-teacher feature)
- [x] Pydantic application schemas (PR 5/19 of become-a-teacher feature)
- [x] Invite token service (PR 6/19 of become-a-teacher feature)
- [x] Public application routes (PR 7/19 of become-a-teacher feature)
- [x] Admin application routes — 5 endpoints: paginated list (search/filter), detail (with invite token status), approve, reject, resend invite (PR 8/19 of become-a-teacher feature)
- [x] Modified auth register with invite token support + validate-invite endpoint (PR 9/19 of become-a-teacher feature)
- [x] Email service via Resend — 4 email types (received, admin notification, approved, rejected), wired into application + admin routers (PR 10/19 of become-a-teacher feature)
- [x] `FormTextarea` component + 14 tests — textarea with label, error state, character count (PR 11/19 of become-a-teacher feature)
- [x] `FormRadioGroup` component + 10 tests — radio button group with fieldset/legend, error state, configurable options (PR 12/19 of become-a-teacher feature)
- [x] `Modal` component + `StatusBadge` component + 21 tests — accessible dialog with backdrop/confirm actions, colored status pill badge (PR 13/19 of become-a-teacher feature)
- [x] `/become-a-teacher` page + `applicationService.ts` + types + footer link + home CTA section + 13 tests (PR 14/19 of become-a-teacher feature)
- [x] `/application-status` page + 13 tests — status check by email + app ID, shows StatusBadge + dates (PR 15/19 of become-a-teacher feature)
- [x] Admin shell + `AdminSidebar` + `AdminHeader` + role guard + `adminService.ts` + admin types + 16 tests (PR 16/19 of become-a-teacher feature)
- [x] `TeacherRequests` list view — search by name/email, filter by status, paginated table with View links (PR 17/19)
- [x] `TeacherRequestDetail` view — full applicant profile with `StatusBadge`, qualifications, invite info (PR 17/19)
- [x] `ApplicationActions` component — Approve / Reject (with reason) / Resend Invite via Modal confirmations (PR 17/19)
- [x] `/signup` invite token flow — `?invite=` detection, token validation, pre-filled locked fields, teacher redirect, inline error card for expired/used/invalid tokens (PR 18/19)
- [x] `validateInviteToken()` in `authService.ts`; `signup()` accepts optional `inviteToken`; `IAuthContext` type updated; `app/signup/page.tsx` wrapped in `<Suspense>`
- [x] 306 tests passing across 39 suites

## What's Next
- [ ] **Become a Teacher Feature (19 PRs):**
  - [x] PR 1: TeacherApplication model + migration
  - [x] PR 2: InviteToken model + migration
  - [x] PR 3: Admin CLI command
  - [x] PR 4: Role dependencies
  - [x] PR 5: Application schemas
  - [x] PR 6: Invite service
  - [x] PR 7: Public application routes
  - [x] PR 8: Admin application routes
  - [x] PR 9: Modified auth register (invite token support)
  - [x] PR 10: Email service (Resend + admin notifications)
  - [x] PR 11: FormTextarea component + tests
  - [x] PR 12: FormRadioGroup component + tests
  - [x] PR 13: Modal + StatusBadge components + tests
  - [x] PR 14: Become a Teacher page (+ footer link + home CTA) + applicationService + types
  - [x] PR 15: Application Status page
  - [x] PR 16: Admin shell + sidebar + header + role guard + adminService
  - [x] PR 17: Admin teacher requests dashboard
  - [x] PR 18: Invite signup flow (with expired token error card)
  - [ ] PR 19: Teacher onboarding page (profile enrichment + Supabase Storage photo upload)
- [ ] Course detail page (`/courses/[slug]`)
- [ ] Quiz-taking functionality
- [ ] Blog detail page (`/blogs/[slug]`)

## Key Decisions Made
| Decision | Choice |
|----------|--------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod |
| State | useState (local), Server Components for static pages |
| Backend | FastAPI (later) |
| ORM | SQLAlchemy + Alembic |
| Database | Supabase PostgreSQL (later) |
| Auth | Custom JWT — bcrypt + python-jose (later) |
| Videos | YouTube embedded/linked |
| Live classes | Jitsi integration |
| File storage | Supabase Storage |
| Payments | Razorpay (India) / Stripe (global) |
| Revenue split | 80% instructor / 20% platform |
| Hosting | Vercel (frontend) + Render (backend) |
| Total cost | $0/month |

## GitHub
- **Repo:** https://github.com/sameerwatts/MediCode-Institute
- **Production URL:** Vercel (auto-deploys from `main`)

## Last Updated
2026-03-02 (PR 18)
