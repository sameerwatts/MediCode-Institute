# MediCode Institute — Feature Deployment Workflow

This is the standard process for every feature, fix, or docs update before it reaches production.
No separate dev/staging branch is needed — Vercel Preview Deployments serve that role.

---

## Overview

```
feature branch
     │
     ├── local dev + commits
     │
     ▼
  push branch
     │
     ▼
  open PR → main
     │
     ▼
Vercel auto-creates Preview URL
     │
     ▼
validate on Preview
     │
     ├── issues found → fix on feature branch → re-push → re-validate
     │
     ▼
merge PR into main
     │
     ▼
Vercel auto-deploys to Production
     │
     ▼
quick production sanity check
```

---

## Step-by-Step Process

### 1. Create Feature Branch
Always branch from `main` — never chain branches.

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

**Branch naming convention:**
| Type | Format | Example |
|------|--------|---------|
| New feature | `feature/description` | `feature/course-detail-page` |
| Bug fix | `fix/description` | `fix/navbar-mobile-overlap` |
| Docs update | `docs/description` | `docs/update-api-schema` |

---

### 2. Develop & Commit
- Make focused commits — one logical change per commit
- Keep components under ~150 lines; break into smaller pieces if needed
- Write tests for any new components or logic

```bash
git add <specific-files>
git commit -m "feat: add CourseDetail page with lesson list"
```

---

### 3. Pre-Push Checks (mandatory)
Run all three before pushing — catch issues before Vercel sees the code.

```bash
npm run lint      # fix all linting errors
npm run build     # catch TypeScript/build errors
npm test          # all tests must pass
```

Do not push if any of these fail.

---

### 4. Push Branch & Open PR

```bash
git push -u origin feature/your-feature-name
```

Create PR against `main` via GitHub MCP or GitHub UI.

PR description must include:
- What was changed and why
- Screenshots or notes for UI changes (optional but helpful)
- Test plan checklist

---

### 5. Vercel Preview Deployment (automatic)
When a PR is opened, Vercel automatically builds and deploys the feature branch to a unique Preview URL.

- Preview URL format: `https://medicode-institute-<hash>.vercel.app`
- Find it in the PR page under "Deployments" or in the Vercel dashboard
- Every new push to the branch triggers a fresh preview build

No manual deploy step needed — Vercel handles it automatically.

---

### 6. Validate on Preview
Test the feature thoroughly on the Preview URL before approving the merge.

**Validation checklist:**
- [ ] Feature works as expected end-to-end
- [ ] No visual regressions on pages you didn't touch
- [ ] Responsive — test on mobile viewport (375px) and desktop (1280px)
- [ ] No console errors in browser DevTools
- [ ] All navigation links work
- [ ] Page loads without flicker or layout shift
- [ ] Accessibility — keyboard navigation, image alt text, semantic HTML

**If issues are found:**
1. Fix on the same feature branch
2. Push the fix — Vercel auto-rebuilds the Preview
3. Re-validate from step 6

---

### 7. Merge PR into Main
Once the Preview is validated and you're satisfied:

- Merge the PR into `main` via GitHub
- Use **squash merge** for cleaner history on small features, **merge commit** for large features
- Delete the feature branch after merge

Merging into `main` automatically triggers a **Production deployment** on Vercel.

---

### 8. Production Sanity Check
After the production deploy completes (usually ~1–2 minutes):

- [ ] Visit the production URL and verify the feature is live
- [ ] Check one critical user flow (e.g., navigate to the new page, load a course)
- [ ] Confirm no 404s or build errors on Vercel dashboard

---

## Rules & Guardrails

| Rule | Detail |
|------|--------|
| Never commit directly to `main` | Always use a feature branch |
| Never force push to `main` | Destructive — prohibited |
| No separate dev/staging branch | Vercel Preview replaces that need |
| Branch from `main` only | Never chain feature branches off each other |
| Pre-push checks are mandatory | Lint + build + test must all pass |
| Validate on Preview before merge | Never merge unvalidated code into `main` |
| One feature per branch | Keep PRs focused and reviewable |

---

## Environment Variables on Vercel

- **Production** (`main` branch) — uses production env vars set in Vercel dashboard
- **Preview** (feature branches) — uses preview env vars (can be same as production or overridden)
- Never hardcode env values — always use `NEXT_PUBLIC_` prefix for client-side vars

To add/update env vars: Vercel Dashboard → Project → Settings → Environment Variables

---

## Quick Reference

```
1. git checkout main && git pull
2. git checkout -b feature/name
3. ... develop ...
4. npm run lint && npm run build && npm test
5. git push -u origin feature/name
6. Open PR → main (GitHub)
7. Check Vercel Preview URL (auto-generated)
8. Validate feature on Preview
9. Fix issues → push → re-validate (repeat if needed)
10. Merge PR → main triggers Production deploy
11. Quick sanity check on Production
```
