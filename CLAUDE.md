# MediCode Institute — Project Guidelines

## Project Documentation
- **[brainstorm.md](./brainstorm.md)** — Vision, target audience, features, tech stack, monetization, milestones, and key decisions
- **[architecture.md](./architecture.md)** — System design, database schema, API endpoints, project structure, security, and deployment
- **[.env.example](./.env.example)** — Environment variable template (Firebase, Cloudinary, Razorpay, DB, Jitsi)
- **[CHANGELOG.md](./CHANGELOG.md)** — Release changelog for tracking what changed in each version
- **[project_status.md](./project_status.md)** — Current project status, what's done, what's next (for quick restart)
- **[deployment-workflow.md](./deployment-workflow.md)** — Step-by-step feature → Vercel Preview → Production deployment process
- **[vercel-deployment-plan.md](./vercel-deployment-plan.md)** — One-time Vercel account setup, env vars, domain, and dashboard guide
- Update these files after major milestones and major additions to the project.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS
- **Testing:** Jest + React Testing Library

## Language
- **TypeScript** for all frontend code (`.ts` for logic, `.tsx` for components)
- Strict mode enabled in `tsconfig.json`
- Use `@/*` path alias for imports (maps to `./src/*`)

## Git Workflow

### Branching
- Always create a feature branch before starting any new major feature
- Always branch directly from `main` — no chaining branches off other feature branches
- Never commit directly to `main`
- Branch naming convention: `feature/description` (e.g., `feature/course-listing`, `feature/quiz-page`)

### Git Flow for Major Changes
1. Create branch: `git checkout -b feature/description`
2. Develop and commit on the feature branch
3. Test locally before pushing:
   - Start dev server locally and verify changes
   - Check for linting errors
   - Run production build to catch type errors
4. Push branch and create PR to merge into `main`

### Commits
- Keep commits focused on a single change
- Write clear commit messages describing what changed and why

### Pull Requests
- Create PRs for all changes to `main`
- NEVER force push to `main`
- Include description of what changed and why

### Before Pushing
1. `npm run lint` — fix all linting errors
2. `npm run build` — catch type errors
3. `npm test` — run all test cases

## Naming Conventions
- **Component files:** `PascalCase` (e.g., `CourseCard.tsx`, `VideoPlayer.tsx`)
- **Hooks/utils:** `camelCase` (e.g., `useAuth.ts`, `helpers.ts`)
- **Types/interfaces:** `PascalCase` with `I` prefix for interfaces (e.g., `ICourse`, `IUser`, `IQuiz`)

## Folder Structure
- `app/` — Next.js App Router pages (layout.tsx, page.tsx, route directories)
- `src/components/` — Shared reusable components
- `src/views/` — Page-level components imported by app/ pages
- `src/data/` — Static data files
- `src/types/` — TypeScript type definitions
- `src/utils/` — Utility functions
- Each component gets its own folder with `index.tsx` and `*.test.tsx`
- Keep components small — if it exceeds ~150 lines, break it into smaller components

## Styling
- Use **Tailwind CSS** utility classes for all styling
- Theme tokens defined in `tailwind.config.ts` (colors, typography, spacing, shadows)
- No inline style objects — use Tailwind classes
- Use `globals.css` for base styles only

## Environment-Specific Rules
- Use `NEXT_PUBLIC_` prefix for client-side env variables
- Never hardcode URLs — always use env variables for API base URL, Jitsi domain, etc.

## Security
- Never expose any API key to client — server-side only
- Never commit `.env` or any file containing API keys
- Validate and sanitize all user inputs

## Code Quality
- TypeScript strict mode — no exceptions
- No `any` type without justification
- Run `npm run lint` before every commit
- Run all test cases before committing

## Testing

### Tools
- **React Testing Library** for component testing
- **Jest** as the test runner (standalone config in `jest.config.js`)

### Test Configuration
- `jest.config.js` — Jest config with Babel transforms and Next.js mocks
- `src/setupTests.ts` — Test setup (TextEncoder polyfill, jest-dom)
- `src/test-utils.tsx` — Custom render wrapper
- `src/__mocks__/` — Mocks for next/link, next/image, next/navigation, CSS modules

### Expectations
- Write tests for new features
- Run `npm test` before pushing to feature branch
- Import from `@/test-utils` not `@testing-library/react` directly

## Accessibility (a11y)
- All images must have `alt` text
- Use semantic HTML (`nav`, `main`, `section`, `article`)
- Forms must have proper `label` elements

## Performance
- Server Components by default — use `"use client"` only for interactive pages
- Use Next.js `<Image>` for optimized images (when replacing img tags)
- Optimize images before uploading to Cloudinary
- No large dependencies without discussion

## Error Handling
- Use error boundaries for React components
- Show user-friendly error messages, never raw error objects
- Log errors to console in development only
