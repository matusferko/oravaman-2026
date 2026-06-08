import {
  formatElev,
  formatKm,
  remainingUntrainedTotals,
} from "../lib/planRemaining";
import { useProgress } from "../progress/ProgressContext";

function SwimIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="16" cy="6" r="2" />
      <path d="M3 16c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1" />
      <path d="M3 20c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1" />
      <path d="m6 13 4-3 3 2.5" />
      <path d="m10 10 4-2" />
    </svg>
  );
}

function BikeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      <path d="M12 17.5 9 10l3-2 2 3h3" />
      <path d="M9 10 7 7H5" />
    </svg>
  );
}

function RunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="17" cy="5" r="2" />
      <path d="m6 21 2-5 4-2-2-4-4 1" />
      <path d="m12 14 2 2 1 5" />
      <path d="m9 8 3-2 3 2 3 1" />
    </svg>
  );
}

export function TrainingRemaining() {
  const { isDone, entryFor } = useProgress();

  const completedFraction = (key: string) => {
    if (!isDone(key)) return 0;
    const pct = entryFor(key)?.completionPct;
    return typeof pct === "number" ? pct / 100 : 1;
  };

  const remaining = remainingUntrainedTotals(new Date(), completedFraction);
  const planned = remainingUntrainedTotals(new Date(0), () => 0);

  const donePct = (plannedKm: number, remainingKm: number) =>
    plannedKm > 0 ? Math.round(((plannedKm - remainingKm) / plannedKm) * 100) : 100;

  const rows = [
    {
      key: "swim",
      icon: <SwimIcon />,
      value: formatKm(remaining.swimKm),
      label: "plávanie",
      elev: null,
      pct: donePct(planned.swimKm, remaining.swimKm),
    },
    {
      key: "bike",
      icon: <BikeIcon />,
      value: formatKm(remaining.bikeKm),
      label: "bike",
      elev: formatElev(remaining.bikeElevM),
      pct: donePct(planned.bikeKm, remaining.bikeKm),
    },
    {
      key: "run",
      icon: <RunIcon />,
      value: formatKm(remaining.runKm),
      label: "beh",
      elev: formatElev(remaining.runElevM),
      pct: donePct(planned.runKm, remaining.runKm),
    },
  ];

  return (
    <div className="countdown training-remaining" aria-live="polite">
      <span className="countdown-label">Zostáva natrénovať (od dnes)</span>
      <div className="remaining-rows">
        {rows.map((row) => (
          <div key={row.key} className="remaining-row">
            <span className="remaining-icon">{row.icon}</span>
            <b className="remaining-value">{row.value}</b>
            <small className="remaining-label">
              km {row.label}
              {row.elev ? ` · ${row.elev}` : ""}
            </small>
            <span className="remaining-pct">{row.pct} %</span>
          </div>
        ))}
      </div>
    </div>
  );
}
