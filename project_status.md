# MediCode Institute — Project Status

## Current Phase
**Deployed & Workflow Validated** — Static frontend is live on Vercel. Full feature branch → CI → Preview → Production pipeline confirmed working end-to-end.

## Current Branch
`main` — clean, up to date, deployed to production.

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

## What's Next
- [ ] Course detail page (`/courses/[slug]`)
- [ ] Quiz-taking functionality (answer questions, show score, review answers)
- [ ] Blog detail page (`/blogs/[slug]`)
- [ ] Firebase Authentication (sign up, login, protected routes)
- [ ] Connect to Flask backend API (replace dummy data with real API calls)
- [ ] Razorpay integration for course payments
- [ ] Video player integration (YouTube embed)

## Key Decisions Made
| Decision | Choice |
|----------|--------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| State | useState (local), Server Components for static pages |
| Backend | Flask + Flask-RESTful (later) |
| Database | PostgreSQL on Render (later) |
| Auth | Firebase Authentication (later) |
| Videos | YouTube embedded/linked |
| Live classes | Jitsi integration |
| File storage | Cloudinary |
| Payments | Razorpay (India) / Stripe (global) |
| Revenue split | 80% instructor / 20% platform |
| Hosting | Vercel (frontend) + Render (backend) |
| Total cost | $0/month |

## GitHub
- **Repo:** https://github.com/sameerwatts/MediCode-Institute
- **Production URL:** Vercel (auto-deploys from `main`)

## Last Updated
2026-02-20
