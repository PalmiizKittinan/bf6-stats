"use client";

import { BF6Stats } from "@/types/bf6";

interface PlayerHeaderProps {
  stats: BF6Stats;
}

export default function PlayerHeaderTW({ stats }: PlayerHeaderProps) {
  const platformIcon = stats.platform === "pc" ? "🖥️" : "🎮";
  const xp = stats.XP && stats.XP.length > 0 ? stats.XP[0] : null;

  const bestClass =
    stats.classes && stats.classes.length > 0
      ? stats.classes
          .filter((cls) => cls.className !== "All")
          .reduce(
            (best, cls) => (cls.score > best.score ? cls : best),
            stats.classes.find((cls) => cls.className !== "All")!
          )
      : null;

  return (
    <div className="header-section py-5 mb-4 rounded-xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-5">
          <img
            src={stats.avatar || "https://eaassets-a.akamaihd.net/battlelog/defaultavatars/default-avatar-36.png"}
            alt={stats.userName}
            className="w-20 h-20 rounded-full border-3"
            style={{ borderColor: "var(--bf6-accent)" }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://eaassets-a.akamaihd.net/battlelog/defaultavatars/default-avatar-36.png";
            }}
          />
          <div className="flex-grow">
            <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--bf6-accent)" }}>
              <span className="tw-accent-glow">{platformIcon} {stats.userName}</span>
            </h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <span style={{ color: "var(--bf6-text-muted)" }}>
                Platform: <span className="font-semibold capitalize" style={{ color: "var(--bf6-accent)" }}>{stats.platform}</span>
              </span>
              {bestClass && (
                <span style={{ color: "var(--bf6-text-muted)" }}>
                  Best Class: <span className="font-semibold" style={{ color: "var(--bf6-accent)" }}>{bestClass.className}</span>
                </span>
              )}
              <span style={{ color: "var(--bf6-text-muted)" }}>
                Time Played: <span className="font-semibold" style={{ color: "var(--bf6-accent)" }}>{stats.timePlayed}</span>
              </span>
              {xp && (
                <span style={{ color: "var(--bf6-text-muted)" }}>
                  Total XP: <span className="font-semibold" style={{ color: "var(--bf6-accent)" }}>{xp.total.toLocaleString()}</span>
                </span>
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="stat-value tw-accent-glow" style={{ color: "var(--bf6-accent)" }}>{stats.humanPrecentage}</div>
            <div className="stat-label">Human %</div>
          </div>
        </div>
      </div>
    </div>
  );
}