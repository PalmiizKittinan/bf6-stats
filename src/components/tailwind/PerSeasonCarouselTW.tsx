"use client";

import { useState } from "react";
import { PerSeasonStats } from "@/types/bf6";
import { buildSeasonPages } from "@/components/perSeason";
import { SectionTitle, MiniStat } from "./TailwindShared";

export default function PerSeasonCarouselTW({ perSeason }: { perSeason: PerSeasonStats }) {
  const pages = buildSeasonPages(perSeason);
  const [index, setIndex] = useState(0);
  if (pages.length === 0) return null;

  const last = pages.length - 1;
  const go = (i: number) => setIndex(Math.min(last, Math.max(0, i)));

  return (
    <div className="mb-8">
      <SectionTitle icon="📅" title="Stats by Season">
        <span className="flex items-center gap-2">
          <button className="tw-btn tw-btn-xs" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Newer season">
            ◀
          </button>
          <span className="text-xs tabular-nums" style={{ color: "var(--bf6-text-muted)" }}>
            {index + 1}/{pages.length}
          </span>
          <button className="tw-btn tw-btn-xs" onClick={() => go(index + 1)} disabled={index === last} aria-label="Older season">
            ▶
          </button>
        </span>
      </SectionTitle>

      <div className="overflow-hidden">
        <div
          className="flex"
          style={{ transform: `translateX(-${index * 100}%)`, transition: "transform 0.35s ease" }}
        >
          {pages.map((season, i) => (
            <div key={season.key} className="w-full shrink-0 px-1" aria-hidden={i !== index}>
              <div className="flex items-center gap-2 mb-3">
                <h6 className="font-bold text-xl tracking-tight m-0" style={{ color: "var(--bf6-text-strong)" }}>
                  {season.label}
                </h6>
                {i === 0 && (
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: "var(--bf6-grad-fill)", color: "#fff" }}
                  >
                    Latest
                  </span>
                )}
              </div>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {season.modes.map((m) => (
                  <div key={m.key} className="tw-glass-card tw-stat-tile p-4 h-full">
                    <div className="flex items-center gap-2 mb-3">
                      {m.image && (
                        <img
                          src={m.image}
                          alt=""
                          width={24}
                          height={24}
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      )}
                      <span className="font-bold" style={{ color: "var(--bf6-text-strong)" }}>{m.name}</span>
                      <span className="ml-auto text-xs font-semibold" style={{ color: "var(--bf6-success, #22c55e)" }}>{m.wins}W</span>
                      <span className="text-xs font-semibold" style={{ color: "var(--bf6-error, #ef4444)" }}>{m.losses}L</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <MiniStat label="Matches" value={m.matches.toLocaleString()} />
                      <MiniStat label="Win Rate" value={m.winPercent} accent="success" />
                      <MiniStat label="Kills" value={m.kills.toLocaleString()} />
                      <MiniStat label="K/D" value={m.killDeath.toFixed(2)} accent="gradient" />
                      <MiniStat label="KPM" value={m.kpm.toFixed(2)} />
                      <MiniStat label="Score" value={m.score.toLocaleString()} />
                      <MiniStat label="Time" value={m.timePlayed} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {pages.map((s, i) => (
          <button
            key={s.key}
            type="button"
            aria-label={s.label}
            onClick={() => go(i)}
            className="rounded-full"
            style={{ width: 8, height: 8, background: i === index ? "var(--bf6-accent)" : "var(--bf6-border)" }}
          />
        ))}
      </div>
    </div>
  );
}
