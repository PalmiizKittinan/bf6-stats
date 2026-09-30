import { create } from "zustand";
import { BF6Stats, BF6Profile } from "@/types/bf6";

const STATS_API = "https://api.gametools.network/bf6/stats/";
const PROFILE_API = "https://api.gametools.network/bf6/profile/";
const DEFAULT_PLATFORM = "ea";
const TIMEOUT_MS = 10_000;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const CACHE_PREFIX = "bf6-stats-cache";
const CLASS_TIME_KEYS = [
  "tp_kit_assault",
  "tp_kit_engineer",
  "tp_kit_support",
  "tp_kit_recon",
];

interface StatsCacheEntry {
  stats: BF6Stats;
  // Total seconds played at the time the stats were cached
  secondsPlayed: number | null;
  savedAt: number;
}

const cacheKey = (name: string, platform: string, separation: boolean) =>
  `${CACHE_PREFIX}:${platform}:${name.toLowerCase()}:${separation}`;

function readCache(key: string): StatsCacheEntry | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as StatsCacheEntry;
    if (
      typeof entry.savedAt !== "number" ||
      Date.now() - entry.savedAt > CACHE_TTL_MS
    ) {
      localStorage.removeItem(key);
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

function writeCache(key: string, entry: Omit<StatsCacheEntry, "savedAt">) {
  try {
    localStorage.setItem(key, JSON.stringify({ ...entry, savedAt: Date.now() }));
  } catch {
    // Storage full or unavailable — cache is best-effort
  }
}

// Total play time from the (lighter) profile endpoint: sum of per-class time
function profileSecondsPlayed(profile: BF6Profile | null): number | null {
  const stats = profile?.playerProfiles?.[0]?.stats;
  if (!stats) return null;
  let total = 0;
  let found = false;
  for (const key of CLASS_TIME_KEYS) {
    const v = stats.find((s) => s.name === key)?.value;
    if (typeof v === "number") {
      total += v;
      found = true;
    }
  }
  return found ? total : null;
}

// Local time as "YYYY-MM-DD HH:mm"
export function formatSyncedAt(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

interface PlayerStore {
  // Search state
  searchInput: string;
  playerName: string;
  platform: string;
  separation: boolean;
  setSearchInput: (v: string) => void;
  setPlatform: (v: string) => void;
  setSeparation: (v: boolean) => void;
  handleSearch: (e: React.FormEvent) => void;
  resetToDefault: () => void;

  // Stats state
  stats: BF6Stats | null;
  statsLoading: boolean;
  statsError: string | null;
  statsSyncedAt: number | null;
  fetchStats: () => Promise<void>;

  // Profile state
  profile: BF6Profile | null;
  profileLoading: boolean;
  profileError: string | null;
  profileSyncedAt: number | null;
  fetchProfile: () => Promise<void>;

  // Fetch profile, then reuse cached stats if secondsPlayed is unchanged
  loadAll: () => Promise<void>;

  // Refresh all
  refreshAll: () => Promise<void>;
}

let statsController: AbortController | null = null;
let profileController: AbortController | null = null;

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Search state
  searchInput: "",
  playerName: "",
  platform: DEFAULT_PLATFORM,
  separation: false,
  setSearchInput: (v) => set({ searchInput: v }),
  setPlatform: (v) => set({ platform: v }),
  setSeparation: (v) => set({ separation: v }),

  handleSearch: (e) => {
    e.preventDefault();
    const { searchInput, platform } = get();
    const trimmed = searchInput.trim();
    if (!trimmed) return;
    set({ playerName: trimmed, platform });
    // Fetch both stats and profile
    setTimeout(() => {
      get().loadAll();
    }, 0);
  },

  resetToDefault: () => {
    set({
      searchInput: "",
      playerName: "",
      platform: DEFAULT_PLATFORM,
      separation: false,
      stats: null,
      statsError: null,
      statsSyncedAt: null,
      statsLoading: false,
      profile: null,
      profileError: null,
      profileSyncedAt: null,
      profileLoading: false,
    });
  },

  // Stats
  stats: null,
  statsLoading: false,
  statsError: null,
  statsSyncedAt: null,

  fetchStats: async () => {
    const { playerName, platform, separation } = get();
    if (!playerName) return;

    statsController?.abort();
    const controller = new AbortController();
    statsController = controller;
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    set({ statsLoading: true, statsError: null });

    try {
      const params = new URLSearchParams({
        categories: "multiplayer",
        raw: "false",
        format_values: "true",
        seperation: String(separation),
        name: playerName,
        platform: platform,
        skip_battlelog: "true",
        lang: "en-us",
      });
      const res = await fetch(`${STATS_API}?${params.toString()}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: BF6Stats = await res.json();
      if (!data.hasResults) {
        throw new Error(
          "Player not found. Please check the username and platform."
        );
      }
      clearTimeout(timeoutId);
      writeCache(cacheKey(playerName, platform, separation), {
        stats: data,
        secondsPlayed: profileSecondsPlayed(get().profile),
      });
      set({
        stats: data,
        statsError: null,
        statsLoading: false,
        statsSyncedAt: Date.now(),
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (!controller.signal.aborted) {
        set({
          statsError:
            err instanceof Error ? err.message : "Failed to fetch stats",
          stats: null,
          statsLoading: false,
        });
      } else if (statsController === controller) {
        // Timeout or manual abort on current controller
        set({
          statsError: "Request timed out. The server did not respond within 10 seconds. Please try again.",
          stats: null,
          statsLoading: false,
        });
      }
    }
  },

  // Profile
  profile: null,
  profileLoading: false,
  profileError: null,
  profileSyncedAt: null,

  fetchProfile: async () => {
    const { playerName, platform } = get();
    if (!playerName) return;

    profileController?.abort();
    const controller = new AbortController();
    profileController = controller;
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    set({ profileLoading: true, profileError: null });

    try {
      const params = new URLSearchParams({
        name: playerName,
        platform: platform,
        skip_battlelog: "true",
        lang: "en-us",
      });
      const res = await fetch(`${PROFILE_API}?${params.toString()}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: BF6Profile = await res.json();
      clearTimeout(timeoutId);
      set({
        profile: data,
        profileError: null,
        profileLoading: false,
        profileSyncedAt: Date.now(),
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (!controller.signal.aborted) {
        set({
          profileError:
            err instanceof Error ? err.message : "Failed to fetch profile",
          profile: null,
          profileLoading: false,
        });
      } else if (profileController === controller) {
        // Timeout or manual abort on current controller
        set({
          profileError: "Request timed out. The server did not respond within 10 seconds. Please try again.",
          profile: null,
          profileLoading: false,
        });
      }
    }
  },

  loadAll: async () => {
    const { playerName, platform, separation } = get();
    if (!playerName) return;

    await get().fetchProfile();
    // Ignore if the user searched for someone else meanwhile
    if (get().playerName !== playerName) return;

    const current = profileSecondsPlayed(get().profile);
    const cached = readCache(cacheKey(playerName, platform, separation));
    if (
      cached &&
      current !== null &&
      cached.secondsPlayed === current &&
      cached.stats.hasResults
    ) {
      set({
        stats: cached.stats,
        statsError: null,
        statsLoading: false,
        statsSyncedAt: cached.savedAt,
      });
      return;
    }
    await get().fetchStats();
  },

  refreshAll: async () => {
    const { playerName } = get();
    if (!playerName) return;
    get().loadAll();
  },
}));