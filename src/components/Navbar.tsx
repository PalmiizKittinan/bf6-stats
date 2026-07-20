"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useSearch } from "./SearchProvider";

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
  const { searchInput, setSearchInput, platform, setPlatform, handleSearch } =
    useSearch();

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

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bf6-navbar">
      <div className="container">
        <span className="navbar-brand fw-bold">
          <span className="stat-highlight">BF6</span> Stats Dashboard
        </span>
        <div className="d-flex align-items-center gap-2 ms-auto flex-wrap">
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

          <div
            className="vr d-none d-lg-block mx-2"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          />

          {/* Search */}
          <form className="d-flex gap-2 align-items-center" onSubmit={handleSearch}>
            <select
              id="platform-select"
              className="form-select form-select-sm search-input"
              style={{ width: "100px" }}
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="ea">EA</option>
              <option value="pc">PC</option>
              <option value="xbox">Xbox</option>
              <option value="psn">PlayStation</option>
            </select>
            <input
              id="player-search-input"
              type="text"
              className="form-control form-control-sm search-input"
              placeholder="Search player..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ minWidth: "150px" }}
            />
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

          {/* Theme Toggle - Far right */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}