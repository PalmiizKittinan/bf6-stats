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
  const {
    searchInput,
    setSearchInput,
    platform,
    setPlatform,
    separation,
    setSeparation,
    handleSearch,
  } = useSearch();
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

  const navLinks = [
    { href: "/profile", label: "Profile", icon: "👤", active: pathname === "/profile" || pathname === "/" },
    { href: "/stats", label: "Stats", icon: "📊", active: pathname === "/stats" },
  ];

  return (
    <nav className="tw-navbar-sticky w-full px-3 pt-3">
      <div className="tw-navbar-shell max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3 px-4 py-2.5">
        {/* Brand */}
        <span className="flex items-center gap-2.5 font-bold text-lg">
          <span className="tw-brand-mark">BF6</span>
          <span className="leading-tight">
            <span className="block tracking-tight" style={{ color: "var(--bf6-text-strong)" }}>Stats Dashboard</span>
            <span className="block tw-eyebrow" style={{ fontSize: "0.58rem" }}>Battlefield 6</span>
          </span>
        </span>

        {/* Nav Tabs */}
        <div className="tw-segmented">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`tw-segmented-btn ${link.active ? "tw-segmented-btn-active" : ""}`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {/* Search Form: platform | input | button in one pill */}
          <form className="flex items-center gap-2" onSubmit={handleSearch}>
            <div className="tw-search-group">
              <select
                id="platform-select-tw"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                aria-label="Platform"
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
                style={{ minWidth: "140px", width: "100%" }}
              />
              <button
                id="search-button-tw"
                type="submit"
                className="tw-btn tw-btn-primary"
              >
                🔍 Search
              </button>
            </div>

            {/* Separate stats per season */}
            <label
              htmlFor="separation-checkbox-tw"
              className="flex items-center gap-1.5 text-sm cursor-pointer select-none"
              style={{ color: "var(--bf6-text)" }}
              title="If it also needs to return the stats seperated by gamemode and season"
            >
              <input
                id="separation-checkbox-tw"
                type="checkbox"
                checked={separation}
                onChange={(e) => setSeparation(e.target.checked)}
                style={{ accentColor: "var(--bf6-accent)" }}
              />
              &nbsp;By Season
            </label>

            {/* Save button */}
            <button
              id="save-name-button-tw"
              type="button"
              className="tw-btn tw-btn-icon"
              style={{
                borderColor: isSaved ? "var(--bf6-accent)" : "var(--bf6-success, #22c55e)",
                color: isSaved ? "var(--bf6-accent)" : "var(--bf6-success, #22c55e)",
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
                className="tw-btn"
                style={{ height: 34, padding: "0 12px" }}
                title="Saved player names"
                onClick={() => setShowSavedMenu((prev) => !prev)}
              >
                📋
                {savedNames.length > 0 && (
                  <span
                    className="min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full text-[0.65rem] font-bold text-white"
                    style={{ background: "var(--bf6-grad-fill)" }}
                  >
                    {savedNames.length}
                  </span>
                )}
              </button>

              {showSavedMenu && (
                <div
                  className="tw-fade-in tw-glass-card tw-glass-static tw-scrollbar-thin absolute right-0 mt-2 z-50 overflow-y-auto p-1.5"
                  style={{
                    minWidth: "260px",
                    maxHeight: "300px",
                    background: "var(--bf6-dark)",
                  }}
                >
                  <div className="tw-eyebrow px-3 pt-2 pb-1">Saved players</div>
                  {savedNames.length === 0 ? (
                    <span className="block px-3 py-3 text-sm" style={{ color: "var(--bf6-text-muted)" }}>
                      No saved names yet
                    </span>
                  ) : (
                    savedNames.map((saved, index) => (
                      <div
                        key={`${saved.name}-${saved.platform}-${index}`}
                        className="flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors"
                        style={{ backgroundColor: "transparent" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bf6-search-bg)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <span
                          onClick={() => selectSavedName(saved)}
                          className="flex-grow"
                        >
                          <span className="font-semibold" style={{ color: "var(--bf6-text-strong)" }}>{saved.name}</span>
                          <span className="tw-pill ml-2 py-0 text-[0.65rem]">
                            {saved.platform.toUpperCase()}
                          </span>
                        </span>
                        <button
                          type="button"
                          className="tw-btn tw-btn-xs ml-2"
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
          <div className="tw-divider hidden lg:block mx-1" />

          {/* CSS Framework Toggle */}
          <div className="tw-segmented">
            <button
              type="button"
              onClick={() => setFramework("bootstrap")}
              className={`tw-segmented-btn ${framework === "bootstrap" ? "tw-segmented-btn-active" : ""}`}
            >
              BS
            </button>
            <button
              type="button"
              onClick={() => setFramework("tailwind")}
              className={`tw-segmented-btn ${framework === "tailwind" ? "tw-segmented-btn-active" : ""}`}
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
