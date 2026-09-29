"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

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