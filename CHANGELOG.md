# Changelog

All notable changes to MediCode Institute will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/)

---

## [Unreleased]

### Added
- Project brainstorm with vision, features, tech stack, and decisions
- Technical architecture document (system design, DB schema, API design, project structure)
- Project guidelines (CLAUDE.md) with git workflow, security, code quality, and testing rules
- Environment variable template (.env.example)
- .gitignore for credential and build file protection

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
