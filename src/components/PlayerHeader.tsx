"use client";

import { BF6Stats } from "@/types/bf6";

interface PlayerHeaderProps {
  stats: BF6Stats;
}

export default function PlayerHeader({ stats }: PlayerHeaderProps) {
  const platformIcon = stats.platform === "pc" ? "🖥️" : "🎮";
  const xp = stats.XP && stats.XP.length > 0 ? stats.XP[0] : null;

  return (
    <div className="header-section py-4 mb-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-auto">
            <img
              src={stats.avatar || "https://eaassets-a.akamaihd.net/battlelog/defaultavatars/default-avatar-36.png"}
              alt={stats.userName}
              className="player-avatar"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://eaassets-a.akamaihd.net/battlelog/defaultavatars/default-avatar-36.png";
              }}
            />
          </div>
          <div className="col">
            <h2 className="mb-1 fw-bold text-white">
              {platformIcon} {stats.userName}
            </h2>
            <div className="d-flex flex-wrap gap-3">
              <span className="text-light">
                Platform: <span className="text-capitalize fw-semibold">{stats.platform}</span>
              </span>
              <span className="text-light">
                Best Class: <span className="fw-semibold">{stats.bestClass}</span>
              </span>
              <span className="text-light">
                Time Played: <span className="fw-semibold">{stats.timePlayed}</span>
              </span>
              {xp && (
                <span className="text-light">
                  Total XP: <span className="fw-semibold">{xp.total.toLocaleString()}</span>
                </span>
              )}
            </div>
          </div>
          <div className="col-auto">
            <div className="text-center">
              <div className="stat-value stat-highlight">{stats.humanPrecentage}</div>
              <div className="stat-label">Human %</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}