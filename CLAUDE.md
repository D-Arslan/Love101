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

## File Structure
```
src/
├── app/
│   ├── page.tsx                    # Landing
│   ├── layout.tsx                  # Root layout
│   ├── create/page.tsx             # Card creation
│   ├── l/[id]/page.tsx             # Public shareable link
│   ├── dashboard/                  # Auth-protected user dashboard
│   ├── auth/                       # Login, signup, OAuth callback
│   └── api/cards/ + cards/[id]/     # API routes (POST create, DELETE)
├── components/
│   ├── ui/                         # shadcn/ui (auto-generated)
│   ├── landing/                    # Hero, TemplateGrid, Footer
│   ├── create/                     # CustomizationForm, LivePreview
│   ├── card-display/               # CardRenderer, Envelope, Scratch, Quiz, QuizWithPrizes, Countdown, Reasons, Promises, Memories, SorryAlgorithm, RdvDetails, RdvClues, Music
│   ├── dashboard/                  # CardList, CardStats
│   ├── auth/                       # LoginForm, SignupForm
│   └── shared/                     # ShareBar, Navbar, UserMenu, Providers
├── lib/
│   ├── supabase/                   # client, server, admin
│   ├── types/                      # database, card, quiz
│   ├── validators/                 # Zod schemas (card, auth)
│   ├── sorry-defaults.ts           # Default sorry algorithm messages
│   ├── utils.ts                    # cn() helper
│   └── constants.ts                # App-wide constants
├── templates/                      # Template config objects
└── hooks/                          # useCountdown, useQuiz, useCard
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
- [ ] Phase 6: Polish + Deployment
