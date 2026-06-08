/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRAVA_CLIENT_ID?: string;
  readonly VITE_STRAVA_TOKEN_PROXY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
