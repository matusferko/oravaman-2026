import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchAthleteActivities } from "../lib/strava/api";
import {
  consumeOAuthCallback,
  exchangeStravaCode,
  stravaConnected,
} from "../lib/strava/auth";
import { matchStravaToPlan } from "../lib/strava/match";
import { listPlanWorkouts } from "./planWorkouts";
import {
  completedKeys,
  loadProgress,
  mergeEntry,
  saveProgress,
  seedNewerThanLocal,
  seedStore,
} from "./storage";
import type { ProgressEntry, ProgressStore } from "./types";
import type { StravaActivity } from "../lib/strava/types";

type ProgressContextValue = {
  isDone: (dayKey: string | null) => boolean;
  entryFor: (dayKey: string | null) => ProgressEntry | undefined;
  toggle: (dayKey: string) => void;
  assignActivity: (dayKey: string, activity: StravaActivity, completionPct?: number) => void;
  doneCount: number;
  totalWorkouts: number;
  completedDayKeys: Set<string>;
  connected: boolean;
  setConnected: (value: boolean) => void;
  syncing: boolean;
  syncStatus: string | null;
  syncError: string | null;
  lastSyncedAt: string | null;
  syncFromStrava: () => Promise<{ matched: number; fetched: number }>;
  fetchedActivities: StravaActivity[];
  seedNotice: { seedAt: number; localAt: number } | null;
  applySeed: () => void;
  dismissSeed: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function applyStravaMatches(store: ProgressStore, matches: Record<string, ProgressEntry>): ProgressStore {
  let next = { ...store };
  for (const [key, entry] of Object.entries(matches)) {
    next = mergeEntry(next, key, entry);
  }
  return next;
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<ProgressStore>(() => loadProgress());
  const [fetchedActivities, setFetchedActivities] = useState<StravaActivity[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(
    () => localStorage.getItem("oravaman-strava-last-sync"),
  );
  const [connected, setConnected] = useState(stravaConnected);
  const [seedNotice, setSeedNotice] = useState(() => seedNewerThanLocal());

  const totalWorkouts = useMemo(() => listPlanWorkouts().length, []);
  const completedDayKeys = useMemo(() => completedKeys(store), [store]);
  const doneCount = completedDayKeys.size;

  const persist = useCallback((next: ProgressStore) => {
    setStore(next);
    saveProgress(next);
  }, []);

  const syncFromStrava = useCallback(async () => {
    setSyncing(true);
    setSyncError(null);
    setSyncStatus("Pripájam sa na Strava…");
    try {
      const activities = await fetchAthleteActivities(undefined, (fetched) => {
        setSyncStatus(`Sťahujem aktivity… (${fetched})`);
      });
      setFetchedActivities(activities);
      setSyncStatus("Porovnávam s plánom…");
      const matches = matchStravaToPlan(activities);
      setStore((current) => {
        const next = applyStravaMatches(current, matches);
        saveProgress(next);
        return next;
      });
      const at = new Date().toISOString();
      setLastSyncedAt(at);
      localStorage.setItem("oravaman-strava-last-sync", at);
      setConnected(true);
      setSyncStatus(null);
      return { matched: Object.keys(matches).length, fetched: activities.length };
    } catch (err) {
      setSyncStatus(null);
      setSyncError(err instanceof Error ? err.message : "Strava sync zlyhala");
      throw err;
    } finally {
      setSyncing(false);
    }
  }, [persist]);

  useEffect(() => {
    const callback = consumeOAuthCallback();
    if (!callback) return;

    exchangeStravaCode(callback.code, callback.state)
      .then(() => setConnected(true))
      .catch((err) => {
        setSyncError(err instanceof Error ? err.message : "Strava prihlásenie zlyhalo");
      });
  }, []);

  useEffect(() => {
    if (!connected) return;
    syncFromStrava().catch(() => {
      /* error surfaced via syncError */
    });
  }, [connected]);

  const isDone = useCallback(
    (dayKey: string | null) => (dayKey ? completedDayKeys.has(dayKey) : false),
    [completedDayKeys],
  );

  const entryFor = useCallback(
    (dayKey: string | null) => (dayKey ? store[dayKey] : undefined),
    [store],
  );

  const toggle = useCallback(
    (dayKey: string) => {
      const now = new Date().toISOString();
      const current = store[dayKey];
      const nextEntry: ProgressEntry = current?.completed
        ? { completed: false, source: "manual", updatedAt: now }
        : { completed: true, source: "manual", updatedAt: now };

      persist(mergeEntry(store, dayKey, nextEntry));
    },
    [persist, store],
  );

  const assignActivity = useCallback(
    (dayKey: string, activity: StravaActivity, completionPct?: number) => {
      const current = store[dayKey];
      const existingIds = current?.stravaActivityIds ?? [];
      if (existingIds.includes(activity.id)) return;

      const nextEntry: ProgressEntry = {
        completed: true,
        source: "strava",
        updatedAt: new Date().toISOString(),
        stravaActivityIds: [...existingIds, activity.id],
        stravaActivities: [
          ...(current?.stravaActivities ?? []),
          {
            id: activity.id,
            name: activity.name,
            distance: activity.distance,
            moving_time: activity.moving_time,
          },
        ],
        completionPct,
      };

      persist({ ...store, [dayKey]: nextEntry });
    },
    [persist, store],
  );

  const applySeed = useCallback(() => {
    persist(seedStore());
    setSeedNotice(null);
  }, [persist]);

  const dismissSeed = useCallback(() => setSeedNotice(null), []);

  const value = useMemo(
    () => ({
      isDone,
      entryFor,
      toggle,
      assignActivity,
      doneCount,
      totalWorkouts,
      completedDayKeys,
      syncing,
      syncStatus,
      syncError,
      lastSyncedAt,
      syncFromStrava,
      fetchedActivities,
      seedNotice,
      applySeed,
      dismissSeed,
      connected,
      setConnected,
    }),
    [
      isDone,
      entryFor,
      toggle,
      assignActivity,
      doneCount,
      totalWorkouts,
      completedDayKeys,
      syncing,
      syncStatus,
      syncError,
      lastSyncedAt,
      syncFromStrava,
      fetchedActivities,
      seedNotice,
      applySeed,
      dismissSeed,
      connected,
      setConnected,
    ],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
