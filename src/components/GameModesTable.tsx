"use client";

import { GameModeDetail } from "@/types/bf6";

interface GameModesTableProps {
  gameModes: GameModeDetail[];
}

export default function GameModesTable({ gameModes }: GameModesTableProps) {
  if (!gameModes || gameModes.length === 0) return null;

  // Filter out "Official" and "All" type entries
  const filtered = gameModes.filter(
    (gm) => gm.id !== "gm_official" && gm.id !== "gm_all" && gm.id !== "gm_mp"
  );

  if (filtered.length === 0) return null;

  return (
    <div className="mb-4">
      <h5 className="section-title">🎮 Game Modes</h5>
      <div className="row g-3">
        {filtered.map((gm) => (
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
  );
}