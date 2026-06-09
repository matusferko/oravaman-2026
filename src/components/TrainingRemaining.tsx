import {
  formatElev,
  formatKm,
  remainingUntrainedTotals,
} from "../lib/planRemaining";
import { useProgress } from "../progress/ProgressContext";
import { SwimIcon, BikeIcon, RunIcon } from "./SportIcons";

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
