"use client";

import { useEffect, useState } from "react";
import { useCSSFramework } from "@/components/CSSFrameworkProvider";
import { usePlayerStore, formatSyncedAt } from "@/store/usePlayerStore";
import PlayerHeader from "@/components/PlayerHeader";
import StatCards from "@/components/StatCards";
import WeaponsTable from "@/components/WeaponsTable";
import VehiclesTable from "@/components/VehiclesTable";
import DamageBreakdown from "@/components/DamageBreakdown";
import ClassesTable from "@/components/ClassesTable";
import MapsTable from "@/components/MapsTable";
import GameModesTable from "@/components/GameModesTable";
import GadgetsTable from "@/components/GadgetsTable";
import CompareTable from "@/components/CompareTable";
import MultiplePageTW from "@/components/tailwind/MultiplePageTW";

const COMPARE_HINT = "To compare players, separate names with a comma (,) in the search box.";

export default function MultiplePage() {
  const { framework } = useCSSFramework();
  const setMultipleActive = usePlayerStore((s) => s.setMultipleActive);

  // While this page is open, Search loads multiple stats
  useEffect(() => {
    setMultipleActive(true);
    return () => setMultipleActive(false);
  }, [setMultipleActive]);

  if (framework === "tailwind") {
    return <MultiplePageTW />;
  }

  return <MultiplePageBootstrap />;
}

function MultiplePageBootstrap() {
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
    <div className="container py-4">
      {playerName && !multipleLoading && (multiple || multipleError) && (
        <div className="d-flex justify-content-end align-items-center gap-3 mb-3">
          {multipleSyncedAt && (
            <small className="text-muted">
              Last Synced : {formatSyncedAt(multipleSyncedAt)}
            </small>
          )}
          <button className="btn btn-sm btn-outline-info" onClick={fetchMultiple}>
            🔄 Refresh
          </button>
        </div>
      )}

      {!playerName && !multipleLoading && (
        <div className="text-center py-5">
          <div className="stats-card p-5 mx-auto" style={{ maxWidth: 520 }}>
            <div className="fs-1 mb-3">🎮</div>
            <h3 className="text-white fw-bold mb-3">Welcome to BF6 Stats</h3>
            <p className="text-muted mb-0">
              Please enter a player name in the search bar above to start tracking stats.
            </p>
            <p className="text-muted small mt-3 mb-0">ℹ️ {COMPARE_HINT}</p>
          </div>
        </div>
      )}

      {playerName && !multiple && !multipleLoading && !multipleError && (
        <div className="text-center py-5">
          <div className="stats-card p-5 mx-auto" style={{ maxWidth: 520 }}>
            <div className="fs-1 mb-3">📈</div>
            <h4 className="text-white fw-bold mb-2">Compare stats for {playerName}</h4>
            <p className="text-muted small mb-3">ℹ️ {COMPARE_HINT}</p>
            <button
              className="btn btn-sm"
              style={{ backgroundColor: "#e94560", color: "white", borderColor: "#e94560" }}
              onClick={fetchMultiple}
            >
              Load Stats
            </button>
          </div>
        </div>
      )}

      {playerName && multipleLoading && !multiple && (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <div className="spinner-grow text-danger mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-light">Loading stats for {playerName}...</h5>
        </div>
      )}

      {playerName && multipleLoading && multiple && (
        <div className="d-flex align-items-center justify-content-center py-2 mb-3">
          <div className="spinner-border spinner-border-sm text-danger me-2" role="status">
            <span className="visually-hidden">Refreshing...</span>
          </div>
          <span className="text-light">Refreshing data...</span>
        </div>
      )}

      {multipleError && !multipleLoading && (
        <div className="text-center py-5">
          <div className="stats-card p-5 mx-auto" style={{ maxWidth: "500px" }}>
            <div className="fs-1 mb-3">⚠️</div>
            <h4 className="text-white mb-3">Error</h4>
            <p className="text-muted">{multipleError}</p>
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

      {multiple && !multipleLoading && multipleMissing.length > 0 && (
        <div className="alert alert-warning py-2 small">
          Not found: {multipleMissing.join(", ")}
        </div>
      )}

      {multiple && !multipleLoading && (
        <>
          <CompareTable players={multiple} />

          {multiple.length > 1 && (
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
              <span className="text-muted small">Details:</span>
              {multiple.map((p, i) => (
                <button
                  key={`${p.userName}-${i}`}
                  className={`btn btn-sm ${i === selected ? "btn-outline-danger" : "btn-outline-secondary"}`}
                  onClick={() => setSelected(i)}
                >
                  {p.userName || `Player ${i + 1}`}
                </button>
              ))}
            </div>
          )}

          {current && (
            <>
              <PlayerHeader stats={current} />
              <StatCards stats={current} />
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
