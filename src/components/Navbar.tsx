"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useSearch } from "./SearchProvider";
import { useCSSFramework } from "./CSSFrameworkProvider";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useAccountChoices, PLATFORM_LABELS, formatKills } from "./useAccountChoices";

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

export default function Navbar() {
  const pathname = usePathname();
  const {
    searchInput,
    setSearchInput,
    platform,
    separation,
    setSeparation,
    handleSearch,
  } = useSearch();
  const { framework, setFramework } = useCSSFramework();
  const { wrapperRef: accountsRef, ...accounts } = useAccountChoices();
  const pinPlatform = usePlayerStore((st) => st.pinPlatform);

  const [savedNames, setSavedNames] = useState<SavedName[]>([]);
  const [showSavedMenu, setShowSavedMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Load saved names from localStorage on mount
  useEffect(() => {
    setSavedNames(loadSavedNames());
  }, []);

  // Close dropdown when clicking outside
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
      // Avoid duplicates (same name + platform)
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
      pinPlatform(saved.name, saved.platform);
      setShowSavedMenu(false);
    },
    [pinPlatform]
  );

  const isSaved = savedNames.some(
    (s) =>
      s.name.toLowerCase() === searchInput.trim().toLowerCase() &&
      s.platform === platform
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bf6-navbar">
      <div className="container-fluid px-lg-4 justify-content-center gap-3">
        <span className="navbar-brand fw-bold m-0">
          <span className="stat-highlight">BF6</span> Stats Dashboard
        </span>
        <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap flex-xl-nowrap">
          {/* Nav Tabs - Left */}
          <Link
            href="/profile"
            className={`btn btn-sm ${
              pathname === "/profile" || pathname === "/"
                ? "btn-outline-danger"
                : "btn-outline-secondary"
            }`}
          >
            👤 Profile
          </Link>
          <Link
            href="/stats"
            className={`btn btn-sm ${
              pathname === "/stats" ? "btn-outline-danger" : "btn-outline-secondary"
            }`}
          >
            📊 Stats
          </Link>
          <Link
            href="/multiple"
            className={`btn btn-sm ${
              pathname === "/multiple" ? "btn-outline-danger" : "btn-outline-secondary"
            }`}
          >
            📈 Multiple
          </Link>

          <div
            className="vr d-none d-lg-block mx-2"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          />

          {/* Search */}
          <form className="d-flex gap-2 align-items-center" onSubmit={(e) => {
            accounts.dismiss();
            handleSearch(e);
          }}>
            <div className="position-relative" ref={accountsRef}>
              <input
                id="player-search-input"
                type="text"
                className="form-control form-control-sm search-input"
                placeholder={pathname === "/multiple" ? "Players, comma separated..." : "Search player..."}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && accounts.dismiss()}
                style={{ minWidth: "180px" }}
              />
              {(accounts.loading || accounts.choices) && (
                <div
                  className="dropdown-menu show mt-1"
                  style={{ position: "absolute", left: 0, zIndex: 1050, minWidth: "280px" }}
                >
                  {accounts.loading ? (
                    <span className="dropdown-item-text text-muted small">Finding accounts...</span>
                  ) : (
                    <>
                      <span className="dropdown-item-text text-muted small">
                        Found on several platforms, pick one:
                      </span>
                      {accounts.choices?.map((c) => (
                        <button
                          key={`${c.platform}-${c.personaId}`}
                          type="button"
                          className="dropdown-item d-flex justify-content-between align-items-center"
                          onClick={() => accounts.choose(c)}
                        >
                          <span>
                            <span className="fw-semibold">{c.name}</span>
                            <span className="badge bg-secondary ms-2" style={{ fontSize: "0.65rem" }}>
                              {PLATFORM_LABELS[c.platform] ?? c.platform.toUpperCase()}
                            </span>
                          </span>
                          <small className="text-muted ms-3">{formatKills(c.kills)}</small>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
            <button
              id="search-button"
              className="btn btn-sm"
              type="submit"
              style={{
                backgroundColor: "#e94560",
                color: "white",
                borderColor: "#e94560",
              }}
            >
              Search
            </button>

            {/* Separate stats per season */}
            <div className="form-check form-check-inline m-0" title="If it also needs to return the stats seperated by gamemode and season">
              <input
                id="separation-checkbox"
                type="checkbox"
                className="form-check-input"
                checked={separation}
                onChange={(e) => setSeparation(e.target.checked)}
              />
              <label
                htmlFor="separation-checkbox"
                className="form-check-label small text-light"
              >
                &nbsp;By Season
              </label>
            </div>

            {/* Save / Unsave current name */}
            <button
              id="save-name-button"
              type="button"
              className={`btn btn-sm ${isSaved ? "btn-warning" : "btn-outline-success"}`}
              title={isSaved ? "Already saved" : "Save this player name"}
              onClick={saveCurrentName}
              disabled={isSaved || !searchInput.trim()}
            >
              {isSaved ? "⭐" : "💾"}
            </button>

            {/* Saved names dropdown */}
            <div className="position-relative" ref={menuRef}>
              <button
                id="saved-names-toggle"
                type="button"
                className="btn btn-sm btn-outline-info"
                title="Saved player names"
                onClick={() => setShowSavedMenu((prev) => !prev)}
              >
                📋{savedNames.length > 0 && (
                  <span className="ms-1 badge bg-info text-dark" style={{ fontSize: "0.6rem" }}>
                    {savedNames.length}
                  </span>
                )}
              </button>

              {showSavedMenu && (
                <div
                  className="dropdown-menu show end-0 mt-1"
                  style={{
                    position: "absolute",
                    right: 0,
                    zIndex: 1050,
                    minWidth: "260px",
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {savedNames.length === 0 ? (
                    <span className="dropdown-item text-muted small">
                      No saved names yet
                    </span>
                  ) : (
                    savedNames.map((saved, index) => (
                      <div
                        key={`${saved.name}-${saved.platform}-${index}`}
                        className="dropdown-item d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                      >
                        <span
                          onClick={() => selectSavedName(saved)}
                          className="flex-grow-1"
                        >
                          <span className="fw-semibold">{saved.name}</span>
                          <span className="badge bg-secondary ms-2" style={{ fontSize: "0.65rem" }}>
                            {saved.platform.toUpperCase()}
                          </span>
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger ms-2 py-0 px-1"
                          title="Delete"
                          style={{ fontSize: "0.7rem", lineHeight: 1 }}
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

          <div
            className="vr d-none d-lg-block mx-2"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          />

          {/* CSS Framework Toggle */}
          <div className="btn-group btn-group-sm">
            <button
              type="button"
              className={`btn ${framework === "bootstrap" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setFramework("bootstrap")}
              title="Bootstrap"
            >
              BS
            </button>
            <button
              type="button"
              className={`btn ${framework === "tailwind" ? "btn-info" : "btn-outline-secondary"}`}
              onClick={() => setFramework("tailwind")}
              title="Tailwind"
            >
              TW
            </button>
          </div>

          {/* Theme Toggle - Far right */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}