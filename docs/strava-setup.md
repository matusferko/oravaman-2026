# Strava sync setup

The app matches your Strava activities to plan workouts by **date** and **sport**
(swim / bike / run). Brick days need both a ride and a run on the same day;
generálka days with swimming also need a swim.

## 1. Create a Strava API application

1. Open https://www.strava.com/settings/api
2. **Application Name:** Oravaman 2026
3. **Authorization Callback Domain:** `localhost` and `matusferko.github.io`
4. Copy **Client ID** and **Client Secret**

## 2. Local development

```bash
cp .env.example .env.local
# fill VITE_STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET
npm run dev
```

Open http://localhost:5173/oravaman-2026/ and click **Pripojiť Stravu**.

The Vite dev server exposes `POST /oravaman-2026/api/strava/token` and exchanges
OAuth codes using `STRAVA_CLIENT_SECRET` (never sent to the browser).

In Strava app settings, set the redirect URI to:

`http://localhost:5173/oravaman-2026/`

## 3. Production (GitHub Pages)

GitHub Pages is static — the **client secret** must live in a small backend.

### Option A — Supabase Edge Function (recommended)

```bash
supabase secrets set STRAVA_CLIENT_ID=... STRAVA_CLIENT_SECRET=...
supabase functions deploy strava-token
```

Set GitHub repo variables:

- `VITE_STRAVA_CLIENT_ID` — your Strava client ID
- `VITE_STRAVA_TOKEN_PROXY_URL` — `https://YOUR_PROJECT.supabase.co/functions/v1/strava-token`

In Strava, add redirect URI:

`https://matusferko.github.io/oravaman-2026/`

### Option B — local-only

Use the app on localhost with `.env.local`; production build shows a disabled Strava bar.

## 4. Behaviour

- On connect, the app stores refresh tokens in `localStorage` and syncs activities.
- On each visit while connected, activities are fetched again automatically.
- Matched workouts show an orange check (Strava); manual toggles show green.
- **Zostáva natrénovať** excludes completed workouts from remaining volume.
