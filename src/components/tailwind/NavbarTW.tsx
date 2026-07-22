"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggleTW from "./ThemeToggleTW";
import { useSearch } from "@/components/SearchProvider";
import { useCSSFramework } from "@/components/CSSFrameworkProvider";

interface SavedName {
  name: string;
  platform: string;
}

const STORAGE_KEY = "bf6-saved-names";

function loadSavedNames(): SavedName[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistSavedNames(names: SavedName[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
}

export default function NavbarTW() {
  const pathname = usePathname();
  const { searchInput, setSearchInput, platform, setPlatform, handleSearch } =
    useSearch();
  const { framework, setFramework } = useCSSFramework();

  const [savedNames, setSavedNames] = useState<SavedName[]>([]);
  const [showSavedMenu, setShowSavedMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSavedNames(loadSavedNames());
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowSavedMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveCurrentName = useCallback(() => {
    const trimmed = searchInput.trim();
    if (!trimmed) return;
    const current: SavedName = { name: trimmed, platform };
    setSavedNames((prev) => {
      const exists = prev.some(
        (s) => s.name.toLowerCase() === current.name.toLowerCase() && s.platform === current.platform
      );
      if (exists) return prev;
      const updated = [...prev, current];
      persistSavedNames(updated);
      return updated;
    });
  }, [searchInput, platform]);

  const deleteSavedName = useCallback((index: number) => {
    setSavedNames((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      persistSavedNames(updated);
      return updated;
    });
  }, []);

  const selectSavedName = useCallback(
    (saved: SavedName) => {
      setSearchInput(saved.name);
      setPlatform(saved.platform);
      setShowSavedMenu(false);
    },
    [setSearchInput, setPlatform]
  );

  const isSaved = savedNames.some(
    (s) =>
      s.name.toLowerCase() === searchInput.trim().toLowerCase() &&
      s.platform === platform
  );

  // Theme-aware nav background uses bf6-navbar class + CSS variables
  return (
    <nav
      className="w-full px-4 py-3"
      style={{
        background: "var(--bf6-header-bg)",
        borderBottom: "1px solid var(--bf6-border)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        {/* Brand */}
        <span className="font-bold text-lg">
          <span className="stat-highlight">BF6</span>{" "}
          <span style={{ color: "var(--bf6-text-strong)" }}>Stats Dashboard</span>
        </span>

        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {/* Nav Tabs */}
          <Link
            href="/profile"
            className="px-3 py-1.5 rounded-md text-sm font-medium border transition-colors"
            style={{
              borderColor: pathname === "/profile" || pathname === "/" ? "var(--bf6-accent)" : "var(--bf6-border-hover)",
              color: pathname === "/profile" || pathname === "/" ? "var(--bf6-accent)" : "var(--bf6-text-muted)",
              backgroundColor: pathname === "/profile" || pathname === "/" ? "var(--bf6-search-bg)" : "transparent",
            }}
          >
            👤 Profile
          </Link>
          <Link
            href="/stats"
            className="px-3 py-1.5 rounded-md text-sm font-medium border transition-colors"
            style={{
              borderColor: pathname === "/stats" ? "var(--bf6-accent)" : "var(--bf6-border-hover)",
              color: pathname === "/stats" ? "var(--bf6-accent)" : "var(--bf6-text-muted)",
              backgroundColor: pathname === "/stats" ? "var(--bf6-search-bg)" : "transparent",
            }}
          >
            📊 Stats
          </Link>

          {/* Divider */}
          <div className="hidden lg:block w-px h-6 mx-2" style={{ borderColor: "var(--bf6-border)" }} />

          {/* Search Form */}
          <form className="flex items-center gap-2" onSubmit={handleSearch}>
            <select
              id="platform-select-tw"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="px-2 py-1.5 rounded-md text-sm border focus:outline-none"
              style={{
                width: "100px",
                backgroundColor: "var(--bf6-search-bg)",
                borderColor: "var(--bf6-border-hover)",
                color: "var(--bf6-text-strong)",
              }}
            >
              <option value="ea">EA</option>
              <option value="pc">PC</option>
              <option value="xbox">Xbox</option>
              <option value="psn">PlayStation</option>
            </select>
            <input
              id="player-search-input-tw"
              type="text"
              placeholder="Search player..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="px-3 py-1.5 rounded-md text-sm border focus:outline-none"
              style={{
                minWidth: "150px",
                backgroundColor: "var(--bf6-search-bg)",
                borderColor: "var(--bf6-border-hover)",
                color: "var(--bf6-text-strong)",
              }}
            />
            <button
              id="search-button-tw"
              type="submit"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-white border cursor-pointer transition-colors hover:opacity-85"
              style={{
                borderColor: "var(--bf6-accent)",
                backgroundColor: "var(--bf6-accent)",
              }}
            >
              Search
            </button>

            {/* Save button */}
            <button
              id="save-name-button-tw"
              type="button"
              className="px-2 py-1.5 rounded-md text-sm border cursor-pointer transition-colors"
              style={{
                borderColor: isSaved ? "var(--bf6-warning, #f59e0b)" : "var(--bf6-success, #10b981)",
                color: isSaved ? "var(--bf6-warning, #f59e0b)" : "var(--bf6-success, #10b981)",
                backgroundColor: isSaved ? "var(--bf6-search-bg)" : "transparent",
              }}
              title={isSaved ? "Already saved" : "Save this player name"}
              onClick={saveCurrentName}
              disabled={isSaved || !searchInput.trim()}
            >
              {isSaved ? "⭐" : "💾"}
            </button>

            {/* Saved names dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                id="saved-names-toggle-tw"
                type="button"
                className="px-2 py-1.5 rounded-md text-sm border cursor-pointer transition-colors"
                style={{
                  borderColor: "var(--bf6-accent)",
                  color: "var(--bf6-accent)",
                  backgroundColor: "transparent",
                }}
                title="Saved player names"
                onClick={() => setShowSavedMenu((prev) => !prev)}
              >
                📋
                {savedNames.length > 0 && (
                  <span
                    className="ml-1 px-1.5 py-0.5 rounded-full text-xs text-white"
                    style={{ backgroundColor: "var(--bf6-accent)" }}
                  >
                    {savedNames.length}
                  </span>
                )}
              </button>

              {showSavedMenu && (
                <div
                  className="absolute right-0 mt-1 z-50 rounded-lg shadow-lg border overflow-y-auto"
                  style={{
                    minWidth: "260px",
                    maxHeight: "300px",
                    background: "var(--bf6-dark)",
                    borderColor: "var(--bf6-border)",
                  }}
                >
                  {savedNames.length === 0 ? (
                    <span className="block px-4 py-2 text-sm" style={{ color: "var(--bf6-text-muted)" }}>
                      No saved names yet
                    </span>
                  ) : (
                    savedNames.map((saved, index) => (
                      <div
                        key={`${saved.name}-${saved.platform}-${index}`}
                        className="flex items-center justify-between px-4 py-2 cursor-pointer transition-colors"
                        style={{ backgroundColor: "transparent" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bf6-search-bg)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <span
                          onClick={() => selectSavedName(saved)}
                          className="flex-grow"
                        >
                          <span className="font-semibold" style={{ color: "var(--bf6-text-strong)" }}>{saved.name}</span>
                          <span
                            className="ml-2 px-1.5 py-0.5 rounded text-xs"
                            style={{ backgroundColor: "var(--bf6-search-bg)", color: "var(--bf6-text-muted)" }}
                          >
                            {saved.platform.toUpperCase()}
                          </span>
                        </span>
                        <button
                          type="button"
                          className="ml-2 px-1.5 py-0.5 rounded border text-xs cursor-pointer transition-colors hover:opacity-80"
                          style={{ borderColor: "var(--bf6-border-hover)", color: "var(--bf6-text-muted)" }}
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSavedName(index);
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </form>

          {/* Divider */}
          <div className="hidden lg:block w-px h-6 mx-2" style={{ borderColor: "var(--bf6-border)" }} />

          {/* CSS Framework Toggle */}
          <div className="flex gap-1 rounded-md p-0.5" style={{ border: "1px solid var(--bf6-border-hover)" }}>
            <button
              type="button"
              onClick={() => setFramework("bootstrap")}
              className="px-2 py-1 rounded text-xs font-medium cursor-pointer transition-all"
              style={{
                backgroundColor: framework === "bootstrap" ? "var(--bf6-accent)" : "transparent",
                color: framework === "bootstrap" ? "#fff" : "var(--bf6-text-muted)",
              }}
            >
              BS
            </button>
            <button
              type="button"
              onClick={() => setFramework("tailwind")}
              className="px-2 py-1 rounded text-xs font-medium cursor-pointer transition-all"
              style={{
                backgroundColor: framework === "tailwind" ? "var(--bf6-accent)" : "transparent",
                color: framework === "tailwind" ? "#fff" : "var(--bf6-text-muted)",
              }}
            >
              TW
            </button>
          </div>

          {/* Theme Toggle */}
          <ThemeToggleTW />
        </div>
      </div>
    </nav>
  );
}