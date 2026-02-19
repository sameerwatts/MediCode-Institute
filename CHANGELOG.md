# Changelog

All notable changes to MediCode Institute will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/)

---

## [Unreleased]

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
