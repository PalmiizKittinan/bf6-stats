"use client";

import { useState } from "react";
import { PerSeasonStats } from "@/types/bf6";
import { buildSeasonPages } from "./perSeason";

export default function PerSeasonCarousel({ perSeason }: { perSeason: PerSeasonStats }) {
  const pages = buildSeasonPages(perSeason);
  const [index, setIndex] = useState(0);
  if (pages.length === 0) return null;

  const last = pages.length - 1;
  const go = (i: number) => setIndex(Math.min(last, Math.max(0, i)));

  return (
    <div className="mb-4">
      <h5 className="section-title">
        📅 Stats by Season
        <span className="float-end d-flex align-items-center gap-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Newer season"
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
            aria-label="Older season"
            style={{ padding: "2px 8px", fontSize: "0.75rem" }}
          >
            ▶
          </button>
        </span>
      </h5>

      <div style={{ overflow: "hidden" }}>
        <div
          className="d-flex"
          style={{ transform: `translateX(-${index * 100}%)`, transition: "transform 0.35s ease" }}
        >
          {pages.map((season, i) => (
            <div key={season.key} className="flex-shrink-0 w-100 px-1" aria-hidden={i !== index}>
              <h6 className="text-white fw-bold mb-3">
                {season.label}
                {i === 0 && <span className="badge bg-danger ms-2">Latest</span>}
              </h6>
              <div className="row g-3">
                {season.modes.map((m) => (
                  <div key={m.key} className="col-12 col-md-6 col-lg-4">
                    <div className="season-badge p-3 h-100">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        {m.image && (
                          <img
                            src={m.image}
                            alt=""
                            width={24}
                            height={24}
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        )}
                        <span className="badge bg-primary">{m.name}</span>
                        <span className="badge bg-success">{m.wins}W</span>
                        <span className="badge bg-danger">{m.losses}L</span>
                      </div>
                      <div className="row g-2 mt-1">
                        <Cell label="Matches" value={m.matches.toLocaleString()} />
                        <Cell label="Win Rate" value={m.winPercent} cls="text-success" />
                        <Cell label="Kills" value={m.kills.toLocaleString()} />
                        <Cell label="K/D" value={m.killDeath.toFixed(2)} cls="stat-highlight" />
                        <Cell label="KPM" value={m.kpm.toFixed(2)} />
                        <Cell label="Score" value={m.score.toLocaleString()} />
                        <Cell label="Time" value={m.timePlayed} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex justify-content-center gap-2 mt-3">
        {pages.map((s, i) => (
          <button
            key={s.key}
            type="button"
            aria-label={s.label}
            onClick={() => go(i)}
            className="border-0 rounded-circle p-0"
            style={{ width: 8, height: 8, background: i === index ? "#e94560" : "rgba(255,255,255,0.3)" }}
          />
        ))}
      </div>
    </div>
  );
}

function Cell({ label, value, cls = "text-white" }: { label: string; value: string; cls?: string }) {
  return (
    <div className="col-6">
      <div className="text-muted small">{label}</div>
      <div className={`fw-bold ${cls}`}>{value}</div>
    </div>
  );
}
