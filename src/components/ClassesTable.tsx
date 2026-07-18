"use client";

import { ClassDetail } from "@/types/bf6";

interface ClassesTableProps {
  classes: ClassDetail[];
}

export default function ClassesTable({ classes }: ClassesTableProps) {
  if (!classes || classes.length === 0) return null;

  const maxKills = Math.max(...classes.map((c) => c.kills));

  return (
    <div className="mb-4">
      <h5 className="section-title">🎖️ Classes</h5>
      <div className="row g-3">
        {classes.map((cls) => {
          const timePlayed = cls.secondsPlayed;
          const hours = Math.floor(timePlayed / 3600);
          const mins = Math.floor((timePlayed % 3600) / 60);

          return (
            <div key={cls.id} className="col-12 col-md-6 col-lg-3">
              <div className="stats-card p-3 h-100">
                <div className="d-flex align-items-center mb-3">
                  {cls.image && (
                    <img
                      src={cls.image}
                      alt={cls.name}
                      style={{ width: 32, height: 32, marginRight: 8, filter: "invert(1)" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  <h6 className="text-white fw-bold mb-0">{cls.className}</h6>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <div className="text-muted small">Kills</div>
                    <div className="fw-bold text-white">{cls.kills.toLocaleString()}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted small">Deaths</div>
                    <div className="fw-bold text-white">{cls.deaths.toLocaleString()}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted small">K/D</div>
                    <div className="fw-bold stat-highlight">{cls.killDeath.toFixed(2)}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted small">KPM</div>
                    <div className="fw-bold text-white">{cls.kpm.toFixed(2)}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted small">Score</div>
                    <div className="fw-bold text-white">{cls.score.toLocaleString()}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted small">Spawns</div>
                    <div className="fw-bold text-white">{cls.spawns}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted small">Assists</div>
                    <div className="fw-bold text-white">{cls.assists.toLocaleString()}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted small">Revives</div>
                    <div className="fw-bold text-white">{cls.revives}</div>
                  </div>
                  <div className="col-12">
                    <div className="text-muted small">Time Played</div>
                    <div className="fw-bold text-white">{hours}h {mins}m</div>
                  </div>
                  <div className="col-12 mt-1">
                    <div className="weapon-bar">
                      <div
                        className="weapon-bar-fill"
                        style={{ width: maxKills > 0 ? `${(cls.kills / maxKills) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}