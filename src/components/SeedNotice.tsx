import { useProgress } from "../progress/ProgressContext";

function formatDate(ms: number): string {
  return new Date(ms).toLocaleString("sk-SK", {
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SeedNotice() {
  const { seedNotice, applySeed, dismissSeed } = useProgress();
  if (!seedNotice) return null;

  return (
    <div className="seed-notice">
      <div className="seed-notice-text">
        Uložený stav v repozitári je novší ({formatDate(seedNotice.seedAt)}) než dáta na tomto
        zariadení ({formatDate(seedNotice.localAt)}).
      </div>
      <div className="seed-notice-actions">
        <button type="button" className="strava-btn" onClick={applySeed}>
          Prepísať lokálne dáta
        </button>
        <button type="button" className="strava-btn strava-btn-ghost" onClick={dismissSeed}>
          Ponechať
        </button>
      </div>
    </div>
  );
}
