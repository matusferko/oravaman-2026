const PLAN_YEAR = 2026;

export function parsePlanDate(date: string): Date | null {
  const m = date.match(/(\d{1,2})\.(\d{1,2})\./);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  return new Date(PLAN_YEAR, month - 1, day);
}

export function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function dayStartMs(date: string): number | null {
  const parsed = parsePlanDate(date);
  return parsed ? startOfLocalDay(parsed).getTime() : null;
}

export function isPastDay(date: string, asOf: Date = new Date()): boolean {
  const ms = dayStartMs(date);
  if (ms === null) return false;
  return ms < startOfLocalDay(asOf).getTime();
}

export function isToday(date: string, asOf: Date = new Date()): boolean {
  const ms = dayStartMs(date);
  if (ms === null) return false;
  return ms === startOfLocalDay(asOf).getTime();
}
