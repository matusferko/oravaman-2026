import { useEffect, useState } from "react";

const RACE_START = new Date("2026-07-11T07:00:00+02:00");

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function remainingMs(now: number) {
  return RACE_START.getTime() - now;
}

export function RaceCountdown() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = remainingMs(now);

  if (diff <= 0) {
    return (
      <div className="countdown done" aria-live="polite">
        <span className="countdown-label">Štart · sobota 11. 7. 2026, 7:00</span>
        <div className="countdown-units">
          <span>
            <b>Preteky bežia — drž sa plánu!</b>
          </span>
        </div>
      </div>
    );
  }

  const s = Math.floor(diff / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  return (
    <div className="countdown" aria-live="polite">
      <span className="countdown-label">Do štartu</span>
      <div className="countdown-units">
        <span>
          <b>{days}</b>
          <small>dní</small>
        </span>
        <span>
          <b>{pad(hours)}</b>
          <small>hod</small>
        </span>
        <span>
          <b>{pad(mins)}</b>
          <small>min</small>
        </span>
        <span>
          <b>{pad(secs)}</b>
          <small>s</small>
        </span>
      </div>
    </div>
  );
}
