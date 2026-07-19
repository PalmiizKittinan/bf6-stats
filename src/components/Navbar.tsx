"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useSearch } from "./SearchProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { searchInput, setSearchInput, platform, setPlatform, handleSearch } =
    useSearch();

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
              type="text"
              className="form-control form-control-sm search-input"
              placeholder="Search player..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ minWidth: "150px" }}
            />
            <button
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