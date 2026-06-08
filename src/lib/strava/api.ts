import { planStartDayKey } from "../planDates";
import { ensureAccessToken } from "./auth";
import type { StravaActivity } from "./types";

const API = "https://www.strava.com/api/v3";

export async function fetchAthleteActivities(
  sinceDayKey = planStartDayKey(),
  onProgress?: (fetched: number) => void,
): Promise<StravaActivity[]> {
  const token = await ensureAccessToken();
  const after = Math.floor(new Date(`${sinceDayKey}T00:00:00`).getTime() / 1000);
  const all: StravaActivity[] = [];

  for (let page = 1; page <= 10; page++) {
    const params = new URLSearchParams({
      after: String(after),
      per_page: "200",
      page: String(page),
    });

    const res = await fetch(`${API}/athlete/activities?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error(`Strava API ${res.status}`);
    }

    const limit = res.headers.get("X-RateLimit-Limit");
    const usage = res.headers.get("X-RateLimit-Usage");
    if (limit && usage) {
      const [limitMin, limitDay] = limit.split(",");
      const [usedMin, usedDay] = usage.split(",");
      console.debug(`[Strava] rate limits — 15min: ${usedMin}/${limitMin}, daily: ${usedDay}/${limitDay}`);
    }

    const batch = (await res.json()) as StravaActivity[];
    if (batch.length === 0) break;
    all.push(...batch);
    onProgress?.(all.length);
    if (batch.length < 200) break;
  }

  return all;
}
