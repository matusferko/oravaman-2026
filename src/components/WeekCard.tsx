import { useState, type CSSProperties, type DragEvent } from "react";
import type { DayPlan, WeekPlan } from "../types";
import type { StravaActivity } from "../lib/strava/types";
import { dayKey, isPastDay, isToday } from "../lib/planDates";
import { stravaSport } from "../lib/strava/match";
import { volumesForDay } from "../lib/planRemaining";
import { useProgress } from "../progress/ProgressContext";
import { isTrackableWorkout, sportsForDay } from "../progress/planWorkouts";

const DRAG_MIME = "application/x-strava-activity-id";

/** Planned km for the activity's discipline, or 0 if the day has no target for it. */
function plannedKm(day: DayPlan, activity: StravaActivity): number {
  const vol = volumesForDay(day);
  switch (stravaSport(activity)) {
    case "swim":
      return vol.swimKm;
    case "bike":
      return vol.bikeKm;
    case "run":
      return vol.runKm;
    default:
      return 0;
  }
}

/** Prefilled completion %: actual distance vs planned, capped at 100. Falls back to 100 when no target. */
function completionPctFor(day: DayPlan, activity: StravaActivity): number {
  const planned = plannedKm(day, activity);
  if (planned <= 0) return 100;
  return Math.min(100, Math.round((activity.distance / 1000 / planned) * 100));
}

type WeekCardProps = {
  week: WeekPlan;
};

function dayClassName(day: DayPlan, done: boolean) {
  const parts = ["day"];
  if (day.race) parts.push("race");
  else if (day.key) parts.push("key");
  if (isToday(day.date)) parts.push("today");
  if (done) parts.push("completed");
  return parts.join(" ");
}

function pastDaysLabel(count: number) {
  if (count === 1) return "1 predchádzajúci deň";
  if (count >= 2 && count <= 4) return `${count} predchádzajúce dni`;
  return `${count} predchádzajúcich dní`;
}

