# Nicopixel Portfolio

The production website for **Nicopixel** — a Lagos-based graphic design studio specializing in brand identity, events design, and print collateral. Built as a full-stack Next.js application with a custom admin panel, not a static template.

**Live site:** [nicopixel.vercel.app](https://nicopixel.vercel.app)

## Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router, React Server Components)
- **Database & Auth:** [Supabase](https://supabase.com) (Postgres, Storage, session-based admin auth)
- **Styling:** Native CSS with CSS custom properties (design tokens), [Tailwind v4](https://tailwindcss.com) utilities where useful
- **Fonts:** Self-hosted via [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) — no third-party font requests
- **Email:** [Resend](https://resend.com) for contact form delivery
- **Analytics:** Custom first-party page view + conversion tracking, plus [Vercel Analytics](https://vercel.com/analytics) and [Speed Insights](https://vercel.com/docs/speed-insights)
- **Deployment:** [Vercel](https://vercel.com)

## Features

- Fully admin-manageable content: projects, case studies, blog posts, services, testimonials, career milestones, site settings, and theming — no code changes needed for day-to-day updates
- Custom analytics dashboard (page views, referrers, conversions) built on a first-party tracking pipeline, no third-party analytics dependency for core metrics
- 5 admin-selectable font pairings; an animated "Happy Accident" hero visual (cursor tries an idea, undoes it, lands on the right one)
- Light/dark theme with a full, separately-tuned color token set for each
- Contact form with server-side validation, rate limiting, and spam protection
- Cal.com booking integration for discovery calls
- SEO: per-page metadata, JSON-LD structured data (Organization/Person entity graph, BreadcrumbList, BlogPosting/CreativeWork), dynamic sitemap and robots.txt
- Accessibility: WCAG AA color contrast, full keyboard navigation with a proper modal focus trap on the mobile nav, skip-to-content link, semantic landmarks

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (Postgres database + Storage bucket)
- A [Resend](https://resend.com) account for transactional email

### Environment variables

Create a `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RESEND_API_KEY=your-resend-api-key
CONTACT_EMAIL=fallback-destination-email@example.com
```

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The admin panel is at `/admin`.

### Build

```bash
npm run build
npm run start
```

## Project Structure

```
app/
  (public)/          Public-facing routes (home, about, work, services, blog, contact, ...)
  admin/              Admin dashboard — content management, settings, analytics
  api/                Route handlers (contact form, tracking, admin actions)
components/
  sections/           Page-specific sections, including hero-visuals/ (the 7 animated hero variants)
  admin/               Admin panel UI
  layout/              Navbar, Footer
  ui/                   Shared primitives (Reveal, AnimatedStat, ThemeToggle, ...)
lib/                  Supabase clients, font/theme config, shared utilities
scripts/              SQL migrations, run manually via the Supabase SQL editor
```

## Notes

- Deployed on Vercel's default `.vercel.app` domain. Note: Vercel automatically applies `X-Robots-Tag: noindex` to `.vercel.app` domains — this is overridden in `vercel.json`. If migrating to a custom domain, that override is no longer necessary but is harmless to leave in place.
- Admin routes are excluded from search indexing via `robots.ts` and are session-authenticated; see `middleware.ts`.
- Database schema changes live in `scripts/` as numbered SQL migrations, applied manually — there is no automated migration runner.
