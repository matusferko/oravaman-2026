import { useRef, useState } from "react";
import {
  beginStravaAuth,
  clearStravaTokens,
  stravaConfigured,
  verifyPin,
} from "../lib/strava/auth";
import { exportProgressJson } from "../progress/storage";
import { useProgress } from "../progress/ProgressContext";

export function StravaBar() {
  const { syncing, syncStatus, syncError, lastSyncedAt, syncFromStrava, connected } = useProgress();
  const configured = stravaConfigured();
  const [toast, setToast] = useState<string | null>(null);
  const [pinMode, setPinMode] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const pinRef = useRef<HTMLInputElement>(null);

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

  const handleExport = () => {
    const blob = new Blob([exportProgressJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "progressSeed.json";
    a.click();
    URL.revokeObjectURL(url);
    setToast("Stav exportovaný — nahraj progressSeed.json do src/data/ a commitni.");
    setTimeout(() => setToast(null), 6000);
  };

  const openPinMode = () => {
    setPin("");
    setPinError(null);
    setPinMode(true);
    setTimeout(() => pinRef.current?.focus(), 0);
  };

  const cancelPin = () => {
    setPinMode(false);
    setPin("");
    setPinError(null);
  };

  const handlePinSubmit = async () => {
    setVerifying(true);
    setPinError(null);
    try {
      await verifyPin(pin);
      setPinMode(false);
      setPin("");
      syncFromStrava()
        .then(({ matched, fetched }) => {
          setToast(`Stiahnuté: ${fetched} aktivít, zhoduje sa s plánom: ${matched}`);
          setTimeout(() => setToast(null), 5000);
        })
        .catch(() => {
          /* syncError holds message */
        });
    } catch (err) {
      setPinError(err instanceof Error ? err.message : "Nesprávny PIN");
    } finally {
      setVerifying(false);
    }
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
            {pinMode ? (
              <>
                <input
                  ref={pinRef}
                  type="password"
                  className="strava-pin-input"
                  placeholder="PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handlePinSubmit();
                    if (e.key === "Escape") cancelPin();
                  }}
                  disabled={verifying}
                />
                <button type="button" className="strava-btn" onClick={handlePinSubmit} disabled={verifying || pin.length === 0}>
                  {verifying ? "Overujem…" : "OK"}
                </button>
                <button type="button" className="strava-btn strava-btn-ghost" onClick={cancelPin} disabled={verifying}>
                  Zrušiť
                </button>
              </>
            ) : (
              <button type="button" className="strava-btn" onClick={openPinMode} disabled={syncing}>
                {syncing ? "Synchronizujem…" : "Synchronizovať"}
              </button>
            )}
            <button type="button" className="strava-btn strava-btn-ghost" onClick={handleExport}>
              Exportovať stav
            </button>
            {/* <button type="button" className="strava-btn-icon" onClick={handleDisconnect} title="Odpojiť Stravu">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button> */}
          </>
        ) : (
          <button type="button" className="strava-btn strava-btn-connect" onClick={handleConnect}>
            Pripojiť Stravu
          </button>
        )}
      </div>
      {pinError && <div className="strava-error">{pinError}</div>}
      {lastSyncLabel && <div className="strava-meta">Posledná sync: {lastSyncLabel}</div>}
      {syncStatus && <div className="strava-toast">{syncStatus}</div>}
      {toast && <div className="strava-toast">{toast}</div>}
      {syncError && <div className="strava-error">{syncError}</div>}
    </div>
  );
}
