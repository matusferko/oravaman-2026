import type { WorkoutSport } from "../../progress/planWorkouts";
import { listPlanWorkouts } from "../../progress/planWorkouts";
import type { ProgressEntry } from "../../progress/types";
import type { StravaActivity } from "./types";

export type DayActivityIndex = Map<string, Map<WorkoutSport, StravaActivity[]>>;

function activityDateKey(activity: StravaActivity): string {
  return activity.start_date_local.slice(0, 10);
}

export function stravaSport(activity: StravaActivity): WorkoutSport | null {
  const sport = activity.sport_type || activity.type;
  if (sport === "Swim") return "swim";
  if (["Ride", "VirtualRide", "EBikeRide", "Handcycle"].includes(sport)) return "bike";
  if (["Run", "TrailRun", "VirtualRun"].includes(sport)) return "run";
  return null;
}

export function indexActivities(activities: StravaActivity[]): DayActivityIndex {
  const index: DayActivityIndex = new Map();

  for (const activity of activities) {
    const sport = stravaSport(activity);
    if (!sport) continue;

    const day = activityDateKey(activity);
    if (!index.has(day)) index.set(day, new Map());
    const sports = index.get(day)!;
    if (!sports.has(sport)) sports.set(sport, []);
    sports.get(sport)!.push(activity);
  }

  return index;
}

function daySatisfied(sports: WorkoutSport[], index: DayActivityIndex, dayKey: string): StravaActivity[] | null {
  const daySports = index.get(dayKey);
  if (!daySports) return null;

  const matched: StravaActivity[] = [];
  for (const sport of sports) {
    const list = daySports.get(sport);
    if (!list || list.length === 0) return null;
    matched.push(list[0]);
  }

  return matched;
}

export function matchStravaToPlan(activities: StravaActivity[]): Record<string, ProgressEntry> {
  const index = indexActivities(activities);
  const now = new Date().toISOString();
  const matched: Record<string, ProgressEntry> = {};

  for (const workout of listPlanWorkouts()) {
    const activitiesForDay = daySatisfied(workout.sports, index, workout.dayKey);
    if (!activitiesForDay) continue;

    matched[workout.dayKey] = {
      completed: true,
      source: "strava",
      updatedAt: now,
      stravaActivityIds: activitiesForDay.map((a) => a.id),
      stravaActivities: activitiesForDay.map((a) => ({
        id: a.id,
        name: a.name,
        distance: a.distance,
        moving_time: a.moving_time,
      })),
    };
  }

  return matched;
}
