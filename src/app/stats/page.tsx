"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearch } from "@/components/SearchProvider";
import { BF6Stats } from "@/types/bf6";
import PlayerHeader from "@/components/PlayerHeader";
import StatCards from "@/components/StatCards";
import WeaponsTable from "@/components/WeaponsTable";
import VehiclesTable from "@/components/VehiclesTable";
import DamageBreakdown from "@/components/DamageBreakdown";
import ClassesTable from "@/components/ClassesTable";
import MapsTable from "@/components/MapsTable";
import GameModesTable from "@/components/GameModesTable";
import GadgetsTable from "@/components/GadgetsTable";

const API_BASE = "https://api.gametools.network/bf6/stats/";

export default function StatsPage() {
  const { playerName, platform, resetToDefault } = useSearch();
  const [stats, setStats] = useState<BF6Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const doFetch = useCallback(async (name: string, plat: string) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

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
      const res = await fetch(`${API_BASE}?${params.toString()}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: BF6Stats = await res.json();
      if (!data.hasResults) {
        throw new Error("Player not found. Please check the username and platform.");
      }
      setStats(data);
      setError(null);
      setLoading(false);
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : "Failed to fetch stats");
        setStats(null);
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    doFetch(playerName, platform);
  }, [playerName, platform, doFetch]);

  return (
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
              onClick={resetToDefault}
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

          {stats.classes && <ClassesTable classes={stats.classes} />}
          {stats.gameModes && <GameModesTable gameModes={stats.gameModes} />}

          {stats.seasons && <SeasonStatsSection seasons={stats.seasons} />}

          {stats.weapons && <WeaponsTable weapons={stats.weapons} />}
          {stats.vehicles && <VehiclesTable vehicles={stats.vehicles} />}
          {stats.maps && <MapsTable maps={stats.maps} />}
          {stats.gadgets && <GadgetsTable gadgets={stats.gadgets} />}
        </>
      )}
    </div>
  );
}

function SeasonStatsSection({ seasons }: { seasons: BF6Stats["seasons"] }) {
  const activeSeasons = seasons.filter((s) => s.modes.length > 0);
  if (activeSeasons.length === 0) return null;

  return (
    <div className="mb-4">
      <h5 className="section-title">📅 Season Stats</h5>
      <div className="row g-3">
        {activeSeasons.map((season) => (
          <div key={season.seasonId} className="col-12 col-md-6 col-lg-4">
            <div className="season-badge p-3 h-100">
              <h6 className="text-white fw-bold mb-3">{season.season}</h6>
              {season.modes.map((mode) => (
                <div key={mode.modeId}>
                  <div className="mb-2">
                    <span className="badge bg-primary me-2">{mode.mode}</span>
                    <span className="badge bg-success me-2">{mode.wins}W</span>
                    <span className="badge bg-danger">{mode.losses}L</span>
                  </div>
                  <div className="row g-2 mt-1">
                    <div className="col-6">
                      <div className="text-muted small">Matches</div>
                      <div className="fw-bold text-white">{mode.matches}</div>
                    </div>
                    <div className="col-6">
                      <div className="text-muted small">Win Rate</div>
                      <div className="fw-bold text-success">
                        {mode.matches > 0
                          ? ((mode.wins / mode.matches) * 100).toFixed(1)
                          : 0}
                        %
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-muted small">Kills</div>
                      <div className="fw-bold text-white">{mode.kills.toLocaleString()}</div>
                    </div>
                    <div className="col-6">
                      <div className="text-muted small">K/D</div>
                      <div className="fw-bold stat-highlight">{mode.killDeath.toFixed(2)}</div>
                    </div>
                    <div className="col-6">
                      <div className="text-muted small">Score</div>
                      <div className="fw-bold text-white">{mode.score.toLocaleString()}</div>
                    </div>
                    <div className="col-6">
                      <div className="text-muted small">Time</div>
                      <div className="fw-bold text-white">{mode.timePlayed}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}