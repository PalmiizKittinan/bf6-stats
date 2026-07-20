"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

const DEFAULT_NAME = "";
const DEFAULT_PLATFORM = "ea";

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
  playerName: DEFAULT_NAME,
  platform: DEFAULT_PLATFORM,
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
  const [playerName, setPlayerName] = useState("");
  const [platform, setPlatform] = useState(DEFAULT_PLATFORM);
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = searchInput.trim();
      if (trimmed) {
        setPlayerName(trimmed);
      }
    },
    [searchInput]
  );

  const resetToDefault = useCallback(() => {
    setPlayerName(DEFAULT_NAME);
    setPlatform(DEFAULT_PLATFORM);
    setSearchInput("");
  }, []);

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