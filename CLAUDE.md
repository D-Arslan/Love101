# Love101 — Architecture & Decisions

## Overview
Love101 is a web platform for creating and sharing personalized love messages.
Users pick a template (Valentine, Apology, Love Letter, Anniversary, Quiz Game, Rendez-vous), customize it,
and get a unique shareable link. Recipients open the link and discover an animated,
interactive message.

## Tech Stack
- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui (Sonner for toasts)
- **Animations:** Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Validation:** Zod
- **IDs:** nanoid (10 chars, URL-safe)
- **Icons:** Lucide React
- **Deployment:** Vercel

## Key Architecture Decisions

### 1. App Router (not Pages Router)
All pages in `src/app/`. Server Components by default.
Add `"use client"` only when needed: event handlers, useState,
useEffect, Framer Motion, browser APIs.

### 2. Supabase Client Strategy
- `lib/supabase/client.ts` — browser client (Client Components)
- `lib/supabase/server.ts` — server client (Server Components, Route Handlers) using cookies
- `lib/supabase/admin.ts` — service-role client for RLS bypass (API routes ONLY, never exposed)

### 3. Security
- All user inputs validated with Zod schemas before DB insertion
- Row Level Security (RLS) enabled on all tables
- API routes check authentication before mutations
- Parameterized queries via Supabase SDK (no raw SQL from user input)
- IP addresses hashed (SHA-256) before storage for view tracking
- Security headers: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy

### 4. Card IDs
nanoid (10 chars, URL-safe alphabet) → URLs like `/l/Ab3xK9mQz1`

### 5. Template System
Templates are config objects (not separate pages). Each defines:
colors, fonts, animations, layout, available features.
A single `CardRenderer` component reads the config and renders.

## Database Schema

### cards
- `id` TEXT PRIMARY KEY (nanoid)
- `user_id` UUID FK → auth.users (nullable for anonymous)
- `template_type` TEXT (valentine | apology | love-letter | anniversary | quiz-game | rdv)
- `recipient_name` TEXT (max 50)
- `sender_name` TEXT (max 50)
- `message` TEXT (max 2000)
- `theme_colors` JSONB (primary, secondary, background, text)
- `custom_config` JSONB (template-specific: quiz, quiz_prizes, countdown, scratch, reasons, promises, memories, music, sorry_messages, sorry_refusals, rdv, rdv_clues)
- `is_published` BOOLEAN
- `created_at` / `updated_at` TIMESTAMPTZ

### card_views
- `id` UUID PRIMARY KEY
- `card_id` TEXT FK → cards
- `viewed_at` TIMESTAMPTZ
- `viewer_ip_hash` TEXT (SHA-256)
- `user_agent` TEXT

### quiz_questions
- `id` UUID PRIMARY KEY
- `card_id` TEXT FK → cards
- `question` TEXT (max 200)
- `correct_answer` TEXT (max 100)
- `options` JSONB (array of 4 strings)
- `sort_order` INT

### reviews
- `id` UUID PRIMARY KEY (gen_random_uuid)
- `user_id` UUID FK → auth.users (unique — 1 review per user)
- `author_name` TEXT (max 50)
- `rating` INT (1-5)
- `comment` TEXT (max 500)
- `is_approved` BOOLEAN (default true)
- `created_at` TIMESTAMPTZ
- RLS: public read (approved), auth insert/update/delete own

## File Structure
```
src/
├── app/
│   ├── page.tsx                    # Landing
│   ├── layout.tsx                  # Root layout
│   ├── create/page.tsx             # Card creation
│   ├── l/[id]/page.tsx             # Public shareable link
│   ├── dashboard/                  # Auth-protected dashboard (+ loading.tsx)
│   ├── reviews/page.tsx            # Reviews page (ISR, revalidate=60)
│   ├── about/page.tsx              # About page (static, storytelling)
│   ├── privacy/page.tsx            # Privacy Policy page
│   ├── terms/page.tsx              # Terms of Service page
│   ├── auth/                       # Login, signup, OAuth callback
│   └── api/cards/ + cards/[id]/     # API routes (POST create, DELETE)
│   └── api/reviews/                # API route (POST upsert review + revalidatePath)
├── components/
│   ├── ui/                         # shadcn/ui (auto-generated)
│   ├── landing/                    # Hero, TemplateGrid, Footer (multi-column)
│   ├── create/                     # CustomizationForm, LivePreview
│   ├── card-display/               # CardRenderer, Envelope, Scratch, Quiz, QuizWithPrizes, Countdown, Reasons, Promises, Memories, SorryAlgorithm, RdvDetails, RdvClues, Music (all i18n)
│   ├── reviews/                    # StarDisplay, StarRating, ReviewForm (client-side auth), ReviewList
│   ├── dashboard/                  # CardList, CardStats
│   ├── auth/                       # LoginForm, SignupForm
│   └── shared/                     # ShareBar, Navbar, MobileMenu, UserMenu, Providers
├── lib/
│   ├── supabase/                   # client, server, admin
│   ├── types/                      # database, card, quiz, review
│   ├── validators/                 # Zod schemas (card, auth, review)
│   ├── sorry-defaults.ts           # Default sorry algorithm messages
│   ├── utils.ts                    # cn() helper
│   └── constants.ts                # App-wide constants
├── templates/                      # Template config objects
└── hooks/                          # useCountdown, useQuiz, useCard
messages/
├── fr/                             # French translations (14 files)
├── en/                             # English translations (14 files)
└── es/                             # Spanish translations (14 files)
```

