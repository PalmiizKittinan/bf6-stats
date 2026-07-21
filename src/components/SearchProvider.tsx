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
  searchInput: string;
  setSearchInput: (v: string) => void;
  setPlatform: (v: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  resetToDefault: () => void;
}

const SearchContext = createContext<SearchContextValue>({
  playerName: "",
  platform: "ea",
  searchInput: "",
  setSearchInput: () => {},
  setPlatform: () => {},
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
    searchInput,
    setSearchInput,
    setPlatform,
    handleSearch,
    resetToDefault,
  } = usePlayerStore();

  return (
    <SearchContext.Provider
      value={{
        playerName,
        platform,
        searchInput,
        setSearchInput,
        setPlatform,
        handleSearch,
        resetToDefault,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}