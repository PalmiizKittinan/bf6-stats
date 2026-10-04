"use client";

import { useState } from "react";
import { usePlayerStore, formatSyncedAt } from "@/store/usePlayerStore";
import CompareTable from "@/components/CompareTable";
import PlayerHeaderTW from "./PlayerHeaderTW";
import StatCardsTW from "./StatCardsTW";
import DamageBreakdown from "@/components/DamageBreakdown";
import ClassesTable from "@/components/ClassesTable";
import GameModesTable from "@/components/GameModesTable";
import WeaponsTable from "@/components/WeaponsTable";
import VehiclesTable from "@/components/VehiclesTable";
import MapsTable from "@/components/MapsTable";
import GadgetsTable from "@/components/GadgetsTable";
import { EmptyState, LoadingState, RefreshingBar, ErrorState } from "./TailwindShared";

export default function MultiplePageTW() {
  const {
    playerName,
    multiple,
    multipleLoading,
    multipleError,
    multipleMissing,
    multipleSyncedAt,
    fetchMultiple,
    resetToDefault,
  } = usePlayerStore();
  const [selected, setSelected] = useState(0);
  const current = multiple?.[Math.min(selected, (multiple?.length ?? 1) - 1)];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {playerName && !multipleLoading && (multiple || multipleError) && (
        <div className="flex justify-end items-center gap-3 mb-4">
          {multipleSyncedAt && (
            <span className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>
              Last Synced : {formatSyncedAt(multipleSyncedAt)}
            </span>
          )}
          <button className="tw-btn" onClick={fetchMultiple}>
            🔄 Refresh
          </button>
        </div>
      )}

      {!playerName && !multipleLoading && <EmptyState />}

      {playerName && !multiple && !multipleLoading && !multipleError && (
        <div className="text-center py-20">
          <div className="tw-glass-card tw-glass-static tw-rise px-8 py-10 mx-auto" style={{ maxWidth: 500 }}>
            <div className="text-4xl mb-3">📈</div>
            <h4 className="text-xl font-bold mb-2" style={{ color: "var(--bf6-text-strong)" }}>
              Compare stats for {playerName}
            </h4>
            <button className="tw-btn tw-btn-primary mt-4" onClick={fetchMultiple}>
              Load Stats
            </button>
          </div>
        </div>
      )}

      {playerName && multipleLoading && !multiple && (
        <LoadingState message={`Loading stats for ${playerName}...`} />
      )}

      {playerName && multipleLoading && multiple && <RefreshingBar />}

      {multipleError && !multipleLoading && (
        <ErrorState title="Error" message={multipleError}>
          <button className="tw-btn tw-btn-primary mt-5" onClick={resetToDefault}>
            Clear Search
          </button>
        </ErrorState>
      )}

      {multiple && !multipleLoading && multipleMissing.length > 0 && (
        <div className="tw-glass-card tw-glass-static px-4 py-2 mb-4 text-sm" style={{ color: "var(--bf6-text-muted)" }}>
          ⚠️ Not found: {multipleMissing.join(", ")}
        </div>
      )}

      {multiple && !multipleLoading && (
        <>
          <CompareTable players={multiple} />

          {multiple.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>Details:</span>
              <div className="tw-segmented">
                {multiple.map((p, i) => (
                  <button
                    key={`${p.userName}-${i}`}
                    type="button"
                    onClick={() => setSelected(i)}
                    className={`tw-segmented-btn ${i === selected ? "tw-segmented-btn-active" : ""}`}
                  >
                    {p.userName || `Player ${i + 1}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {current && (
            <>
              <PlayerHeaderTW stats={current} />
              <StatCardsTW stats={current} />
              <DamageBreakdown stats={current} />

              {current.classes && <ClassesTable classes={current.classes} />}
              {current.gameModes && <GameModesTable gameModes={current.gameModes} />}
              {current.weapons && <WeaponsTable weapons={current.weapons} />}
              {current.vehicles && <VehiclesTable vehicles={current.vehicles} />}
              {current.gadgets && <GadgetsTable gadgets={current.gadgets} />}
              {current.maps && <MapsTable maps={current.maps} />}
            </>
          )}
        </>
      )}
    </div>
  );
}
