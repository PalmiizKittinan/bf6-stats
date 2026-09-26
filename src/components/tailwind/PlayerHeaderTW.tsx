"use client";

import { BF6Stats } from "@/types/bf6";

interface PlayerHeaderProps {
  stats: BF6Stats;
}

const DEFAULT_AVATAR = "https://eaassets-a.akamaihd.net/battlelog/defaultavatars/default-avatar-36.png";

export default function PlayerHeaderTW({ stats }: PlayerHeaderProps) {
  const platformIcon = stats.platform === "pc" ? "🖥️" : "🎮";
  const xp = stats.XP && stats.XP.length > 0 ? stats.XP[0] : null;
  const humanPercent = Math.min(100, Math.max(0, parseFloat(stats.humanPrecentage) || 0));

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
    <div className="tw-glass-card tw-glass-static tw-rise relative overflow-hidden mb-8" style={{ borderColor: "var(--bf6-border-hover)" }}>
      {/* Decorative mesh glow */}
      <div className="tw-mesh" />

      <div className="relative p-6 sm:p-8 flex items-center gap-6 flex-wrap">
        <div className="relative shrink-0">
          <div className="tw-avatar-ring">
            <img
              src={stats.avatar || DEFAULT_AVATAR}
              alt={stats.userName}
              className="w-24 h-24 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
              }}
            />
          </div>
          <span
            className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 rounded-full text-sm"
            style={{ backgroundColor: "var(--bf6-dark)", border: "2px solid var(--bf6-accent)" }}
          >
            {platformIcon}
          </span>
        </div>

        <div className="flex-grow min-w-[220px]">
          <div className="tw-eyebrow mb-1">Player Overview</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: "var(--bf6-text-strong)" }}>
            {stats.userName}
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="tw-pill capitalize">🌐 {stats.platform}</span>
            {bestClass && <span className="tw-pill">🎖️ Best Class: <b style={{ color: "var(--bf6-text-strong)" }}>{bestClass.className}</b></span>}
            <span className="tw-pill">⏱️ {stats.timePlayed}</span>
            {xp && <span className="tw-pill">✨ XP <b style={{ color: "var(--bf6-text-strong)" }}>{xp.total.toLocaleString()}</b></span>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="tw-gauge" style={{ "--tw-gauge-value": humanPercent } as React.CSSProperties}>
            <div className="text-center leading-tight">
              <div className="text-lg font-bold tabular-nums tw-gradient-text">{stats.humanPrecentage}</div>
              <div className="text-[0.6rem] uppercase tracking-widest" style={{ color: "var(--bf6-text-muted)" }}>Human</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
