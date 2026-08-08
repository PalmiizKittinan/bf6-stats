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

const PLAYER_API = "https://api.gametools.network/bf6/player/";
const MULTIPLE_API = "https://api.gametools.network/bf6/multiple/";

interface PlayerLookupResult {
  username: string;
  displayName: string;
  status: string;
  visibility: string;
  platform: string;
  nucleusId: string;
  personaId: string;
  createdAt: string;
  platformId: string;
}

interface PlayerLookupResponse {
  results: PlayerLookupResult[];
}

async function lookupPlayer(
  name: string,
  signal?: AbortSignal
): Promise<PlayerLookupResult> {
  const params = new URLSearchParams({ name, limit: "10" });
  const res = await fetch(`${PLAYER_API}?${params.toString()}`, { signal });
  if (!res.ok) throw new Error(`Player lookup failed: ${res.status}`);
  const data: PlayerLookupResponse = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("Player not found. Please check the username.");
  }
  return data.results[0];
}

async function fetchMultiplayerStats(
  nucleusId: string,
  personaId: string,
  platform: string,
  signal?: AbortSignal
): Promise<BF6Stats> {
  const body = [
    {
      player_id: personaId,
      user_id: nucleusId,
      platform: platform,
    },
  ];
  const params = new URLSearchParams({
    categories: "multiplayer",
    raw: "false",
    format_values: "true",
    seperation: "false",
    lang: "en-us",
  });
  const res = await fetch(`${MULTIPLE_API}?${params.toString()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) throw new Error(`Multiplayer API error: ${res.status}`);
  const data: BF6Stats = await res.json();
  if (!data.hasResults) {
    throw new Error("No multiplayer stats found for this player.");
  }
  return data;
}

export default function MultiplayerPage() {
  const { playerName, platform, resetToDefault } = useSearch();
  const [stats, setStats] = useState<BF6Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<string>("");
  const controllerRef = useRef<AbortController | null>(null);

  const doFetch = useCallback(async (name: string, plat: string) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      setStep("Looking up player...");
      const player = await lookupPlayer(name, controller.signal);

      setStep(`Fetching multiplayer stats for ${player.displayName}...`);
      const mpStats = await fetchMultiplayerStats(
        player.nucleusId,
        player.personaId,
        plat,
        controller.signal
      );

      setStats(mpStats);
      setError(null);
      setLoading(false);
      setStep("");
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : "Failed to fetch multiplayer stats");
        setStats(null);
        setLoading(false);
        setStep("");
      }
    }
  }, []);

  useEffect(() => {
    if (playerName) {
      setLoading(true);
      doFetch(playerName, platform);
    } else {
      setStats(null);
      setError(null);
      setLoading(false);
    }
  }, [playerName, platform, doFetch]);

  const handleRefresh = useCallback(() => {
    if (playerName) {
      setLoading(true);
      doFetch(playerName, platform);
    }
  }, [playerName, platform, doFetch]);

  return (
    <div className="container py-4">
      {playerName && !loading && (
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-sm btn-outline-info" onClick={handleRefresh}>
            🔄 Refresh
          </button>
        </div>
      )}

      {!playerName && !loading && (
        <div className="text-center py-5">
          <div className="stats-card p-5 mx-auto" style={{ maxWidth: 520 }}>
            <div className="fs-1 mb-3">👥</div>
            <h3 className="fw-bold mb-3" style={{ color: "var(--bf6-text-strong)" }}>
              Multiplayer Stats
            </h3>
            <p className="text-muted mb-0">
              Enter a player name in the search bar above to view multiplayer stats.
            </p>
          </div>
        </div>
      )}

      {playerName && loading && !stats && (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <div className="spinner-grow text-danger mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 style={{ color: "var(--bf6-text)" }}>
            {step || `Loading multiplayer stats for ${playerName}...`}
          </h5>
        </div>
      )}

      {playerName && loading && stats && (
        <div className="d-flex align-items-center justify-content-center py-2 mb-3">
          <div className="spinner-border spinner-border-sm text-danger me-2" role="status">
            <span className="visually-hidden">Refreshing...</span>
          </div>
          <span style={{ color: "var(--bf6-text)" }}>
            {step || "Refreshing data..."}
          </span>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-5">
          <div className="stats-card p-5 mx-auto" style={{ maxWidth: "500px" }}>
            <div className="fs-1 mb-3">⚠️</div>
            <h4 className="fw-bold mb-3" style={{ color: "var(--bf6-text-strong)" }}>Error</h4>
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