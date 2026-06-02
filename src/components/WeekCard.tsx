import type { CSSProperties } from "react";
import type { WeekPlan } from "../types";

type WeekCardProps = {
  week: WeekPlan;
};

function dayClassName(day: WeekPlan["days"][number]) {
  if (day.race) return "day race";
  if (day.key) return "day key";
  return "day";
}

export function WeekCard({ week }: WeekCardProps) {
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
        {week.days.map((day) => (
          <div className={dayClassName(day)} key={day.date}>
            <div className="daydate">{day.date}</div>
            <div className="pill" style={{ "--c": day.color } as CSSProperties}>
              {day.type}
            </div>
            <div className="sess">{day.session}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
