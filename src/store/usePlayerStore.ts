import { create } from "zustand";
import { BF6Stats, BF6Profile } from "@/types/bf6";

const STATS_API = "https://api.gametools.network/bf6/stats/";
const PROFILE_API = "https://api.gametools.network/bf6/profile/";
const DEFAULT_PLATFORM = "ea";
const TIMEOUT_MS = 10_000;

interface PlayerStore {
  // Search state
  searchInput: string;
  playerName: string;
  platform: string;
  setSearchInput: (v: string) => void;
  setPlatform: (v: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  resetToDefault: () => void;

  // Stats state
  stats: BF6Stats | null;
  statsLoading: boolean;
  statsError: string | null;
  fetchStats: () => Promise<void>;

  // Profile state
  profile: BF6Profile | null;
  profileLoading: boolean;
  profileError: string | null;
  fetchProfile: () => Promise<void>;

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
  setSearchInput: (v) => set({ searchInput: v }),
  setPlatform: (v) => set({ platform: v }),

  handleSearch: (e) => {
    e.preventDefault();
    const { searchInput, platform } = get();
    const trimmed = searchInput.trim();
    if (!trimmed) return;
    set({ playerName: trimmed, platform });
    // Fetch both stats and profile
    setTimeout(() => {
      get().fetchStats();
      get().fetchProfile();
    }, 0);
  },

  resetToDefault: () => {
    set({
      searchInput: "",
      playerName: "",
      platform: DEFAULT_PLATFORM,
      stats: null,
      statsError: null,
      statsLoading: false,
      profile: null,
      profileError: null,
      profileLoading: false,
    });
  },

  // Stats
  stats: null,
  statsLoading: false,
  statsError: null,

  fetchStats: async () => {
    const { playerName, platform } = get();
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
        seperation: "false",
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
      set({ stats: data, statsError: null, statsLoading: false });
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
      set({ profile: data, profileError: null, profileLoading: false });
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

  refreshAll: async () => {
    const { playerName } = get();
    if (!playerName) return;
    get().fetchStats();
    get().fetchProfile();
  },
}));