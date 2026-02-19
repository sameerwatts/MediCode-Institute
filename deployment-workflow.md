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
GitHub Actions CI runs (lint → build → test)
     │
     ├── red → fix on branch → re-push → CI re-runs
     │
     ▼ green
Vercel auto-creates Preview URL
     │
     ▼
Claude runs automated checks (Playwright)
— pages, console errors, nav, responsive
     │
     ├── issues found → Claude fixes → re-push → CI + Preview rebuild
     │
     ▼
Claude shares Preview URL + findings with owner
     │
     ▼
Owner reviews and validates (final say)
     │
     ├── feedback → Claude fixes → owner re-reviews
     │
     ▼
Owner approves → Claude merges PR → main
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

### 5. CI Runs Automatically (GitHub Actions)
On every push to an open PR, GitHub Actions runs the CI pipeline defined in `.github/workflows/ci.yml`.

**CI runs three checks in order:**
| Step | Command | Blocks merge if… |
|------|---------|-----------------|
| Lint | `npm run lint` | Any lint error |
| Build | `npm run build` | Type error or build failure |
| Test | `npm test -- --ci` | Any failing test |

- **Red (any check fails)** → fix on the feature branch → push → CI re-runs automatically
- **Green (all checks pass)** → proceed to Vercel Preview

**Never merge a PR with a red CI.** GitHub branch protection enforces this once configured.

---

### 6. Vercel Preview Deployment (automatic)
When a PR is opened, Vercel automatically builds and deploys the feature branch to a unique Preview URL.

- Preview URL format: `https://medicode-institute-<hash>.vercel.app`
- Find it in the PR page under "Deployments" or in the Vercel dashboard
- Every new push to the branch triggers a fresh preview build

No manual deploy step needed — Vercel handles it automatically.

---

### 6. Validate on Preview
Validation is a two-part process — Claude runs automated checks first, then the owner does a final review.

#### Part A — Claude's automated checks (Playwright)
Claude navigates the Preview URL using browser tools and verifies:
- [ ] All pages load without errors
- [ ] No console errors in the browser
- [ ] Navigation links work correctly
- [ ] Interactive elements function (filters, buttons, hamburger menu, etc.)
- [ ] Responsive layout — mobile viewport (375px) and desktop (1280px)
- [ ] No visual regressions on pages not part of the feature

After checks complete, Claude shares:
- The Preview URL
- A summary of findings (what passed, what failed)
- Screenshots if relevant

**If issues are found during automated checks:** Claude fixes on the same feature branch → pushes → Vercel rebuilds → re-runs checks automatically.

#### Part B — Owner review (final say)
Once Claude's checks pass, the owner reviews the Preview URL for:
- [ ] Feature matches the original intent
- [ ] Look and feel is right
- [ ] Any subjective UX / design judgment calls
- [ ] Overall satisfaction before it goes to Production

**If the owner has feedback:** Claude fixes on the branch → pushes → Vercel rebuilds → owner re-reviews.

**Only the owner approves the merge. Claude never merges without explicit owner approval.**

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
| Pre-push checks are mandatory | Lint + build + test must all pass locally |
| Never merge a red CI | GitHub Actions must be green before proceeding to Preview |
| Claude validates on Preview first | Automated checks via Playwright before owner review |
| Owner has final say on merge | Claude never merges without explicit owner approval |
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
1.  git checkout main && git pull
2.  git checkout -b feature/name
3.  ... develop ...
4.  npm run lint && npm run build && npm test   ← local pre-push check
5.  git push -u origin feature/name
6.  Open PR → main (GitHub)
7.  GitHub Actions CI runs: lint → build → test  ← automated enforcement
8.  CI red → fix on branch → re-push → CI re-runs (repeat until green)
9.  CI green → Vercel auto-generates Preview URL
10. Claude runs Playwright checks — pages, console, nav, responsive
11. Claude fixes any issues → re-push → CI + Preview rebuild → re-check
12. Claude shares Preview URL + findings with owner
13. Owner reviews and validates on Preview
14. Owner gives approval (or feedback → Claude fixes → repeat 13)
15. Claude merges PR → main → Production deploy
16. Quick sanity check on Production
```