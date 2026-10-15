"use client";

import { useState } from "react";
import { GameModeDetail } from "@/types/bf6";
import { useSlideHeight } from "./useSlideHeight";

const PAGE_SIZE = 6;

interface GameModesTableProps {
  gameModes: GameModeDetail[];
}

export default function GameModesTable({ gameModes }: GameModesTableProps) {
  const [index, setIndex] = useState(0);
  const { height, setRef } = useSlideHeight(index);
  if (!gameModes || gameModes.length === 0) return null;

  // Filter out "Official" and "All" type entries
  const filtered = gameModes.filter(
    (gm) => gm.id !== "gm_official" && gm.id !== "gm_all" && gm.id !== "gm_mp"
  );

  if (filtered.length === 0) return null;

  const sorted = [...filtered].sort((a, b) => b.matches - a.matches);
  const pages: GameModeDetail[][] = [];
  for (let i = 0; i < sorted.length; i += PAGE_SIZE) pages.push(sorted.slice(i, i + PAGE_SIZE));
  const last = pages.length - 1;
  const go = (i: number) => setIndex(Math.min(last, Math.max(0, i)));

  return (
    <div className="mb-4">
      <h5 className="section-title">
        🎮 Game Modes
        {pages.length > 1 && (
          <span className="float-end d-flex align-items-center gap-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              aria-label="Previous page"
              style={{ padding: "2px 8px", fontSize: "0.75rem" }}
            >
              ◀
            </button>
            <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
              {index + 1}/{pages.length}
            </span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => go(index + 1)}
              disabled={index === last}
              aria-label="Next page"
              style={{ padding: "2px 8px", fontSize: "0.75rem" }}
            >
              ▶
            </button>
          </span>
        )}
      </h5>
      <div style={{ overflow: "hidden", height, transition: "height 0.35s ease" }}>
        <div
          className="d-flex align-items-start"
          style={{ transform: `translateX(-${index * 100}%)`, transition: "transform 0.35s ease" }}
        >
          {pages.map((page, pi) => (
            <div key={pi} ref={setRef(pi)} className="flex-shrink-0 w-100" aria-hidden={pi !== index}>
              <div className="row g-3">
        {page.map((gm) => (
          <div key={gm.id} className="col-12 col-md-6">
            <div className="stats-card p-3 h-100">
              <div className="d-flex align-items-center mb-3">
                {gm.image && (
                  <img
                    src={gm.image}
                    alt={gm.gamemodeName}
                    style={{ width: 32, height: 32, marginRight: 12, filter: "invert(1)" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <h6 className="text-white fw-bold mb-0">{gm.gamemodeName}</h6>
              </div>
              <div className="row g-2">
                <div className="col-4">
                  <div className="text-muted small">Matches</div>
                  <div className="fw-bold text-white">{gm.matches}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">Wins</div>
                  <div className="fw-bold text-success">{gm.wins}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">Losses</div>
                  <div className="fw-bold text-danger">{gm.losses}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">Win %</div>
                  <div className="fw-bold" style={{ color: parseFloat(gm.winPercent) >= 50 ? "#28a745" : "#e94560" }}>
                    {gm.winPercent}
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">Kills</div>
                  <div className="fw-bold text-white">{gm.kills.toLocaleString()}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">K/D</div>
                  <div className="fw-bold stat-highlight">{gm.killDeath.toFixed(2)}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">KPM</div>
                  <div className="fw-bold text-white">{gm.kpm.toFixed(2)}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">DPM</div>
                  <div className="fw-bold text-white">{gm.dpm.toFixed(1)}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">Score</div>
                  <div className="fw-bold text-white">{gm.scoreIn.toLocaleString()}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">Headshots</div>
                  <div className="fw-bold text-white">{gm.headshotKills} ({gm.headshots})</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">Revives</div>
                  <div className="fw-bold text-white">{gm.revives}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">Obj Captured</div>
                  <div className="fw-bold text-white">{gm.objectivesCaptured}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">Obj Defended</div>
                  <div className="fw-bold text-white">{gm.objectivesDefended}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">Vehicles Dest.</div>
                  <div className="fw-bold text-white">{gm.vehiclesDestroyedWith}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {pages.length > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-3">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Page ${i + 1}`}
              onClick={() => go(i)}
              className="border-0 rounded-circle p-0"
              style={{ width: 8, height: 8, background: i === index ? "#e94560" : "rgba(255,255,255,0.3)" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}