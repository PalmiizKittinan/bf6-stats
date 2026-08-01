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

function SectionTitle({ icon, title, children }: { icon: string; title: string; children?: React.ReactNode }) {
  return (
    <h5 className="tw-section-title">
      <span>{icon} {title}</span>
      {children}
    </h5>
  );
}

function SeasonTag({ label, variant }: { label: string; variant: "mode" | "win" | "loss" }) {
  const colors = {
    mode: { bg: "var(--bf6-accent)", text: "#fff" },
    win: { bg: "var(--bf6-success, #22c55e)", text: "#fff" },
    loss: { bg: "var(--bf6-error, #ef4444)", text: "#fff" },
  };
  const c = colors[variant];
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-semibold"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {label}
    </span>
  );
}

export default function StatsPageTW() {
  const { playerName, stats, statsLoading, statsError, fetchStats, resetToDefault } = usePlayerStore();

  const handleRefresh = () => { if (playerName) fetchStats(); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {playerName && !statsLoading && (
        <div className="flex justify-end mb-4">
          <button className="tw-btn" onClick={handleRefresh}>
            🔄 Refresh
          </button>
        </div>
      )}

      {!playerName && !statsLoading && (
        <div className="text-center py-24">
          <div className="tw-glass-card tw-fade-in p-10 mx-auto" style={{ maxWidth: 520 }}>
            <div className="tw-icon-badge mx-auto mb-4" style={{ width: 64, height: 64, fontSize: "2rem" }}>🎮</div>
            <h3 className="font-bold text-2xl mb-3" style={{ color: "var(--bf6-text-strong)" }}>Welcome to BF6 Stats</h3>
            <p style={{ color: "var(--bf6-text-muted)" }}>Please enter a player name in the search bar above to start tracking stats.</p>
          </div>
        </div>
      )}

      {playerName && statsLoading && !stats && (
        <div className="flex flex-col items-center justify-center py-24">
          <div
            className="w-12 h-12 rounded-full animate-spin mb-4"
            style={{ border: "4px solid var(--bf6-border)", borderTopColor: "var(--bf6-accent)" }}
          />
          <h5 style={{ color: "var(--bf6-text-strong)" }}>Loading stats for {playerName}...</h5>
        </div>
      )}

      {playerName && statsLoading && stats && (
        <div className="flex items-center justify-center py-2 mb-4">
          <div
            className="w-5 h-5 rounded-full animate-spin mr-2"
            style={{ border: "2px solid var(--bf6-border)", borderTopColor: "var(--bf6-accent)" }}
          />
          <span style={{ color: "var(--bf6-text-strong)" }}>Refreshing data...</span>
        </div>
      )}

      {statsError && !statsLoading && (
        <div className="text-center py-24">
          <div className="tw-glass-card tw-fade-in p-10 mx-auto" style={{ maxWidth: 500 }}>
            <div className="text-6xl mb-3">⚠️</div>
            <h4 className="text-xl mb-3" style={{ color: "var(--bf6-text-strong)" }}>Error</h4>
            <p style={{ color: "var(--bf6-text-muted)" }}>{statsError}</p>
            <button className="tw-btn tw-btn-primary mt-4" onClick={resetToDefault}>
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

  const activeSeasons = [...seasons]
    .filter((s) => s.modes.length > 0)
    .reverse();
  if (activeSeasons.length === 0) return null;

  const totalPages = Math.ceil(activeSeasons.length / PAGE_SIZE);
  const pagedSeasons = activeSeasons.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="mb-6">
      <SectionTitle icon="📅" title="Season Stats">
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
      </SectionTitle>
      <div className="flex flex-wrap -mx-1.5">
        {pagedSeasons.map((season) => (
          <div key={season.seasonId} className="w-full sm:w-1/2 lg:w-1/3 p-1.5">
            <div className="tw-glass-card tw-fade-in p-4 h-full">
              <h6 className="font-bold text-lg mb-3" style={{ color: "var(--bf6-text-strong)" }}>{season.season}</h6>
              {season.modes.map((mode) => (
                <div key={mode.modeId} className="mb-3 pb-3" style={{ borderBottom: "1px solid var(--bf6-border)" }}>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <SeasonTag label={mode.mode} variant="mode" />
                    <SeasonTag label={`${mode.wins}W`} variant="win" />
                    <SeasonTag label={`${mode.losses}L`} variant="loss" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><div className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>Matches</div><div className="font-bold" style={{ color: "var(--bf6-text-strong)" }}>{mode.matches}</div></div>
                    <div><div className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>Win Rate</div><div className="font-bold" style={{ color: "var(--bf6-success, #22c55e)" }}>{mode.matches > 0 ? ((mode.wins / mode.matches) * 100).toFixed(1) : 0}%</div></div>
                    <div><div className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>Kills</div><div className="font-bold" style={{ color: "var(--bf6-text-strong)" }}>{mode.kills.toLocaleString()}</div></div>
                    <div><div className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>K/D</div><div className="font-bold tw-accent-glow" style={{ color: "var(--bf6-accent)" }}>{mode.killDeath.toFixed(2)}</div></div>
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