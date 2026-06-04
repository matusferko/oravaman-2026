# Oravaman 2026 — Progress Tracking

## Context

The Oravaman 2026 training-plan app (deployed at https://matusferko.github.io/oravaman-2026/)
renders a 6-week plan (weeks → days) and already computes "remaining volume" and a race countdown
from the current date. There is **no way to mark workouts as done**. The user wants to track their
training progress, with completion **synced across devices**, and the design should leave room to
**auto-import completions from Strava later**.

Decisions (confirmed with user):
- **Manual check-off now**, data model designed so a Strava importer can layer on later.
- **Cross-device sync** via **Supabase** (free hosted Postgres) with **magic-link email auth**
  (matus@bottlebooks.me).
- Single user; security via Supabase Row Level Security (RLS).

This is a purely additive feature — no refactor of existing rendering.

## Architecture

**Stable day key (the linchpin).** Each completion is keyed by the workout's **ISO date**
(`YYYY-MM-DD`), derived from the existing `parsePlanDate()` in `src/lib/planDates.ts`. ISO dates are
unique across the plan and are exactly what a future Strava importer will match activities against.
Add a helper `dayKey(date: string): string | null` to `src/lib/planDates.ts`.

**Offline-first sync.** UI reads/writes a `localStorage` cache instantly (works logged-out and
offline). When signed in, the hook fetches the remote rows, merges last-write-wins by `updated_at`,
upserts back, and subscribes to realtime changes so a toggle on the phone appears on the laptop.

**Source-agnostic.** Each record carries `source: 'manual' | 'strava'`. Render/toggle logic never
inspects source, so a future Strava edge function can upsert `source:'strava'` rows with zero UI
changes.

### Data model

Supabase table `progress`:
| column        | type        | notes                                  |
|---------------|-------------|----------------------------------------|
| user_id       | uuid        | `auth.uid()`, part of PK               |
| day_key       | text        | ISO date `YYYY-MM-DD`, part of PK      |
| completed     | boolean     | default true (row exists ⇒ done)       |
| completed_at  | timestamptz | when marked                            |
| source        | text        | `'manual'` now; `'strava'` future      |
| updated_at    | timestamptz | for last-write-wins merge              |

PK `(user_id, day_key)`; RLS policies allow select/insert/update/delete where `user_id = auth.uid()`.

## Implementation

**New deps:** `@supabase/supabase-js` (add to `package.json`).

**New files:**
- `src/lib/supabase.ts` — create client from `import.meta.env.VITE_SUPABASE_URL` /
  `VITE_SUPABASE_ANON_KEY`. If env vars are missing, export `null` and run in **local-only mode**
  (manual check-off still works via localStorage; sync silently disabled).
- `src/progress/ProgressContext.tsx` — `ProgressProvider` + `useProgress()` hook exposing
  `{ isDone(dayKey), toggle(dayKey), doneCount, session }`. Handles: localStorage load/save,
  Supabase fetch+merge on auth, optimistic `toggle` (local + upsert), realtime subscription.
- `src/components/AuthBar.tsx` — compact control: signed-out shows "Synchronizovať naprieč
  zariadeniami" + email field → `supabase.auth.signInWithOtp({ email, options:{ emailRedirectTo } })`;
  signed-in shows email + sign-out. `emailRedirectTo` = `import.meta.env.BASE_URL`-aware full URL.

**Edited files:**
- `src/lib/planDates.ts` — add `dayKey()` (reuse `parsePlanDate` + zero-padded `YYYY-MM-DD`).
- `src/types.ts` — no change needed to `DayPlan` (completion lives in the progress store, keyed by
  date, not embedded in plan data).
- `src/main.tsx` — wrap `<App/>` in `<ProgressProvider>`.
- `src/components/WeekCard.tsx` — in `DayRow`, compute `const key = dayKey(day.date)`, read
  `isDone(key)`, render a leading toggle (checkbox/✓ button), add `completed` to `dayClassName`,
  call `toggle(key)` on click. Past days inside `<details>` remain toggleable.
- `src/components/Hero.tsx` (or a new `ProgressSummary` beside `TrainingRemaining`) — show overall
  `doneCount / totalWorkouts` and a % bar. Mirror `TrainingRemaining` styling.
- `src/index.css` — add `.day.completed` (reduced opacity + strikethrough `.sess` + green check via
  existing `--race`/`--summit` palette), the toggle control, the `AuthBar`, and the progress bar.
  Extend `.day` grid (`74px 92px 1fr` → add a small leading toggle column).

## Backend & deploy setup

**User does (one-time, in Supabase dashboard):**
1. Create a free Supabase project; give me the **Project URL** + **anon public key**.
2. Run the table + RLS SQL (I'll provide it) in the SQL editor.
3. Auth settings: enable email magic links; add Site URL `https://matusferko.github.io/oravaman-2026/`
   and `http://localhost:5173` to the redirect allowlist.

**I do:**
- Add `.env.local` (gitignored via existing `*.local`) with `VITE_SUPABASE_URL` /
  `VITE_SUPABASE_ANON_KEY` for local dev.
- Add the same two as **GitHub repo Variables** (anon key is public-safe) and reference them in
  `.github/workflows/deploy.yml` build step `env:` so they bake into the production build.

## Strava (future, not built now)

The `source` column + ISO `day_key` are the only hooks needed. Later: a Supabase **Edge Function**
holding the Strava OAuth token pulls activities and upserts `source:'strava'` rows by date. The
deployed app needs the server-side function — out of scope for this change.

## Verification

1. **Local-only mode first:** `npm run dev` with no env vars → toggle workouts, reload, confirm they
   persist in localStorage; confirm no crashes when Supabase client is null.
2. **Sync:** add env vars, sign in via magic link, toggle a workout; open the site in a second
   browser/incognito signed in as the same email → toggle appears live (realtime). Sign out → local
   cache still drives the UI.
3. **Build:** `npm run build`, serve `dist` under `/oravaman-2026/`, load via the Preview, screenshot,
   and check console logs for zero errors + confirm env vars baked in.
4. **Deploy:** push to `main`; watch the Actions run; load the live site, sign in, toggle, confirm
   persistence across reload.

## Open items / risks

- Magic-link redirect to a GitHub Pages **subpath** — verify Supabase returns to
  `.../oravaman-2026/` and `supabase-js` restores the session from the URL hash.
- "Total workouts" count: define whether `Voľno`/rest days are excluded from the % (proposed:
  exclude rest, count only swim/bike/run/brick) — confirm during implementation.
