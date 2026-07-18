"use client";

import { Season } from "@/types/bf6";

interface SeasonStatsProps {
  seasons: Season[];
}

export default function SeasonStats({ seasons }: SeasonStatsProps) {
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
                    <span className="badge bg-success me-2">
                      {mode.wins}W
                    </span>
                    <span className="badge bg-danger">{mode.losses}L</span>
                  </div>
                  <div className="row g-2 mt-1">
                    <div className="col-6">
                      <div className="text-muted small">Matches</div>
                      <div className="fw-bold text-white">
                        {mode.matches}
                      </div>
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
                      <div className="fw-bold text-white">
                        {mode.kills.toLocaleString()}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-muted small">K/D</div>
                      <div className="fw-bold stat-highlight">
                        {mode.killDeath.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-muted small">Score</div>
                      <div className="fw-bold text-white">
                        {mode.score.toLocaleString()}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-muted small">Time</div>
                      <div className="fw-bold text-white">
                        {mode.timePlayed}
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
  );
}