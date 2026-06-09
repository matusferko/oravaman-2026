# Strava sync setup

The app matches your Strava activities to plan workouts by **date** and **sport**
(swim / bike / run). Brick days need both a ride and a run on the same day;
generálka days with swimming also need a swim.

## 1. Create a Strava API application

1. Open https://www.strava.com/settings/api
2. **Application Name:** Oravaman 2026
3. **Authorization Callback Domain:** `localhost` (dev) and `matusferko.github.io` (prod)
4. Copy **Client ID** and **Client Secret**

---

## 2. Create a Supabase project (eu-central-1)

> Do this once. The project hosts the Edge Function that keeps `STRAVA_CLIENT_SECRET`
> and `SYNC_PIN` off the browser.

1. Go to https://supabase.com and sign in.
2. Click **New project**.
3. Fill in:
   - **Name:** `oravaman-2026`
   - **Database password:** choose a strong password (you won't need it directly)
   - **Region:** **Central EU (Frankfurt)** — `eu-central-1`
4. Click **Create new project** and wait ~2 min for provisioning.
5. From the project dashboard, copy the **Project URL** — it looks like
   `https://xxxxxxxxxxxx.supabase.co`. You'll need it later.

### Install / login Supabase CLI

```bash
brew install supabase/tap/supabase   # or: npm i -g supabase
supabase login                       # opens browser for auth
```

### Link the CLI to your project

```bash
supabase link --project-ref xxxxxxxxxxxx   # your project ref from the URL
```

### Set server-side secrets

```bash
supabase secrets set STRAVA_CLIENT_ID=<your_client_id>
supabase secrets set STRAVA_CLIENT_SECRET=<your_client_secret>
supabase secrets set SYNC_PIN=<your_pin>
```

### Deploy the Edge Function

```bash
supabase functions deploy strava-token --no-verify-jwt
```

`--no-verify-jwt` lets the function receive unauthenticated requests.
Security is handled by `STRAVA_CLIENT_SECRET` (never exposed to the client)
and `SYNC_PIN` (validated server-side before any sync).

---

## 3. Local development

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_STRAVA_CLIENT_ID=<your_client_id>
STRAVA_CLIENT_SECRET=<your_client_secret>
SYNC_PIN=<your_pin>

# Leave this commented out for local dev — Vite proxies /api/strava/token locally
# VITE_STRAVA_TOKEN_PROXY_URL=https://xxxxxxxxxxxx.supabase.co/functions/v1/strava-token
```

```bash
npm run dev
```

Open http://localhost:5173/oravaman-2026/ and click **Pripojiť Stravu**.

The Vite dev server proxies `POST /oravaman-2026/api/strava/token` and
`POST /oravaman-2026/api/strava/verify-pin` using your local secrets.

---

## 4. Production (GitHub Pages)

Set these two **repository variables** in GitHub:
**Settings → Secrets and variables → Actions → Variables → New repository variable**

| Variable | Value |
|---|---|
| `VITE_STRAVA_CLIENT_ID` | your Strava client ID |
| `VITE_STRAVA_TOKEN_PROXY_URL` | `https://xxxxxxxxxxxx.supabase.co/functions/v1/strava-token` |

Add the production redirect URI in Strava app settings:

```
https://matusferko.github.io/oravaman-2026/
```

Push to `main` — the GitHub Actions workflow picks up the variables and
bakes the proxy URL into the build automatically.

---

## 5. Behaviour

- On connect, the app stores refresh tokens in `localStorage` and syncs automatically.
- On each visit while connected, activities are fetched again.
- Sync is PIN-protected — the PIN is verified server-side before any data is fetched.
- Matched workouts show an orange check (Strava); manual toggles show green.
- Partially completed workouts record a `%` that feeds into **Zostáva natrénovať**.
- **Exportovať stav** downloads `progressSeed.json` — commit it to `src/data/` so
  a fresh device seeds from your latest progress instead of starting empty.
