import type { ProgressEntry, ProgressStore } from "./types";

const STORAGE_KEY = "oravaman-progress-v1";

export function loadProgress(): ProgressStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProgressStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
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
