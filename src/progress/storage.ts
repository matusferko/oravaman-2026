import type { ProgressEntry, ProgressStore } from "./types";
import progressSeed from "../data/progressSeed.json";

const STORAGE_KEY = "oravaman-progress-v1";

/** Committed baseline used on a fresh device (empty localStorage). */
export function seedStore(): ProgressStore {
  return structuredClone(progressSeed as ProgressStore);
}

/** Raw localStorage store, or null when this device has none yet. */
function readLocal(): ProgressStore | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ProgressStore;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function loadProgress(): ProgressStore {
  return readLocal() ?? seedStore();
}

/** Most recent `updatedAt` across all entries (ms), or 0 when empty. */
export function latestUpdatedAt(store: ProgressStore): number {
  let max = 0;
  for (const entry of Object.values(store)) {
    const t = new Date(entry.updatedAt).getTime();
    if (Number.isFinite(t) && t > max) max = t;
  }
  return max;
}

/**
 * When this device already has local progress AND the committed seed is more
 * recent, returns both timestamps so the user can choose to override.
 */
export function seedNewerThanLocal(): { seedAt: number; localAt: number } | null {
  const local = readLocal();
  if (!local) return null;
  const seedAt = latestUpdatedAt(seedStore());
  const localAt = latestUpdatedAt(local);
  return seedAt > localAt ? { seedAt, localAt } : null;
}

/** Pretty-printed snapshot of the current store, for committing to progressSeed.json. */
export function exportProgressJson(): string {
  return JSON.stringify(loadProgress(), null, 2);
}

export function saveProgress(store: ProgressStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function mergeEntry(
  store: ProgressStore,
  dayKey: string,
  next: ProgressEntry,
): ProgressStore {
  const prev = store[dayKey];
  if (prev && new Date(prev.updatedAt).getTime() > new Date(next.updatedAt).getTime()) {
    return store;
  }
  return { ...store, [dayKey]: next };
}

export function completedKeys(store: ProgressStore): Set<string> {
  return new Set(
    Object.entries(store)
      .filter(([, entry]) => entry.completed)
      .map(([key]) => key),
  );
}
