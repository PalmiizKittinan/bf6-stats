"use client";

import { useState } from "react";
import { BF6Stats } from "@/types/bf6";

interface Metric {
  label: string;
  get: (s: BF6Stats) => number;
  format?: (v: number) => string;
  // Lower value wins (deaths, losses)
  lowerBetter?: boolean;
  // Show the delta as a percentage change; off for values that are already %
  pct?: boolean;
}

interface Group {
  title: string;
  metrics: Metric[];
}

const num = (v: unknown) => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const int = (v: number) => Math.round(v).toLocaleString();
const dec = (v: number) => v.toFixed(2);
const percent = (v: number) => `${v.toFixed(2)}%`;
const hours = (v: number) => `${(v / 3600).toFixed(1)} h`;

const GROUPS: Group[] = [
  {
    title: "Combat",
    metrics: [
      { label: "Kills", get: (s) => num(s.kills), format: int, pct: true },
      { label: "Deaths", get: (s) => num(s.deaths), format: int, lowerBetter: true, pct: true },
      { label: "K/D", get: (s) => num(s.killDeath), format: dec, pct: true },
      { label: "Infantry K/D", get: (s) => num(s.infantryKillDeath), format: dec, pct: true },
      { label: "Kills / min", get: (s) => num(s.killsPerMinute), format: dec, pct: true },
      { label: "Kills / match", get: (s) => num(s.killsPerMatch), format: dec, pct: true },
      { label: "Headshots", get: (s) => num(s.headShots), format: int, pct: true },
      { label: "Headshot %", get: (s) => num(s.headshots), format: percent },
      { label: "Accuracy", get: (s) => num(s.accuracy), format: percent },
      { label: "Assists", get: (s) => num(s.assists), format: int, pct: true },
    ],
  },
  {
    title: "Damage & Score",
    metrics: [
      { label: "Score", get: (s) => num(s.score), format: int, pct: true },
      { label: "Damage", get: (s) => num(s.damage), format: int, pct: true },
      { label: "Damage / min", get: (s) => num(s.damagePerMinute), format: dec, pct: true },
      { label: "Damage / match", get: (s) => num(s.damagePerMatch), format: dec, pct: true },
    ],
  },
  {
    title: "Matches",
    metrics: [
      { label: "Matches played", get: (s) => num(s.matchesPlayed), format: int, pct: true },
      { label: "Wins", get: (s) => num(s.wins), format: int, pct: true },
      { label: "Losses", get: (s) => num(s.loses), format: int, lowerBetter: true, pct: true },
      { label: "Win %", get: (s) => num(s.winPercent), format: percent },
      { label: "Time played", get: (s) => num(s.secondsPlayed), format: hours, pct: true },
    ],
  },
  {
    title: "Support",
    metrics: [
      { label: "Revives", get: (s) => num(s.revives), format: int, pct: true },
      { label: "Heals", get: (s) => num(s.heals), format: int, pct: true },
      { label: "Resupplies", get: (s) => num(s.resupplies), format: int, pct: true },
      { label: "Repairs", get: (s) => num(s.repairs), format: int, pct: true },
      { label: "Vehicles destroyed", get: (s) => num(s.vehiclesDestroyed), format: int, pct: true },
      { label: "Enemies spotted", get: (s) => num(s.enemiesSpotted), format: int, pct: true },
    ],
  },
];

function bestValue(values: number[], lowerBetter?: boolean) {
  return lowerBetter ? Math.min(...values) : Math.max(...values);
}

// Delta of `value` against `ref`: text + whether it is better (+1), worse (-1) or equal (0)
function delta(value: number, ref: number, m: Metric): { text: string; dir: number } {
  const diff = value - ref;
  if (diff === 0) return { text: "=", dir: 0 };
  const fmt = m.format ?? int;
  const sign = diff > 0 ? "+" : "-";
  let text = `${sign}${fmt(Math.abs(diff))}`;
  if (m.pct && ref !== 0) {
    text += ` (${sign}${Math.abs((diff / ref) * 100).toFixed(1)}%)`;
  }
  const better = m.lowerBetter ? diff < 0 : diff > 0;
  return { text, dir: better ? 1 : -1 };
}

