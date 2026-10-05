import { create } from "zustand";
import { BF6Stats, BF6Profile } from "@/types/bf6";

const STATS_API = "https://api.gametools.network/bf6/stats/";
const PROFILE_API = "https://api.gametools.network/bf6/profile/";
const SEARCH_API = "https://api.gametools.network/bf6/player/";
const NOT_FOUND_MSG =
  "Player not found. Please check the username and platform.";
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

  // Accounts found for the searched name when it exists on several platforms;
  // the user picks one (null = no choice pending)
  choices: AccountChoice[] | null;
  choicesLoading: boolean;
  chooseAccount: (c: AccountChoice) => void;
  dismissChoices: () => void;
  // Use a fixed platform for a name (saved names)
  pinPlatform: (name: string, platform: string) => void;

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

  // Multiple state (/multiple page): ids from the player search, stats fetched per player
  // One entry per resolved player name (comma separated in the search box)
  multiple: BF6Stats[] | null;
  // Names that could not be resolved
  multipleMissing: string[];
  multipleLoading: boolean;
  multipleError: string | null;
  multipleSyncedAt: number | null;
  // While true, searching loads multiple stats instead of stats + profile
  multipleActive: boolean;
  setMultipleActive: (v: boolean) => void;
  fetchMultiple: () => Promise<void>;
}

interface SearchResult {
  personaId: number | string;
  nucleusId: number | string;
  name?: string;
  displayName?: string;
  username?: string;
  platform?: string;
}

// "a, b, c" -> unique, trimmed names (max 10)
export function parseNames(input: string): string[] {
  const seen = new Set<string>();
  return input
    .split(",")
    .map((n) => n.trim())
    .filter((n) => n && !seen.has(n.toLowerCase()) && seen.add(n.toLowerCase()))
    .slice(0, 10);
}

// One account of a player on one platform
export interface Account {
  name: string;
  // Value accepted by the stats endpoint (ea / steam / xbox / psn)
  platform: string;
  personaId?: number | string;
  nucleusId?: number | string;
}

export interface AccountChoice extends Account {
  // null when the stats could not be loaded
  kills: number | null;
}

// Platforms tried one by one with a name lookup when the player search finds nothing
const LOOKUP_PLATFORMS = ["ea", "steam", "xbox", "psn"];

// Search `platform` -> stats `platform`
function toStatsPlatform(p: string | undefined): string {
  if (!p) return DEFAULT_PLATFORM;
  if (p.startsWith("xbox")) return "xbox";
  if (p.startsWith("ps")) return "psn";
  return p;
}

const nameOf = (r: SearchResult) => r.name ?? r.displayName ?? r.username ?? "";

// Exact-name match only (no prefix search). Rapid calls are silently rate
// limited: the API answers 200 with empty results for ~30 seconds.
async function searchPlayers(
  name: string,
  signal: AbortSignal
): Promise<SearchResult[]> {
  const res = await fetch(
    `${SEARCH_API}?name=${encodeURIComponent(name)}&limit=10`,
    { signal }
  );
  if (!res.ok) return [];
  const { results = [] }: { results?: SearchResult[] } = await res.json();
  return results;
}

// Accounts the user picked (or saved names), by lower-case name
const pins = new Map<string, Account>();

// Lookup params for the stats/profile endpoints: ids when known, else name
function playerParams(name: string, platform: string): Record<string, string> {
  const pin = pins.get(name.toLowerCase());
  if (pin?.personaId) {
    return {
      playerid: String(pin.personaId),
      nucleus_id: String(pin.nucleusId),
      platform: pin.platform,
    };
  }
  return { name, platform: pin?.platform ?? platform };
}

// Stats params shared by name and id lookups
const statsParams = () =>
  new URLSearchParams({
    categories: "multiplayer",
    raw: "false",
    format_values: "true",
    seperation: "false",
    skip_battlelog: "true",
    lang: "en-us",
  });

