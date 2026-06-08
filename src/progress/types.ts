export type ProgressSource = "manual" | "strava";

export type StravaActivitySummary = {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
};

export type ProgressEntry = {
  completed: boolean;
  source: ProgressSource;
  updatedAt: string;
  stravaActivityIds?: number[];
  stravaActivities?: StravaActivitySummary[];
};

export type ProgressStore = Record<string, ProgressEntry>;
