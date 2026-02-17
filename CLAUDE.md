# MediCode Institute — Project Guidelines

## Git Workflow

### Branching
- Always create a feature branch before starting any new major feature
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
