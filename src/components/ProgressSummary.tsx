import { useProgress } from "../progress/ProgressContext";

export function ProgressSummary() {
  const { doneCount, totalWorkouts } = useProgress();
  const pct = totalWorkouts > 0 ? Math.round((doneCount / totalWorkouts) * 100) : 0;

  return (
    <div className="progress-summary" aria-live="polite">
      <div className="progress-summary-head">
        <span className="countdown-label">Plán splnený</span>
        <span className="progress-summary-count">
          {doneCount} / {totalWorkouts}
        </span>
      </div>
      <div className="progress-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
