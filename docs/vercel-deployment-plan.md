# MediCode Institute — Vercel Deployment Plan

This document covers the **one-time setup** for deploying on Vercel and the ongoing day-to-day deployment operations.

For the PR-based feature deployment workflow (branches → CI → Preview → Production), see [deployment-workflow.md](./deployment-workflow.md).

---

## Why Vercel for Next.js

Next.js was created by Vercel. Every Next.js feature is a first-class citizen on their platform:

| Feature | Vercel support |
|---------|---------------|
| App Router & Server Components | Native, zero config |
| `next/image` optimization | Built-in CDN |
| API Routes & Server Actions | Serverless functions |
| Edge Middleware | Edge network (100+ regions) |
| Preview per PR | Auto-generated, no setup |
| SSL / HTTPS | Free, automatic |
| Custom domain | Yes |
| Rollback | One click |

No other platform handles Next.js features as seamlessly. AWS, Netlify, and Railway all require manual configuration for features that Vercel handles automatically.

---

## One-Time Setup

### Step 1 — Create a Vercel Account

1. Go to **[vercel.com](https://vercel.com)** → click **Sign Up**
2. Choose **Continue with GitHub**
3. Authorize Vercel to access your GitHub account
4. Select the **Hobby** plan (free — sufficient for development and small-scale launch)

---

### Step 2 — Import the Repository

1. In Vercel dashboard → click **Add New... → Project**
2. You'll see a list of your GitHub repos
3. Find **medicode-institute** → click **Import**
4. Vercel auto-detects Next.js and pre-fills all build settings:

| Setting | Auto-detected value |
|---------|-------------------|
| Framework | Next.js |
| Build command | `next build` |
| Output directory | `.next` |
| Install command | `npm install` |
| Root directory | `/` (repo root) |

> Do not change these — they are correct.

---

### Step 3 — Configure Environment Variables

Before deploying, set up all environment variables in Vercel dashboard.

Go to: **Project → Settings → Environment Variables**

> **Important:** The `.env.example` file uses old CRA prefixes (`REACT_APP_`). In Next.js, use `NEXT_PUBLIC_` for any variable that must be readable in the browser. Server-side secrets must NOT have `NEXT_PUBLIC_`.

#### Client-Side Variables (use `NEXT_PUBLIC_` prefix)

These are bundled into the browser build — never put secrets here.

| Variable | Environment |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Production, Preview |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Production, Preview |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Production, Preview |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Production, Preview |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Production, Preview |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Production, Preview |
| `NEXT_PUBLIC_API_BASE_URL` | Production, Preview |
| `NEXT_PUBLIC_JITSI_DOMAIN` | Production, Preview |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Production, Preview |

#### Server-Side Only Variables (no `NEXT_PUBLIC_` prefix)

These are only available in Server Components, API Routes, and Server Actions — never exposed to the browser.

| Variable | Environment |
|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Production, Preview |
| `CLOUDINARY_API_KEY` | Production, Preview |
| `CLOUDINARY_API_SECRET` | Production, Preview |
| `RAZORPAY_KEY_SECRET` | Production only |
| `RAZORPAY_WEBHOOK_SECRET` | Production only |
| `DATABASE_URL` | Production, Preview |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Production, Preview |

> Payment secrets (`RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`) should be **Production only** — use test/sandbox keys for Preview environments.

#### How to Add Variables

1. Vercel Dashboard → Project → **Settings → Environment Variables**
2. Enter **Key** (e.g. `NEXT_PUBLIC_FIREBASE_API_KEY`)
3. Enter **Value**
4. Select environment: **Production**, **Preview**, **Development** (check all that apply)
5. Click **Save**

Repeat for each variable. After adding all variables, redeploy for them to take effect.

---

### Step 4 — First Production Deployment

After environment variables are set, trigger the first deploy:

1. Go to **Deployments** tab in Vercel dashboard
2. Click **Redeploy** on the latest deployment (or it auto-deploys on import)
3. Wait ~1–2 minutes for the build to complete

Your site will be live at:
```
https://medicode-institute.vercel.app
```

(Vercel may adjust the slug if the name is taken)

---

### Step 5 — Connect Custom Domain (Optional)

1. Vercel Dashboard → Project → **Settings → Domains**
2. Click **Add**
3. Enter your domain (e.g. `medicodeinstitute.com`)
4. Vercel gives you two DNS records to add:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

5. Add these records at your domain registrar (GoDaddy, Namecheap, etc.)
6. DNS propagation takes up to 24 hours
7. SSL certificate is provisioned automatically — HTTPS works out of the box

---

### Step 6 — Connect GitHub for CI Status Checks (optional but recommended)

Enable Vercel's GitHub integration to block merges until the Vercel preview build succeeds:

1. Vercel Dashboard → Project → **Settings → Git**
2. Under **GitHub Checks** → enable **Require checks to pass before merging**

This means your PR will require **both** CI (GitHub Actions) and the Vercel preview build to be green before the merge button is active.

---

## Day-to-Day Operations

Once set up, you never manually deploy again. Everything is automatic:

| Event | What Vercel does |
|-------|-----------------|
| PR opened | Builds branch → deploys Preview URL |
| Push to open PR | Rebuilds Preview URL |
| PR merged to `main` | Builds `main` → deploys to Production |
| PR closed (without merge) | Preview deployment removed |

See [deployment-workflow.md](./deployment-workflow.md) for the full PR lifecycle.

---

## Rollback

If a production deployment breaks something:

1. Vercel Dashboard → **Deployments** tab
2. Find any previous deployment (they're all saved)
3. Click **...** → **Promote to Production**
4. Done — instant rollback, no rebuild needed

---

## Vercel Dashboard Overview

| Section | What it contains |
|---------|-----------------|
| **Deployments** | All deployments (production + preview), build logs, rollback |
| **Analytics** | Page views, performance (Core Web Vitals) |
| **Settings → Domains** | Add/manage custom domains |
| **Settings → Environment Variables** | Add/edit env vars |
| **Settings → Git** | Branch configuration, GitHub checks |
| **Settings → Functions** | Serverless function region, memory, timeout |
| **Logs** | Runtime logs from API routes and server functions |

---

## `.env.example` Update Needed

The current `.env.example` uses CRA-style `REACT_APP_` prefixes. Update them to `NEXT_PUBLIC_` for Next.js:

```bash
# Old (CRA)
REACT_APP_FIREBASE_API_KEY=
REACT_APP_API_BASE_URL=
REACT_APP_JITSI_DOMAIN=

# New (Next.js)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_JITSI_DOMAIN=
```

This is a low-priority cleanup task — create a separate issue/PR for it when starting backend integration.
