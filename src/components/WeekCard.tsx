import type { CSSProperties } from "react";
import type { DayPlan, WeekPlan } from "../types";
import { isPastDay, isToday } from "../lib/planDates";

type WeekCardProps = {
  week: WeekPlan;
};

function dayClassName(day: DayPlan) {
  const parts = ["day"];
  if (day.race) parts.push("race");
  else if (day.key) parts.push("key");
  if (isToday(day.date)) parts.push("today");
  return parts.join(" ");
}

function pastDaysLabel(count: number) {
  if (count === 1) return "1 predchádzajúci deň";
  if (count >= 2 && count <= 4) return `${count} predchádzajúce dni`;
  return `${count} predchádzajúcich dní`;
}

function DayRow({ day }: { day: DayPlan }) {
  const today = isToday(day.date);

  return (
    <div className={dayClassName(day)} id={today ? "plan-today" : undefined}>
      <div className="daydate">{day.date}</div>
      <div className="pill" style={{ "--c": day.color } as CSSProperties}>
        {day.type}
      </div>
      <div className="sess">{day.session}</div>
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
