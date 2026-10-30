"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { loadSavedNames } from "@/store/savedNames";

interface SearchContextValue {
  playerName: string;
  platform: string;
  separation: boolean;
  searchInput: string;
  setSearchInput: (v: string) => void;
  setPlatform: (v: string) => void;
  setSeparation: (v: boolean) => void;
  handleSearch: (e: React.FormEvent) => void;
  resetToDefault: () => void;
}

const SearchContext = createContext<SearchContextValue>({
  playerName: "",
  platform: "ea",
  separation: false,
  searchInput: "",
  setSearchInput: () => {},
  setPlatform: () => {},
  setSeparation: () => {},
  handleSearch: () => {},
  resetToDefault: () => {},
});

export function useSearch() {
  return useContext(SearchContext);
}

export default function SearchProvider({ children }: { children: ReactNode }) {
  const {
    playerName,
    platform,
    separation,
    searchInput,
    setSearchInput,
    setPlatform,
    setSeparation,
    handleSearch,
    resetToDefault,
  } = usePlayerStore();

  // Show the auto-load saved player from its last fetch (no API call)
  useEffect(() => {
    const auto = loadSavedNames().find((s) => s.autoLoad);
    if (!auto) return;
    const store = usePlayerStore.getState();
    if (!store.restoreSnapshot(auto.name)) store.pinPlatform(auto.name, auto.platform);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        playerName,
        platform,
        separation,
        searchInput,
        setSearchInput,
        setPlatform,
        setSeparation,
        handleSearch,
        resetToDefault,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}