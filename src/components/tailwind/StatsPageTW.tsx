"use client";

import { useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import PlayerHeaderTW from "./PlayerHeaderTW";
import StatCardsTW from "./StatCardsTW";
import DamageBreakdown from "@/components/DamageBreakdown";
import ClassesTable from "@/components/ClassesTable";
import GameModesTable from "@/components/GameModesTable";
import WeaponsTable from "@/components/WeaponsTable";
import VehiclesTable from "@/components/VehiclesTable";
import MapsTable from "@/components/MapsTable";
import GadgetsTable from "@/components/GadgetsTable";
import { BF6Stats } from "@/types/bf6";

export default function StatsPageTW() {
  const { playerName, stats, statsLoading, statsError, fetchStats, resetToDefault } = usePlayerStore();

  const handleRefresh = () => { if (playerName) fetchStats(); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {playerName && !statsLoading && (
        <div className="flex justify-end mb-3">
          <button className="px-3 py-1.5 rounded-md text-sm border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 cursor-pointer transition-colors" onClick={handleRefresh}>
            🔄 Refresh
          </button>
        </div>
      )}

      {!playerName && !statsLoading && (
        <div className="text-center py-20">
          <div className="stats-card p-10 mx-auto" style={{ maxWidth: 520 }}>
            <div className="text-6xl mb-3">🎮</div>
            <h3 className="text-bf6-text-strong font-bold text-2xl mb-3">Welcome to BF6 Stats</h3>
            <p style={{ color: "var(--bf6-text-muted)" }}>Please enter a player name in the search bar above to start tracking stats.</p>
          </div>
        </div>
      )}

      {playerName && statsLoading && !stats && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-bf6-accent border-t-transparent rounded-full animate-spin mb-4" />
          <h5 className="text-bf6-text-strong">Loading stats for {playerName}...</h5>
        </div>
      )}

      {playerName && statsLoading && stats && (
        <div className="flex items-center justify-center py-2 mb-3">
          <div className="w-5 h-5 border-2 border-bf6-accent border-t-transparent rounded-full animate-spin mr-2" />
          <span className="text-bf6-text-strong">Refreshing data...</span>
        </div>
      )}

      {statsError && !statsLoading && (
        <div className="text-center py-20">
          <div className="stats-card p-10 mx-auto" style={{ maxWidth: 500 }}>
            <div className="text-6xl mb-3">⚠️</div>
            <h4 className="text-bf6-text-strong text-xl mb-3">Error</h4>
            <p style={{ color: "var(--bf6-text-muted)" }}>{statsError}</p>
            <button
              className="mt-4 px-4 py-2 rounded-md text-sm text-white border border-[#e94560] bg-[#e94560] hover:bg-[#d63a52] cursor-pointer transition-colors"
              onClick={resetToDefault}
            >
              Clear Search
            </button>
          </div>
        </div>
      )}

      {stats && !statsLoading && (
        <>
          <PlayerHeaderTW stats={stats} />
          <StatCardsTW stats={stats} />
          <DamageBreakdown stats={stats} />

          {stats.classes && <ClassesTable classes={stats.classes} />}
          {stats.gameModes && <GameModesTable gameModes={stats.gameModes} />}

          {stats.seasons && <SeasonStatsSectionTW seasons={stats.seasons} />}

          {stats.weapons && <WeaponsTable weapons={stats.weapons} />}
          {stats.vehicles && <VehiclesTable vehicles={stats.vehicles} />}
          {stats.maps && <MapsTable maps={stats.maps} />}
          {stats.gadgets && <GadgetsTable gadgets={stats.gadgets} />}
        </>
      )}
    </div>
  );
}

function SeasonStatsSectionTW({ seasons }: { seasons: BF6Stats["seasons"] }) {
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 3;

  // Filter active seasons and sort newest first
  const activeSeasons = [...seasons]
    .filter((s) => s.modes.length > 0)
    .reverse();
  if (activeSeasons.length === 0) return null;

  const totalPages = Math.ceil(activeSeasons.length / PAGE_SIZE);
  const pagedSeasons = activeSeasons.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="mb-4">
      <h5 className="section-title flex items-center justify-between">
        <span>📅 Season Stats</span>
        {totalPages > 1 && (
          <span className="flex items-center gap-2">
            <button
              className="px-2 py-0.5 rounded text-xs border cursor-pointer transition-colors disabled:opacity-30"
              style={{ borderColor: "var(--bf6-border-hover)", color: "var(--bf6-text-muted)" }}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              ◀
            </button>
            <span className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>
              {page + 1}/{totalPages}
            </span>
            <button
              className="px-2 py-0.5 rounded text-xs border cursor-pointer transition-colors disabled:opacity-30"
              style={{ borderColor: "var(--bf6-border-hover)", color: "var(--bf6-text-muted)" }}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
            >
              ▶
            </button>
          </span>
        )}
      </h5>
      <div className="flex flex-wrap -mx-1">
        {pagedSeasons.map((season) => (
          <div key={season.seasonId} className="w-full sm:w-1/2 lg:w-1/3 p-1">
            <div className="season-badge p-3 h-full">
              <h6 className="font-bold mb-3" style={{ color: "var(--bf6-text-strong)" }}>{season.season}</h6>
              {season.modes.map((mode) => (
                <div key={mode.modeId}>
                  <div className="mb-2">
                    <span className="px-2 py-0.5 rounded text-xs bg-blue-600 text-white mr-2">{mode.mode}</span>
                    <span className="px-2 py-0.5 rounded text-xs bg-green-600 text-white mr-2">{mode.wins}W</span>
                    <span className="px-2 py-0.5 rounded text-xs bg-red-600 text-white">{mode.losses}L</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div><div className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>Matches</div><div className="font-bold" style={{ color: "var(--bf6-text-strong)" }}>{mode.matches}</div></div>
                    <div><div className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>Win Rate</div><div className="font-bold text-green-400">{mode.matches > 0 ? ((mode.wins / mode.matches) * 100).toFixed(1) : 0}%</div></div>
                    <div><div className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>Kills</div><div className="font-bold" style={{ color: "var(--bf6-text-strong)" }}>{mode.kills.toLocaleString()}</div></div>
                    <div><div className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>K/D</div><div className="font-bold stat-highlight">{mode.killDeath.toFixed(2)}</div></div>
                    <div><div className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>Score</div><div className="font-bold" style={{ color: "var(--bf6-text-strong)" }}>{mode.score.toLocaleString()}</div></div>
                    <div><div className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>Time</div><div className="font-bold" style={{ color: "var(--bf6-text-strong)" }}>{mode.timePlayed}</div></div>
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