## Development Commands
- `npm run dev` — Start dev server (http://localhost:3000)
- `npm run build` — Production build
- `npm run lint` — ESLint check

## Implementation Status
- [x] Phase 1: Project scaffolding
- [x] Phase 2: Landing page + Templates (6 templates)
- [x] Phase 3: Form + Supabase + Shareable links (MVP)
- [x] Phase 4: Interactive features (envelope, countdown, reasons, promises, memories, quiz, quiz-prizes, scratch, sorry-algorithm, rdv-details, rdv-clues, music)
- [x] Phase 5: Auth + Dashboard (email/password + Google OAuth, protected dashboard, card management, view tracking)
- [x] Phase 6: Polish (custom SVG logo, design tweaks, SEO sitemap, security headers)
- [x] Phase 7: Reviews page (dynamic, Supabase), About page (storytelling), Footer redesign (4-column grid), Navbar links + mobile hamburger menu
- [x] Phase 8: Performance & i18n (see details below)
- [x] Phase 9: Legal pages (Privacy Policy, Terms of Service)

## Phase 8 — Performance (Completed 2026-03-04)

### 8.1 — Image Compression
- [x] Compressed `logo-icon.png` from **2.1 MB → 12 KB** (sharp: resize to 800px + PNG compression)
- [x] Deleted orphan logos: `logo-en.png`, `logo-es.png`, `logo-fr.png`
- [x] `Logo.tsx` uses `next/image` with dynamic `sizes` per size variant (sm=80px, md=120px, lg=180px, xl=480px)

### 8.2 — Cache Headers
- [x] `next.config.ts` now has per-route Cache-Control:
  - `/icons/*` → `public, max-age=31536000, immutable`
  - `/:locale/l/:id*` → `public, s-maxage=3600, stale-while-revalidate=86400`
  - `/:locale/dashboard/*` → `private, no-cache`
- [x] `images.minimumCacheTTL = 31536000` configured

### 8.3 — ISR for Reviews
- [x] Replaced `force-dynamic` with `revalidate = 60` on reviews page
- [x] Auth check moved to client-side `ReviewForm` (allows ISR caching of public review list)
- [x] `revalidatePath("/[locale]/reviews", "page")` called after review upsert in API

### 8.4 — Dashboard Query Optimization
- [x] Replaced 2 sequential queries (cards + views) with single Supabase query using `card_views(count)` relation

### 8.5 — Minor Optimizations
- [x] Framer Motion imports already optimized (selective imports of `motion`, `AnimatePresence`)
- [x] Added `loading.tsx` for reviews and dashboard pages

### 8.6 — Full i18n of Card Display Components
- [x] Created `messages/{locale}/cardDisplay.json` (fr/en/es) with ~47 translated strings
- [x] All 13 card-display components now use `useTranslations` from next-intl
- [x] `RdvDetails` date formatting now uses locale-aware `toLocaleDateString`
- [x] Footer social media icons removed (no active accounts yet)

---

## Reusable Patterns & Techniques

### ISR + Client-Side Auth Pattern
When a page has both public cacheable data and auth-dependent UI:
1. Use `export const revalidate = N` on the page for ISR
2. Fetch public data server-side (cached)
3. Move auth checks into client components using `useEffect` + browser Supabase client
4. Call `revalidatePath()` from API routes to invalidate cache on mutations

### Supabase Relation Counts
Instead of 2 queries (fetch items + count views separately), use Supabase's relation counting:
```ts
.select("*, card_views(count)")
// Access: card.card_views[0]?.count ?? 0
```

### next/image Optimization
- Use dynamic `sizes` prop matching actual display sizes (not a generic "300px")
- Set `priority={true}` only for above-the-fold images
- Configure `images.minimumCacheTTL` in next.config.ts for long browser caching

### Image Compression with sharp (Next.js built-in)
```js
sharp(input).resize({ width: 800, withoutEnlargement: true }).png({ quality: 80, compressionLevel: 9 }).toFile(output)
```
No extra dependency needed — sharp ships with Next.js.

### Canvas i18n for Scratch Components
Pass translated strings as props to canvas-based components since `useTranslations` can't be used inside canvas drawing code directly. Example:
```tsx
<ScratchPrize scratchHint={t("scratchHint")} prizeRevealLabel={t("prizeReveal")} />
```

---

## Pending / Next Steps
- [ ] Create `reviews` table in Supabase (SQL in plan file, must be run manually)
- [ ] Add real social media links in footer when accounts are created
- [ ] Add review moderation system (admin dashboard)
- [ ] Middleware optimization: consider caching `getUser()` calls

## Git Workflow
- `main` — production branch (stable, deployable)
- `dev` — development branch (work in progress)
- Workflow: work on `dev`, merge into `main` when ready to deploy