async function fetchPlayerStats(
  lookup: Record<string, string>,
  signal: AbortSignal
): Promise<BF6Stats | null> {
  const params = statsParams();
  for (const [k, v] of Object.entries(lookup)) params.set(k, v);
  const res = await fetch(`${STATS_API}?${params.toString()}`, { signal });
  if (!res.ok) return null;
  const data: BF6Stats = await res.json();
  return data.id && data.hasResults !== false ? data : null;
}

const statsById = (a: Account, signal: AbortSignal) =>
  fetchPlayerStats(
    {
      playerid: String(a.personaId),
      nucleus_id: String(a.nucleusId),
      platform: a.platform,
    },
    signal
  );

// Every account with this exact name, with its kills. Uses the player search
// (one call, all platforms); if that finds nothing (no match or rate limited)
// tries a stats name lookup on each platform.
async function findAccounts(
  name: string,
  signal: AbortSignal
): Promise<{ choice: AccountChoice; stats: BF6Stats | null }[]> {
  const lower = name.toLowerCase();
  const hits = (await searchPlayers(name, signal)).filter(
    (r) => nameOf(r).toLowerCase() === lower
  );

  if (hits.length) {
    return Promise.all(
      hits.map(async (r) => {
        const account: Account = {
          name: nameOf(r),
          platform: toStatsPlatform(r.platform),
          personaId: r.personaId,
          nucleusId: r.nucleusId,
        };
        const stats = await statsById(account, signal).catch(() => null);
        return { choice: { ...account, kills: stats?.kills ?? null }, stats };
      })
    );
  }

  const found = await Promise.all(
    LOOKUP_PLATFORMS.map((platform) =>
      fetchPlayerStats({ name, platform }, signal).catch(() => null)
    )
  );
  const seen = new Set<string>();
  const out: { choice: AccountChoice; stats: BF6Stats | null }[] = [];
  found.forEach((stats, i) => {
    if (!stats || seen.has(String(stats.id))) return;
    seen.add(String(stats.id));
    out.push({
      choice: {
        name: stats.userName || name,
        platform: LOOKUP_PLATFORMS[i],
        personaId: stats.id,
        nucleusId: stats.userId,
        kills: stats.kills ?? null,
      },
      stats,
    });
  });
  return out;
}

// Load one player for /multiple: the pinned account, else the account with the
// most kills (the same name can exist on several platforms, some empty).
// Called straight from the browser (static export has no API routes, and the
// POST /bf6/multiple/ endpoint is not CORS enabled).
async function loadPlayer(
  name: string,
  platform: string,
  signal: AbortSignal
): Promise<BF6Stats | null> {
  try {
    let stats: BF6Stats | null = null;
    let account: Account | undefined = pins.get(name.toLowerCase());
    if (account) {
      stats = await fetchPlayerStats(playerParams(name, platform), signal);
    } else {
      const found = await findAccounts(name, signal);
      const best = found.reduce<(typeof found)[number] | null>(
        (b, f) => (!b || (f.choice.kills ?? -1) > (b.choice.kills ?? -1) ? f : b),
        null
      );
      account = best?.choice;
      stats = best?.stats ?? null;
    }
    return stats ? { ...stats, userName: stats.userName || account?.name || name } : null;
  } catch (err) {
    if (signal.aborted) throw err;
    return null;
  }
}

