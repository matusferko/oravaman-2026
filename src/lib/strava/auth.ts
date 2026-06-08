import type { StravaTokenResponse, StravaTokens } from "./types";

const TOKENS_KEY = "oravaman-strava-tokens-v1";
const OAUTH_STATE_KEY = "oravaman-strava-oauth-state";

const SCOPES = "activity:read_all";

function clientId(): string | null {
  const id = import.meta.env.VITE_STRAVA_CLIENT_ID;
  return id && id.length > 0 ? id : null;
}

function tokenProxyUrl(): string {
  const url = import.meta.env.VITE_STRAVA_TOKEN_PROXY_URL;
  if (url && url.length > 0) return url.replace(/\/$/, "");
  return `${import.meta.env.BASE_URL}api/strava/token`.replace(/\/+/g, "/").replace(":/", "://");
}

export function stravaConfigured(): boolean {
  return clientId() !== null;
}

export function loadStravaTokens(): StravaTokens | null {
  try {
    const raw = localStorage.getItem(TOKENS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StravaTokens;
  } catch {
    return null;
  }
}

export function saveStravaTokens(tokens: StravaTokens) {
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

export function clearStravaTokens() {
  localStorage.removeItem(TOKENS_KEY);
}

export function stravaConnected(): boolean {
  return loadStravaTokens() !== null;
}

function redirectUri(): string {
  return new URL(import.meta.env.BASE_URL, window.location.origin).href;
}

function toTokens(res: StravaTokenResponse): StravaTokens {
  return {
    accessToken: res.access_token,
    refreshToken: res.refresh_token,
    expiresAt: res.expires_at,
    athleteId: res.athlete?.id,
  };
}

async function postToken(body: Record<string, string>): Promise<StravaTokens> {
  const res = await fetch(tokenProxyUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Strava token request failed (${res.status})`);
  }

  return toTokens((await res.json()) as StravaTokenResponse);
}

export function beginStravaAuth() {
  const id = clientId();
  if (!id) throw new Error("Chýba VITE_STRAVA_CLIENT_ID");

  const state = crypto.randomUUID();
  sessionStorage.setItem(OAUTH_STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: id,
    response_type: "code",
    redirect_uri: redirectUri(),
    approval_prompt: "auto",
    scope: SCOPES,
    state,
  });

  window.location.href = `https://www.strava.com/oauth/authorize?${params}`;
}

export async function exchangeStravaCode(code: string, state: string | null): Promise<StravaTokens> {
  const expected = sessionStorage.getItem(OAUTH_STATE_KEY);
  sessionStorage.removeItem(OAUTH_STATE_KEY);
  if (!expected || !state || state !== expected) {
    throw new Error("Neplatný Strava OAuth state");
  }

  const tokens = await postToken({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri(),
  });
  saveStravaTokens(tokens);
  return tokens;
}

export async function refreshStravaTokens(refreshToken: string): Promise<StravaTokens> {
  const tokens = await postToken({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  saveStravaTokens(tokens);
  return tokens;
}

export async function ensureAccessToken(): Promise<string> {
  const stored = loadStravaTokens();
  if (!stored) throw new Error("Strava nie je pripojená");

  const now = Math.floor(Date.now() / 1000);
  if (stored.expiresAt > now + 120) return stored.accessToken;

  const refreshed = await refreshStravaTokens(stored.refreshToken);
  return refreshed.accessToken;
}

export async function verifyPin(pin: string): Promise<void> {
  const base = tokenProxyUrl().replace(/\/token$/, "");
  const res = await fetch(`${base}/verify-pin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin }),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? "PIN overenie zlyhalo");
  }
}

export function consumeOAuthCallback(): { code: string; state: string } | null {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const state = params.get("state");
  if (!code || !state) return null;

  const clean = new URL(window.location.href);
  clean.searchParams.delete("code");
  clean.searchParams.delete("state");
  clean.searchParams.delete("scope");
  window.history.replaceState({}, "", clean.pathname + clean.search + clean.hash);

  return { code, state };
}
