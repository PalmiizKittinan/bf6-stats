"use client";

import { useState } from "react";
import { usePlayerStore, formatSyncedAt } from "@/store/usePlayerStore";
import PlayerHeaderTW from "./PlayerHeaderTW";
import StatCardsTW from "./StatCardsTW";
import DamageBreakdown from "@/components/DamageBreakdown";
import ClassesTable from "@/components/ClassesTable";
import GameModesTable from "@/components/GameModesTable";
import WeaponsTable from "@/components/WeaponsTable";
import VehiclesTable from "@/components/VehiclesTable";
import MapsTable from "@/components/MapsTable";
import GadgetsTable from "@/components/GadgetsTable";
import PerSeasonCarouselTW from "./PerSeasonCarouselTW";
import { BF6Stats } from "@/types/bf6";
import { SectionTitle, StatGrid, MiniStat, EmptyState, LoadingState, RefreshingBar, ErrorState } from "./TailwindShared";

function SeasonTag({ label, variant }: { label: string; variant: "mode" | "win" | "loss" }) {
  const backgrounds = {
    mode: "var(--bf6-grad-fill)",
    win: "var(--bf6-success, #22c55e)",
    loss: "var(--bf6-error, #ef4444)",
  };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: backgrounds[variant], color: "#fff" }}
    >
      {label}
    </span>
  );
}

export default function StatsPageTW() {
  const { playerName, stats, statsLoading, statsError, statsSyncedAt, fetchStats, resetToDefault } = usePlayerStore();

  const handleRefresh = () => { if (playerName) fetchStats(); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {playerName && !statsLoading && (
        <div className="flex justify-end items-center gap-3 mb-4">
          {statsSyncedAt && (
            <span className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>
              Last Synced : {formatSyncedAt(statsSyncedAt)}
            </span>
          )}
          <button className="tw-btn" onClick={handleRefresh}>
            🔄 Refresh
          </button>
        </div>
      )}

      {!playerName && !statsLoading && <EmptyState />}

      {playerName && statsLoading && !stats && <LoadingState message={`Loading stats for ${playerName}...`} />}

      {playerName && statsLoading && stats && <RefreshingBar />}

      {statsError && !statsLoading && (
        <ErrorState title="Error" message={statsError}>
          <button className="tw-btn tw-btn-primary mt-5" onClick={resetToDefault}>
            Clear Search
          </button>
        </ErrorState>
      )}

      {stats && !statsLoading && (
        <>
          <PlayerHeaderTW stats={stats} />
          <StatCardsTW stats={stats} />
          <DamageBreakdown stats={stats} />

          {stats.classes && <ClassesTable classes={stats.classes} />}
          {stats.gameModes && <GameModesTable gameModes={stats.gameModes} />}
          {stats.perSeason && <PerSeasonCarouselTW perSeason={stats.perSeason} />}
          {stats.seasons && <SeasonStatsSectionTW seasons={stats.seasons} />}
          {stats.weapons && <WeaponsTable weapons={stats.weapons} />}
          {stats.vehicles && <VehiclesTable vehicles={stats.vehicles} />}
          {stats.gadgets && <GadgetsTable gadgets={stats.gadgets} />}
          {stats.maps && <MapsTable maps={stats.maps} />}
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
    <div className="mb-8">
      <SectionTitle icon="📅" title="Season Stats">
        {totalPages > 1 && (
          <span className="flex items-center gap-2">
            <button
              className="tw-btn tw-btn-xs"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous seasons"
            >
              ◀
            </button>
            <span className="text-xs tabular-nums" style={{ color: "var(--bf6-text-muted)" }}>
              {page + 1}/{totalPages}
            </span>
            <button
              className="tw-btn tw-btn-xs"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              aria-label="Next seasons"
            >
              ▶
            </button>
          </span>
        )}
      </SectionTitle>
      <StatGrid cols="wide3">
        {pagedSeasons.map((season) => (
          <div key={season.seasonId} className="tw-glass-card tw-stat-tile tw-rise p-4 h-full">
            <div className="tw-eyebrow mb-1" style={{ fontSize: "0.6rem" }}>Season</div>
            <h6 className="font-bold text-lg mb-3 tracking-tight" style={{ color: "var(--bf6-text-strong)" }}>{season.season}</h6>
            <div className="flex flex-col gap-3">
              {season.modes.map((mode) => (
                <div key={mode.modeId} className="rounded-2xl p-3" style={{ border: "1px solid var(--bf6-border)" }}>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <SeasonTag label={mode.mode} variant="mode" />
                    <SeasonTag label={`${mode.wins}W`} variant="win" />
                    <SeasonTag label={`${mode.losses}L`} variant="loss" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <MiniStat label="Matches" value={mode.matches} />
                    <MiniStat label="Win Rate" value={`${mode.matches > 0 ? ((mode.wins / mode.matches) * 100).toFixed(1) : 0}%`} accent="success" />
                    <MiniStat label="Kills" value={mode.kills.toLocaleString()} />
                    <MiniStat label="K/D" value={mode.killDeath.toFixed(2)} accent="gradient" />
                    <MiniStat label="Score" value={mode.score.toLocaleString()} />
                    <MiniStat label="Time" value={mode.timePlayed} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </StatGrid>
    </div>
  );
}