let choicesController: AbortController | null = null;
let statsController: AbortController | null = null;
let profileController: AbortController | null = null;
let multipleController: AbortController | null = null;

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Search state
  searchInput: "",
  playerName: "",
  platform: DEFAULT_PLATFORM,
  separation: false,
  setSearchInput: (v) => set({ searchInput: v }),
  setPlatform: (v) => set({ platform: v }),
  setSeparation: (v) => set({ separation: v }),

  choices: null,
  choicesLoading: false,

  pinPlatform: (name, platform) => {
    pins.set(name.toLowerCase(), { name, platform });
    set({ searchInput: name, platform });
  },

  chooseAccount: (c) => {
    const { playerName } = get();
    pins.set(playerName.toLowerCase(), c);
    set({ platform: c.platform, choices: null });
    get().loadAll();
  },

  dismissChoices: () => {
    choicesController?.abort();
    set({ choices: null, choicesLoading: false });
  },

  handleSearch: (e) => {
    e.preventDefault();
    const trimmed = get().searchInput.trim();
    if (!trimmed) return;
    get().dismissChoices();
    set({ playerName: trimmed });
    setTimeout(async () => {
      // /multiple resolves each name itself; a pinned name is already known
      if (get().multipleActive || pins.has(trimmed.toLowerCase())) {
        get().loadAll();
        return;
      }
      const controller = new AbortController();
      choicesController = controller;
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
      set({ choicesLoading: true });
      let found: Awaited<ReturnType<typeof findAccounts>> = [];
      try {
        found = await findAccounts(trimmed, controller.signal);
      } catch {
        if (choicesController !== controller) return;
      } finally {
        clearTimeout(timeoutId);
      }
      if (get().playerName !== trimmed) return;
      set({ choicesLoading: false });
      if (found.length === 1) {
        pins.set(trimmed.toLowerCase(), found[0].choice);
        set({ platform: found[0].choice.platform });
      } else if (found.length > 1) {
        // Same name on several platforms: let the user pick
        set({
          choices: found
            .map((f) => f.choice)
            .sort((a, b) => (b.kills ?? -1) - (a.kills ?? -1)),
        });
        return;
      }
      // 0 found: loadAll reports "Player not found"
      get().loadAll();
    }, 0);
  },

  resetToDefault: () => {
    pins.clear();
    choicesController?.abort();
    set({
      choices: null,
      choicesLoading: false,
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
      multiple: null,
      multipleMissing: [],
      multipleError: null,
      multipleSyncedAt: null,
      multipleLoading: false,
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
        ...playerParams(playerName, platform),
        skip_battlelog: "true",
        lang: "en-us",
      });
      const res = await fetch(`${STATS_API}?${params.toString()}`, {
        signal: controller.signal,
      });
      if (res.status === 404) throw new Error(NOT_FOUND_MSG);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: BF6Stats = await res.json();
      if (!data.hasResults) {
        throw new Error(
          "Player not found. Please check the username and platform."
        );
      }
      // Id lookups return userName: null
      data.userName ||= playerName;
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
        ...playerParams(playerName, platform),
        skip_battlelog: "true",
        lang: "en-us",
      });
      const res = await fetch(`${PROFILE_API}?${params.toString()}`, {
        signal: controller.signal,
      });
      if (res.status === 404) throw new Error(NOT_FOUND_MSG);
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

    if (get().multipleActive) {
      await get().fetchMultiple();
      return;
    }

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

  // Multiple
  multiple: null,
  multipleMissing: [],
  multipleLoading: false,
  multipleError: null,
  multipleSyncedAt: null,
  multipleActive: false,
  setMultipleActive: (v) => set({ multipleActive: v }),

  fetchMultiple: async () => {
    const { playerName } = get();
    if (!playerName) return;

    multipleController?.abort();
    const controller = new AbortController();
    multipleController = controller;
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS * 2);

    set({ multipleLoading: true, multipleError: null });

    try {
      const { platform } = get();
      const names = parseNames(playerName);
      const loaded = await Promise.all(
        names.map((n) => loadPlayer(n, platform, controller.signal))
      );
      const players = loaded.filter((r): r is BF6Stats => r !== null);
      const missing = names.filter((_, i) => !loaded[i]);
      if (players.length === 0) {
        throw new Error(
          "Player not found. Please check the username and platform."
        );
      }

      clearTimeout(timeoutId);
      // Ignore if the user searched for someone else meanwhile
      if (get().playerName !== playerName) return;
      set({
        multiple: players,
        multipleMissing: missing,
        multipleError: null,
        multipleLoading: false,
        multipleSyncedAt: Date.now(),
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (!controller.signal.aborted) {
        set({
          multipleError:
            err instanceof Error ? err.message : "Failed to fetch stats",
          multiple: null,
          multipleLoading: false,
        });
      } else if (multipleController === controller) {
        set({
          multipleError:
            "Request timed out. The server did not respond in time. Please try again.",
          multiple: null,
          multipleLoading: false,
        });
      }
    }
  },
}));