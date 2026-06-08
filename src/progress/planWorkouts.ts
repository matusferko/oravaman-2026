import { plan } from "../data/plan";
import type { DayPlan } from "../types";
import { dayKey } from "../lib/planDates";
import { volumesForDay } from "../lib/planRemaining";

export type WorkoutSport = "swim" | "bike" | "run";

export type PlanWorkout = {
  dayKey: string;
  day: DayPlan;
  sports: WorkoutSport[];
};

export function isTrackableWorkout(day: DayPlan): boolean {
  if (day.race) return false;
  return sportsForDay(day).length > 0;
}

export function sportsForDay(day: DayPlan): WorkoutSport[] {
  switch (day.type) {
    case "Plávanie":
      return ["swim"];
    case "Bicykel":
      return ["bike"];
    case "Beh":
      return ["run"];
    case "Brick": {
      const sports: WorkoutSport[] = ["bike", "run"];
      if (/plávanie/i.test(day.session)) sports.unshift("swim");
      return sports;
    }
    case "Voľno":
      return /plávanie/i.test(day.session) ? ["swim"] : [];
    default:
      return [];
  }
}

export function listPlanWorkouts(): PlanWorkout[] {
  const workouts: PlanWorkout[] = [];

  for (const week of plan.weeks) {
    for (const day of week.days) {
      if (!isTrackableWorkout(day)) continue;
      const key = dayKey(day.date);
      if (!key) continue;
      workouts.push({ dayKey: key, day, sports: sportsForDay(day) });
    }
  }

  return workouts;
}

export function hasTrainingVolume(day: DayPlan): boolean {
  if (day.race) return false;
  const vol = volumesForDay(day);
  return vol.swimKm + vol.bikeKm + vol.runKm > 0;
}