export default function CompareTable({ players }: { players: BF6Stats[] }) {
  const [refIndex, setRefIndex] = useState(0);
  if (players.length < 2) return null;
  const ref = Math.min(refIndex, players.length - 1);

  const names = players.map((p, i) => p.userName || `Player ${i + 1}`);
  // Count of metrics each player leads (ties give no point)
  const leads = players.map(() => 0);
  for (const g of GROUPS) {
    for (const m of g.metrics) {
      const values = players.map(m.get);
      const best = bestValue(values, m.lowerBetter);
      const winners = values.filter((v) => v === best).length;
      if (winners === 1) leads[values.indexOf(best)]++;
    }
  }
  const maxLeads = Math.max(...leads);

  return (
    <div className="mb-4">
      <h5 className="section-title">⚖️ Comparison</h5>
      <div className="stats-card p-3">
        <div className="text-muted small mb-3">
          🏆 = best value in the row. ▲ / ▼ shows the difference from{" "}
          <strong>{names[ref]}</strong> (green = better, red = worse).
          {players.length > 2 && " #n = rank in the row."} Click a name to change the reference.
        </div>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0" style={{ minWidth: 160 + players.length * 130 }}>
            <thead>
              <tr>
                <th style={stickyCell}>Stat</th>
                {names.map((n, i) => (
                  <th key={`${n}-${i}`} className="text-end">
                    <div
                      role="button"
                      title="Use as reference"
                      onClick={() => setRefIndex(i)}
                      style={{ cursor: "pointer", textDecoration: i === ref ? "underline" : "none" }}
                    >
                      {n}
                      {i === ref && " 📌"}
                    </div>
                    <div className="small fw-normal text-muted">
                      {leads[i] === maxLeads && maxLeads > 0 ? "🏆 " : ""}
                      leads {leads[i]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GROUPS.map((g) => (
                <GroupRows key={g.title} group={g} players={players} refIndex={ref} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const stickyCell: React.CSSProperties = {
  position: "sticky",
  left: 0,
  zIndex: 1,
  background: "var(--bs-table-bg, #212529)",
};

function GroupRows({
  group,
  players,
  refIndex,
}: {
  group: Group;
  players: BF6Stats[];
  refIndex: number;
}) {
  return (
    <>
      <tr>
        <td colSpan={players.length + 1} className="text-muted small fw-bold text-uppercase pt-3" style={stickyCell}>
          {group.title}
        </td>
      </tr>
      {group.metrics.map((m) => {
        const values = players.map(m.get);
        const best = bestValue(values, m.lowerBetter);
        const hasBest = values.some((v) => v !== best);
        const fmt = m.format ?? int;
        return (
          <tr key={m.label}>
            <td style={stickyCell}>{m.label}</td>
            {values.map((v, i) => {
              const isBest = hasBest && v === best;
              const d = i === refIndex ? null : delta(v, values[refIndex], m);
              const rank =
                1 + values.filter((o) => (m.lowerBetter ? o < v : o > v)).length;
              return (
                <td key={i} className="text-end">
                  <span className={isBest ? "stat-highlight fw-bold" : ""}>
                    {isBest && "🏆 "}
                    {fmt(v)}
                  </span>
                  {players.length > 2 && hasBest && (
                    <span className="text-muted small ms-1">#{rank}</span>
                  )}
                  {d && (
                    <div
                      className="small"
                      style={{
                        color:
                          d.dir > 0 ? "#22c55e" : d.dir < 0 ? "#ef4444" : "var(--bf6-text-muted, #888)",
                      }}
                    >
                      {d.dir > 0 ? "▲ " : d.dir < 0 ? "▼ " : ""}
                      {d.text}
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}
