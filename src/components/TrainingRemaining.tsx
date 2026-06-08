import {
  formatElev,
  formatKm,
  remainingUntrainedTotals,
} from "../lib/planRemaining";
import { useProgress } from "../progress/ProgressContext";

export function TrainingRemaining() {
  const { completedDayKeys } = useProgress();
  const totals = remainingUntrainedTotals(new Date(), completedDayKeys);

  const units = [
    {
      value: formatKm(totals.swimKm),
      unit: "km",
      label: "plávanie",
    },
    {
      value: formatKm(totals.bikeKm),
      unit: "km",
      label: `bike · ${formatElev(totals.bikeElevM)}`,
    },
    {
      value: formatKm(totals.runKm),
      unit: "km",
      label: `beh · ${formatElev(totals.runElevM)}`,
    },
  ];

  return (
    <div className="countdown training-remaining" aria-live="polite">
      <span className="countdown-label">Zostáva natrénovať (od dnes)</span>
      <div className="countdown-units">
        {units.map((u) => (
          <span key={u.label}>
            <b>{u.value}</b>
            <small>
              {u.unit} {u.label}
            </small>
          </span>
        ))}
      </div>
    </div>
  );
}
