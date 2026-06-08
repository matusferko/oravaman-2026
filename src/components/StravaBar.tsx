import { useState } from "react";
import {
  beginStravaAuth,
  clearStravaTokens,
  stravaConfigured,
} from "../lib/strava/auth";
import { useProgress } from "../progress/ProgressContext";

export function StravaBar() {
  const { syncing, syncStatus, syncError, lastSyncedAt, syncFromStrava, connected } = useProgress();
  const configured = stravaConfigured();
  const [toast, setToast] = useState<string | null>(null);

  if (!configured) {
    return (
      <div className="strava-bar strava-bar-muted">
        Strava sync je vypnutý — nastav <code>VITE_STRAVA_CLIENT_ID</code> a token proxy.
      </div>
    );
  }

  const handleConnect = () => {
    try {
      beginStravaAuth();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Strava prihlásenie zlyhalo");
    }
  };

  const handleDisconnect = () => {
    clearStravaTokens();
    window.location.reload();
  };

  const handleSync = () => {
    syncFromStrava()
      .then(({ matched, fetched }) => {
        setToast(`Stiahnuté: ${fetched} aktivít, zhoduje sa s plánom: ${matched}`);
        setTimeout(() => setToast(null), 5000);
      })
      .catch(() => {
        /* syncError holds message */
      });
  };

  const lastSyncLabel = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleString("sk-SK", {
        day: "numeric",
        month: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="strava-bar">
      <div className="strava-bar-main">
        {connected ? (
          <>
            <span className="strava-status strava-connected">Strava pripojená</span>
            <button type="button" className="strava-btn" onClick={handleSync} disabled={syncing}>
              {syncing ? "Synchronizujem…" : "Synchronizovať"}
            </button>
            <button type="button" className="strava-btn strava-btn-ghost" onClick={handleDisconnect}>
              Odpojiť
            </button>
          </>
        ) : (
          <button type="button" className="strava-btn strava-btn-connect" onClick={handleConnect}>
            Pripojiť Stravu
          </button>
        )}
      </div>
      {lastSyncLabel && <div className="strava-meta">Posledná sync: {lastSyncLabel}</div>}
      {syncStatus && <div className="strava-toast">{syncStatus}</div>}
      {toast && <div className="strava-toast">{toast}</div>}
      {syncError && <div className="strava-error">{syncError}</div>}
    </div>
  );
}
