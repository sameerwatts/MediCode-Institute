# MediCode Institute — Project Guidelines

## Project Documentation
- **[brainstorm.md](./brainstorm.md)** — Vision, target audience, features, tech stack, monetization, milestones, and key decisions
- **[architecture.md](./architecture.md)** — System design, database schema, API endpoints, project structure, security, and deployment
- **[.env.example](./.env.example)** — Environment variable template (Firebase, Cloudinary, Razorpay, DB, Jitsi)
- **[CHANGELOG.md](./CHANGELOG.md)** — Release changelog for tracking what changed in each version
- **[project_status.md](./project_status.md)** — Current project status, what's done, what's next (for quick restart)
- **[deployment-workflow.md](./deployment-workflow.md)** — Step-by-step feature → Vercel Preview → Production deployment process
- Update these files after major milestones and major additions to the project.

## Language
- **TypeScript** for all frontend code (`.ts` for logic, `.tsx` for components)
- Strict mode enabled in `tsconfig.json`

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
3. Run all test cases

## Naming Conventions
- **Component files:** `PascalCase` (e.g., `CourseCard.tsx`, `VideoPlayer.tsx`)
- **Hooks/utils:** `camelCase` (e.g., `useAuth.ts`, `helpers.ts`)
- **Styled components:** Prefix with `Styled` (e.g., `StyledButton`, `StyledCard`)
- **Types/interfaces:** `PascalCase` with `I` prefix for interfaces (e.g., `ICourse`, `IUser`, `IQuiz`)

## Folder Structure Rules
- Each page/component gets its own folder with `index.tsx`, `styles.ts`, and `*.test.tsx`
- Keep components small — if it exceeds ~150 lines, break it into smaller components

## Environment-Specific Rules
- Use `REACT_APP_` prefix for all frontend env variables
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
- **Jest** as the test runner

### Test Configuration
- `browser.jest.js` — Jest config for browser/component tests
- `unit.jest.js` — Jest config for unit tests

### Expectations
- Write tests for new features
- Run tests before pushing to feature branch

## Accessibility (a11y)
- All images must have `alt` text
- Use semantic HTML (`nav`, `main`, `section`, `article`)
- Forms must have proper `label` elements

## Performance
- Lazy load pages with `React.lazy()` and `Suspense`
- Optimize images before uploading to Cloudinary
- No large dependencies without discussion

## Error Handling
- Use error boundaries for React components
- Show user-friendly error messages, never raw error objects
- Log errors to console in development only
