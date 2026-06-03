import { plan } from "../data/plan";
import type { DayPlan } from "../types";

export type DisciplineTotals = {
  swimKm: number;
  bikeKm: number;
  runKm: number;
  bikeElevM: number;
  runElevM: number;
};

const PLAN_YEAR = 2026;
/** Easy brick/run off the bike (~8 km/h). */
const RUN_KM_PER_MIN = 8 / 60;

function parseKm(raw: string): number {
  return Number.parseFloat(raw.replace(",", "."));
}

function parsePlanDate(date: string): Date | null {
  const m = date.match(/(\d{1,2})\.(\d{1,2})\./);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  return new Date(PLAN_YEAR, month - 1, day);
}

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function firstKm(text: string): number {
  const range = text.match(/(\d+(?:,\d+)?)\s*[–-]\s*(\d+(?:,\d+)?)\s*km/i);
  if (range) return (parseKm(range[1]) + parseKm(range[2])) / 2;
  const single = text.match(/(\d+(?:,\d+)?)\s*km/i);
  return single ? parseKm(single[1]) : 0;
}

function elevM(text: string): number {
  const m = text.match(/~\s*(\d+)\s*m\b/i) ?? text.match(/\/\s*~?\s*(\d+)\s*m\b/i);
  return m ? Number(m[1]) : 0;
}

function runKmFromMinutes(text: string): number {
  const afterBehRange = text.match(/beh\s*(\d+)\s*[–-]\s*(\d+)\s*['′]?/i);
  if (afterBehRange) {
    const mins = (Number(afterBehRange[1]) + Number(afterBehRange[2])) / 2;
    return mins * RUN_KM_PER_MIN;
  }
  const afterBeh = text.match(/beh\s*(\d+)\s*['′]?/i);
  if (afterBeh) return Number(afterBeh[1]) * RUN_KM_PER_MIN;

  const beforeBehRange = text.match(/(\d+)\s*[–-]\s*(\d+)\s*['′]?\s*beh/i);
  if (beforeBehRange) {
    const mins = (Number(beforeBehRange[1]) + Number(beforeBehRange[2])) / 2;
    return mins * RUN_KM_PER_MIN;
  }
  const beforeBeh = text.match(/(\d+)\s*['′]?\s*beh/i);
  return beforeBeh ? Number(beforeBeh[1]) * RUN_KM_PER_MIN : 0;
}

function runKmFromText(text: string): number {
  const explicit =
    text.match(/beh\s*(?:do kopca\s*)?(\d+(?:,\d+)?)\s*km/i) ??
    text.match(/(\d+(?:,\d+)?)\s*km[^→]*beh/i);
  if (explicit) return parseKm(explicit[1]);
  return runKmFromMinutes(text);
}

/** Extract planned swim / bike / run volumes from a calendar day. */
export function volumesForDay(day: DayPlan): DisciplineTotals {
  const out: DisciplineTotals = {
    swimKm: 0,
    bikeKm: 0,
    runKm: 0,
    bikeElevM: 0,
    runElevM: 0,
  };

  if (day.race) return out;

  const session = day.session;
  const type = day.type;

  switch (type) {
    case "Plávanie":
      out.swimKm = firstKm(session);
      break;
    case "Bicykel": {
      out.bikeKm = firstKm(session);
      out.bikeElevM = elevM(session);
      break;
    }
    case "Beh": {
      out.runKm = runKmFromText(session);
      out.runElevM = elevM(session);
      break;
    }
    case "Brick": {
      const bike = session.match(/(?:bicykel|bike)\s*(\d+(?:,\d+)?)\s*km([^→]*)/i);
      if (bike) {
        out.bikeKm = parseKm(bike[1]);
        out.bikeElevM = elevM(bike[2]);
      }
      const swim = session.match(/plávanie\s*([^→]+)/i);
      if (swim) out.swimKm = firstKm(swim[1]);
      out.runKm = runKmFromText(session);
      break;
    }
    case "Voľno":
      if (/plávanie/i.test(session)) out.swimKm = firstKm(session);
      break;
    default:
      break;
  }

  return out;
}

function isTrainingDay(day: DayPlan): boolean {
  if (day.race) return false;
  const vol = volumesForDay(day);
  return vol.swimKm + vol.bikeKm + vol.runKm > 0;
}

export function remainingUntrainedTotals(asOf: Date = new Date()): DisciplineTotals {
  const cutoff = startOfLocalDay(asOf).getTime();
  const totals: DisciplineTotals = {
    swimKm: 0,
    bikeKm: 0,
    runKm: 0,
    bikeElevM: 0,
    runElevM: 0,
  };

  for (const week of plan.weeks) {
    for (const day of week.days) {
      if (!isTrainingDay(day)) continue;
      const dayDate = parsePlanDate(day.date);
      if (!dayDate || dayDate.getTime() < cutoff) continue;

      const vol = volumesForDay(day);
      totals.swimKm += vol.swimKm;
      totals.bikeKm += vol.bikeKm;
      totals.runKm += vol.runKm;
      totals.bikeElevM += vol.bikeElevM;
      totals.runElevM += vol.runElevM;
    }
  }

  return totals;
}

export function formatKm(km: number): string {
  const rounded = Math.round(km * 10) / 10;
  if (rounded >= 10 && Math.abs(rounded - Math.round(rounded)) < 0.05) {
    return String(Math.round(rounded));
  }
  return rounded.toFixed(1).replace(".", ",");
}

export function formatElev(m: number): string {
  return `${Math.round(m)} m`;
}
