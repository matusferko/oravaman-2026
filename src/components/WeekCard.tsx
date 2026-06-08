import type { CSSProperties } from "react";
import type { DayPlan, WeekPlan } from "../types";
import { dayKey, isPastDay, isToday } from "../lib/planDates";
import { useProgress } from "../progress/ProgressContext";
import { isTrackableWorkout } from "../progress/planWorkouts";

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

function DayRow({ day }: { day: DayPlan }) {
  const { isDone, toggle, entryFor } = useProgress();
  const key = dayKey(day.date);
  const trackable = isTrackableWorkout(day);
  const done = isDone(key);
  const entry = entryFor(key);
  const today = isToday(day.date);
  const stravaActivities = entry?.source === "strava" && done ? (entry.stravaActivities ?? []) : [];

  return (
    <div className={dayClassName(day, done)} id={today ? "plan-today" : undefined}>
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
      </div>
    </div>
  );
}

export function WeekCard({ week }: WeekCardProps) {
  const past = week.days.filter((day) => isPastDay(day.date));
  const current = week.days.filter((day) => !isPastDay(day.date));

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
      <div className="days">
        {past.length > 0 && (
          <details className="days-past">
            <summary>{pastDaysLabel(past.length)}</summary>
            {past.map((day) => (
              <DayRow day={day} key={day.date} />
            ))}
          </details>
        )}
        {current.map((day) => (
          <DayRow day={day} key={day.date} />
        ))}
      </div>
    </section>
  );
}
