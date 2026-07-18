"use client";

import { useState, useEffect, useCallback } from "react";
import { BF6Stats } from "@/types/bf6";
import PlayerHeader from "./PlayerHeader";
import StatCards from "./StatCards";
import WeaponsTable from "./WeaponsTable";
import VehiclesTable from "./VehiclesTable";
import SeasonStats from "./SeasonStats";
import DamageBreakdown from "./DamageBreakdown";
import WeaponTypesChart from "./WeaponTypesChart";

const DEFAULT_NAME = "AiZ3Nnuazz";
const DEFAULT_PLATFORM = "ea";

const API_BASE = "https://api.gametools.network/bf6/stats/";

export default function Dashboard() {
  const [stats, setStats] = useState<BF6Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState(DEFAULT_NAME);
  const [platform, setPlatform] = useState(DEFAULT_PLATFORM);
  const [searchInput, setSearchInput] = useState(DEFAULT_NAME);

  const fetchStats = useCallback(async (name: string, plat: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        categories: "multiplayer",
        raw: "false",
        format_values: "true",
        seperation: "false",
        name: name,
        platform: plat,
        skip_battlelog: "true",
        lang: "en-us",
      });
      const res = await fetch(`${API_BASE}?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      const data: BF6Stats = await res.json();
      if (!data.hasResults) {
        throw new Error("Player not found. Please check the username and platform.");
      }
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(playerName, platform);
  }, [playerName, platform, fetchStats]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) {
      setPlayerName(trimmed);
    }
  };

  return (
    <div className="min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "linear-gradient(135deg, #0f3460, #16213e)" }}>
        <div className="container">
          <span className="navbar-brand fw-bold">
            <span className="stat-highlight">BF6</span> Stats Dashboard
          </span>
          <form className="d-flex gap-2 ms-auto" onSubmit={handleSearch}>
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
              style={{ minWidth: "180px" }}
            />
            <button
              className="btn btn-sm"
              type="submit"
              style={{ backgroundColor: "#e94560", color: "white", borderColor: "#e94560" }}
            >
              Search
            </button>
          </form>
        </div>
      </nav>

      {/* Content */}
      <div className="container py-4">
        {loading && (
          <div className="d-flex flex-column align-items-center justify-content-center py-5">
            <div className="spinner-grow text-danger mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="text-light">Loading stats for {playerName}...</h5>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-5">
            <div className="stats-card p-5 mx-auto" style={{ maxWidth: "500px" }}>
              <div className="fs-1 mb-3">⚠️</div>
              <h4 className="text-white mb-3">Error</h4>
              <p className="text-muted">{error}</p>
              <button
                className="btn btn-sm mt-2"
                style={{ backgroundColor: "#e94560", color: "white", borderColor: "#e94560" }}
                onClick={() => fetchStats(DEFAULT_NAME, DEFAULT_PLATFORM)}
              >
                Load Default Player
              </button>
            </div>
          </div>
        )}

        {stats && !loading && (
          <>
            <PlayerHeader stats={stats} />
            <StatCards stats={stats} />
            <DamageBreakdown stats={stats} />
            <WeaponTypesChart stats={stats} />
            <SeasonStats seasons={stats.seasons} />
            {stats.weapons && <WeaponsTable weapons={stats.weapons} />}
            {stats.vehicles && <VehiclesTable vehicles={stats.vehicles} />}

            {/* Footer */}
            <footer className="text-center py-4 mt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-muted small mb-0">
                Data provided by{" "}
                <a
                  href="https://gametools.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                  style={{ color: "#e94560" }}
                >
                  GameTools Network
                </a>
                {" • "}
                Battlefield 6 Stats Dashboard
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}