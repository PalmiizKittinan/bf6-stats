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
    <div
      className="tw-glass-card tw-fade-in relative overflow-hidden py-6 mb-6 rounded-2xl"
      style={{ borderColor: "var(--bf6-border-hover)" }}
    >
      {/* Decorative mesh glow */}
      <div className="tw-mesh" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="relative">
            <img
              src={stats.avatar || "https://eaassets-a.akamaihd.net/battlelog/defaultavatars/default-avatar-36.png"}
              alt={stats.userName}
              className="w-20 h-20 rounded-full border-[3px] tw-glow-ring"
              style={{ borderColor: "var(--bf6-accent)" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://eaassets-a.akamaihd.net/battlelog/defaultavatars/default-avatar-36.png";
              }}
            />
            <span
              className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full text-sm border-2"
              style={{ backgroundColor: "var(--bf6-dark)", borderColor: "var(--bf6-accent)" }}
            >
              {platformIcon}
            </span>
          </div>
          <div className="flex-grow min-w-[200px]">
            <h2 className="text-2xl font-bold mb-2 tw-gradient-text">
              {stats.userName}
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="tw-pill capitalize">
                🌐 Platform: {stats.platform}
              </span>
              {bestClass && (
                <span className="tw-pill">
                  🎖️ Best Class: {bestClass.className}
                </span>
              )}
              <span className="tw-pill">
                ⏱️ Time Played: {stats.timePlayed}
              </span>
              {xp && (
                <span className="tw-pill">
                  ✨Total XP: {xp.total.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <div className="tw-ring-badge text-center px-5 py-3">
            <div className="text-2xl font-bold tw-gradient-text">{stats.humanPrecentage}</div>
            <div className="text-xs uppercase tracking-wider mt-1" style={{ color: "var(--bf6-text-muted)" }}>Human %</div>
          </div>
        </div>
      </div>
    </div>
  );
}
