# Parallax Scrolling Effect — Homepage

## Context
The homepage currently uses flat gradient backgrounds and basic hover effects. Adding parallax scrolling will make it more visually engaging — background images scroll at a different speed than foreground content, creating depth. No animation libraries are installed; we'll use pure CSS parallax + a lightweight Intersection Observer hook for scroll-triggered animations.

## Approach
**Parallax sandwich pattern:** 3 sections (Hero, Stats, CTA) get fixed background images with dark overlays. Content sections between them scroll normally over these backgrounds, creating the parallax illusion.

**Scroll-reveal animations:** Content sections (Features, Popular Courses, Categories) fade/slide into view as the user scrolls down.

## Images
Download 3 high-quality images from Unsplash (free license) and store in `/public/images/parallax/`:

| File | Section | Theme |
|------|---------|-------|
| `hero-bg.jpg` | Hero | Medical/tech — students, lab, stethoscope |
| `stats-bg.jpg` | Stats | Campus/library/classroom |
| `cta-bg.jpg` | CTA | Collaboration, laptops, learning |

Download at full resolution (~1920px wide), keep as JPEG (simpler, good browser support).

## New Files

### 1. `src/hooks/useScrollReveal.ts`
~25-line `'use client'` hook wrapping `IntersectionObserver`. Returns `{ ref, isVisible }`. Accepts `{ threshold, triggerOnce }` options. Disconnects observer after first intersection when `triggerOnce` is true (default).

### 2. `src/components/common/ParallaxSection/index.tsx`
Reusable wrapper component (no `'use client'` needed — purely presentational):
- Props: `imagePath`, `overlayOpacity` (default 60), `minHeight`, `children`, `className`
- Renders `<section>` with inline `backgroundImage` style + Tailwind `bg-cover bg-center bg-fixed bg-no-repeat`
- Dark overlay div with configurable opacity
- Content container centered within

### 3. `src/components/common/ScrollReveal/index.tsx`
`'use client'` wrapper component using `useScrollReveal` hook. Applies CSS classes for fade+slide-up animation. Props: `children`, `className`, `delay` (0-4).

## Modified Files

### 4. `app/globals.css`
Add after existing `@layer base`:
- Mobile fallback: `@media (max-width: 768px)` overrides `bg-fixed` to `scroll` (iOS Safari breaks with `background-attachment: fixed`)
- `@layer utilities` block with `.scroll-reveal` classes (opacity 0 + translateY → visible state) and delay variants

### 5. `src/views/Home/HeroSection.tsx`
- Replace `<section>` with gradient bg → wrap in `<ParallaxSection imagePath="/images/parallax/hero-bg.jpg">`
- Remove gradient classes, keep all text/button content unchanged

### 6. `src/views/Home/StatsSection.tsx`
- Wrap in `<ParallaxSection imagePath="/images/parallax/stats-bg.jpg" overlayOpacity={70}>`
- Change text colors: `text-primary` → `text-white`, `text-dark-gray` → `text-light-gray`
- Remove `bg-primary-light`
- Wrap each stat in `<ScrollReveal delay={index}>`

### 7. `src/views/Home/CTASection.tsx`
- Replace gradient `<section>` → wrap in `<ParallaxSection imagePath="/images/parallax/cta-bg.jpg" overlayOpacity={70}>`
- Keep all text/button content unchanged

### 8. `src/views/Home/FeaturesSection.tsx`
- Wrap each feature card in `<ScrollReveal delay={index}>`
- Wrap `SectionHeading` in `<ScrollReveal>`

### 9. `src/views/Home/PopularCourses.tsx` (already `'use client'`)
- Wrap each course card in `<ScrollReveal delay={index}>`

### 10. `src/views/Home/index.tsx`
- Wrap each Explore Categories card in `<ScrollReveal>`

### 11. `src/views/Home/TeacherCTASection.tsx` (already `'use client'`)
- Wrap inner content in `<ScrollReveal>`

### 12. `src/setupTests.ts`
Add `IntersectionObserver` mock — jsdom doesn't provide it. The mock immediately triggers `isIntersecting: true` so all scroll-reveal elements are visible during tests and existing text assertions pass.

### 13. `next.config.ts` (if needed)
Add `images.unoptimized` or Unsplash domain to `remotePatterns` — only if using Next Image. Since we use CSS `background-image`, likely not needed.

### 14. `docs/CHANGELOG.md` + `docs/project_status.md`
Update per deployment workflow.

## File Change Summary

| File | Action |
|------|--------|
| `public/images/parallax/hero-bg.jpg` | CREATE (download) |
| `public/images/parallax/stats-bg.jpg` | CREATE (download) |
| `public/images/parallax/cta-bg.jpg` | CREATE (download) |
| `src/hooks/useScrollReveal.ts` | CREATE |
| `src/components/common/ParallaxSection/index.tsx` | CREATE |
| `src/components/common/ScrollReveal/index.tsx` | CREATE |
| `app/globals.css` | MODIFY |
| `src/views/Home/HeroSection.tsx` | MODIFY |
| `src/views/Home/StatsSection.tsx` | MODIFY |
| `src/views/Home/CTASection.tsx` | MODIFY |
| `src/views/Home/FeaturesSection.tsx` | MODIFY |
| `src/views/Home/PopularCourses.tsx` | MODIFY |
| `src/views/Home/index.tsx` | MODIFY |
| `src/views/Home/TeacherCTASection.tsx` | MODIFY |
| `src/setupTests.ts` | MODIFY (add IO mock) |
| `docs/CHANGELOG.md` | MODIFY |
| `docs/project_status.md` | MODIFY |

## Verification
1. `npm run lint` — no new lint errors
2. `npm run build` — compiles successfully
3. `npm test` — all existing tests pass (IO mock ensures scroll-reveal doesn't hide elements)
4. Manual check: open dev server, scroll homepage, verify:
   - Hero/Stats/CTA have fixed background images with parallax effect
   - Features, courses, categories fade/slide in on scroll
   - Mobile: backgrounds scroll normally (no broken fixed attachment)
5. Playwright checks on Vercel Preview (per deployment workflow)
