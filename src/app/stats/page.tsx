"use client";

import { useCSSFramework } from "@/components/CSSFrameworkProvider";
import { usePlayerStore } from "@/store/usePlayerStore";
import PlayerHeader from "@/components/PlayerHeader";
import StatCards from "@/components/StatCards";
import WeaponsTable from "@/components/WeaponsTable";
import VehiclesTable from "@/components/VehiclesTable";
import DamageBreakdown from "@/components/DamageBreakdown";
import ClassesTable from "@/components/ClassesTable";
import MapsTable from "@/components/MapsTable";
import GameModesTable from "@/components/GameModesTable";
import GadgetsTable from "@/components/GadgetsTable";
import StatsPageTW from "@/components/tailwind/StatsPageTW";
import { BF6Stats } from "@/types/bf6";

export default function StatsPage() {
  const { framework } = useCSSFramework();

  if (framework === "tailwind") {
    return <StatsPageTW />;
  }

  return <StatsPageBootstrap />;
}

function StatsPageBootstrap() {
  const {
    playerName,
    stats,
    statsLoading,
    statsError,
    fetchStats,
    resetToDefault,
  } = usePlayerStore();

  const handleRefresh = () => {
    if (playerName) {
      fetchStats();
    }
  };

  return (
    <div className="container py-4">
      {playerName && !statsLoading && (
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-sm btn-outline-info"
            onClick={handleRefresh}
          >
            🔄 Refresh
          </button>
        </div>
      )}

      {!playerName && !statsLoading && (
        <div className="text-center py-5">
          <div className="stats-card p-5 mx-auto" style={{ maxWidth: 520 }}>
            <div className="fs-1 mb-3">🎮</div>
            <h3 className="text-white fw-bold mb-3">Welcome to BF6 Stats</h3>
            <p className="text-muted mb-0">
              Please enter a player name in the search bar above to start tracking stats.
            </p>
          </div>
        </div>
      )}

      {playerName && statsLoading && !stats && (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <div className="spinner-grow text-danger mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-light">Loading stats for {playerName}...</h5>
        </div>
      )}

      {playerName && statsLoading && stats && (
        <div className="d-flex align-items-center justify-content-center py-2 mb-3">
          <div className="spinner-border spinner-border-sm text-danger me-2" role="status">
            <span className="visually-hidden">Refreshing...</span>
          </div>
          <span className="text-light">Refreshing data...</span>
        </div>
      )}

      {statsError && !statsLoading && (
        <div className="text-center py-5">
          <div className="stats-card p-5 mx-auto" style={{ maxWidth: "500px" }}>
            <div className="fs-1 mb-3">⚠️</div>
            <h4 className="text-white mb-3">Error</h4>
            <p className="text-muted">{statsError}</p>
            <button
              className="btn btn-sm mt-2"
              style={{ backgroundColor: "#e94560", color: "white", borderColor: "#e94560" }}
              onClick={resetToDefault}
            >
              Clear Search
            </button>
          </div>
        </div>
      )}

      {stats && !statsLoading && (
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