function formatDistance(meters: number): string {
  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)} km`
    : `${Math.round(meters)} m`;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

function DayRow({
  day,
  onRequestAssign,
}: {
  day: DayPlan;
  onRequestAssign: (day: DayPlan, activity: StravaActivity) => void;
}) {
  const { isDone, toggle, entryFor, fetchedActivities } = useProgress();
  const key = dayKey(day.date);
  const trackable = isTrackableWorkout(day);
  const done = isDone(key);
  const entry = entryFor(key);
  const today = isToday(day.date);
  const stravaActivities = entry?.source === "strava" && done ? (entry.stravaActivities ?? []) : [];
  const [dragOver, setDragOver] = useState(false);

  const canDrop = trackable && key !== null;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (!canDrop || !e.dataTransfer.types.includes(DRAG_MIME)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!dragOver) setDragOver(true);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    if (!canDrop) return;
    e.preventDefault();
    setDragOver(false);
    const id = Number(e.dataTransfer.getData(DRAG_MIME));
    const activity = fetchedActivities.find((a) => a.id === id);
    if (activity) onRequestAssign(day, activity);
  };

  return (
    <div
      className={`${dayClassName(day, done)}${dragOver ? " drag-over" : ""}`}
      id={today ? "plan-today" : undefined}
      onDragOver={canDrop ? handleDragOver : undefined}
      onDragLeave={canDrop ? () => setDragOver(false) : undefined}
      onDrop={canDrop ? handleDrop : undefined}
    >
      {trackable ? (
        <button
          type="button"
          className={`day-toggle${done ? " done" : ""}${entry?.source === "strava" ? " strava" : ""}`}
          aria-label={done ? "Označiť ako nesplnené" : "Označiť ako splnené"}
          aria-pressed={done}
          onClick={() => key && toggle(key)}
        >
          {done ? "✓" : ""}
        </button>
      ) : (
        <span className="day-toggle spacer" aria-hidden />
      )}
      <div className="day-body">
        <div className="day-header">
          <div className="daydate">{day.date}</div>
          <div className="pill" style={{ "--c": day.color } as CSSProperties}>
            {day.type}
          </div>
        </div>
        <div className="sess">{day.session}</div>
        {stravaActivities.map((a) => (
          <div key={a.id} className="strava-activity-detail">
            <span className="strava-activity-name">{a.name}</span>
            {a.distance > 0 && (
              <span className="strava-activity-stat">{formatDistance(a.distance)}</span>
            )}
            <span className="strava-activity-stat">{formatTime(a.moving_time)}</span>
          </div>
        ))}
        {done && typeof entry?.completionPct === "number" && entry.completionPct !== 100 && (
          <div className="completion-badge">Splnené na {entry.completionPct} %</div>
        )}
      </div>
    </div>
  );
}

/** Find an unfinished day in the week whose plan covers the activity's sport. Prefers the activity's own date. */
function suggestDay(
  activity: StravaActivity,
  days: DayPlan[],
  isDone: (key: string | null) => boolean,
): DayPlan | null {
  const sport = stravaSport(activity);
  if (!sport) return null;

  const candidates = days.filter((d) => {
    const k = dayKey(d.date);
    return (
      k !== null &&
      isTrackableWorkout(d) &&
      !isDone(k) &&
      sportsForDay(d).includes(sport)
    );
  });
  if (candidates.length === 0) return null;

  const activityDate = activity.start_date_local.slice(0, 10);
  return candidates.find((d) => dayKey(d.date) === activityDate) ?? candidates[0];
}

export function WeekCard({ week }: WeekCardProps) {
  const { fetchedActivities, entryFor, isDone, assignActivity } = useProgress();
  const past = week.days.filter((day) => isPastDay(day.date));
  const current = week.days.filter((day) => !isPastDay(day.date));

  const weekDayKeys = new Set(week.days.map((d) => dayKey(d.date)).filter(Boolean) as string[]);
  const matchedIds = new Set(
    [...weekDayKeys].flatMap((k) => entryFor(k)?.stravaActivityIds ?? []),
  );
  const unmatched = fetchedActivities.filter((a) => {
    const date = a.start_date_local.slice(0, 10);
    return weekDayKeys.has(date) && !matchedIds.has(a.id) && stravaSport(a) !== null;
  });

  const [pending, setPending] = useState<{ day: DayPlan; activity: StravaActivity; pct: number } | null>(
    null,
  );

  const requestAssign = (day: DayPlan, activity: StravaActivity) => {
    setPending({ day, activity, pct: completionPctFor(day, activity) });
  };

  const confirmAssign = () => {
    if (pending) {
      const key = dayKey(pending.day.date);
      if (key) assignActivity(key, pending.activity, pending.pct);
    }
    setPending(null);
  };

  return (
    <section className="week">
      <div className="whead">
        <div className="wtag">{week.tag}</div>
        <div className="wmeta">
          <div className="wrange">{week.range}</div>
          <div className="wphase">{week.phase}</div>
        </div>
        <div className="whours">{week.hours}</div>
      </div>
      <div className="wfocus">{week.focus}</div>
      {unmatched.length > 0 && (
        <div className="unmatched-activities">
          <div className="unmatched-hint">Pretiahni aktivitu na deň v pláne</div>
          {unmatched.map((a) => {
            const suggestion = suggestDay(a, week.days, isDone);
            return (
              <div key={a.id} className="unmatched-row">
                <div
                  className="unmatched-activity"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(DRAG_MIME, String(a.id));
                    e.dataTransfer.effectAllowed = "move";
                  }}
                >
                  <span className="unmatched-grip" aria-hidden>⠿</span>
                  <span className="unmatched-sport">{stravaSport(a)}</span>
                  <span className="unmatched-name">{a.name}</span>
                  {a.distance > 0 && <span className="unmatched-stat">{formatDistance(a.distance)}</span>}
                  <span className="unmatched-stat">{formatTime(a.moving_time)}</span>
                  {a.total_elevation_gain > 0 && <span className="unmatched-stat">↑{Math.round(a.total_elevation_gain)} m</span>}
                </div>
                {suggestion && (
                  <button
                    type="button"
                    className="unmatched-suggest"
                    onClick={() => requestAssign(suggestion, a)}
                  >
                    → Priradiť k {suggestion.date} · {suggestion.type}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="days">
        {past.length > 0 && (
          <details className="days-past">
            <summary>{pastDaysLabel(past.length)}</summary>
            {past.map((day) => (
              <DayRow day={day} key={day.date} onRequestAssign={requestAssign} />
            ))}
          </details>
        )}
        {current.map((day) => (
          <DayRow day={day} key={day.date} onRequestAssign={requestAssign} />
        ))}
      </div>
      {pending && (
        <div className="assign-modal-backdrop" onClick={() => setPending(null)}>
          <div className="assign-modal" onClick={(e) => e.stopPropagation()}>
            <div className="assign-modal-title">Priradiť aktivitu</div>
            <div className="assign-modal-activity">{pending.activity.name}</div>
            <div className="assign-modal-meta">
              Deň: {pending.day.date} · {pending.day.type}
            </div>
            <div className="assign-modal-meta">
              {plannedKm(pending.day, pending.activity) > 0 ? (
                <>
                  Plán: {formatDistance(plannedKm(pending.day, pending.activity) * 1000)} · Odjazdené:{" "}
                  {formatDistance(pending.activity.distance)}
                </>
              ) : (
                <>Odjazdené: {formatDistance(pending.activity.distance)}</>
              )}
            </div>
            <label className="assign-modal-field">
              Splnené na
              <input
                type="number"
                min={0}
                max={200}
                value={pending.pct}
                autoFocus
                onChange={(e) =>
                  setPending((p) => (p ? { ...p, pct: Number(e.target.value) } : p))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmAssign();
                  if (e.key === "Escape") setPending(null);
                }}
              />
              %
            </label>
            <div className="assign-modal-actions">
              <button type="button" className="strava-btn" onClick={confirmAssign}>
                Priradiť
              </button>
              <button
                type="button"
                className="strava-btn strava-btn-ghost"
                onClick={() => setPending(null)}
              >
                Zrušiť
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
