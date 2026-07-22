"use client";

import { BF6Stats } from "@/types/bf6";

interface StatCardsProps {
  stats: BF6Stats;
}

function StatCard({ icon, label, value, highlight }: { icon: string; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="w-1/2 sm:w-1/3 lg:w-1/6 p-1.5">
      <div className="tw-glass-card p-4 text-center h-full">
        <div className="text-2xl mb-1">{icon}</div>
        <div className={`text-lg font-bold ${highlight ? "tw-accent-glow" : ""}`} style={{ color: highlight ? "var(--bf6-accent)" : "var(--bf6-text-strong)" }}>
          {value}
        </div>
        <div className="text-xs uppercase tracking-wider mt-1" style={{ color: "var(--bf6-text-muted)" }}>{label}</div>
      </div>
    </div>
  );
}

export default function StatCardsTW({ stats }: StatCardsProps) {
  return (
    <>
      <div className="mb-4">
        <h5 className="section-title">🎯 Core Combat Stats</h5>
        <div className="flex flex-wrap -mx-1.5">
          <StatCard icon="💀" label="Kills" value={stats.kills.toLocaleString()} />
          <StatCard icon="☠️" label="Deaths" value={stats.deaths.toLocaleString()} />
          <StatCard icon="📊" label="K/D Ratio" value={stats.killDeath.toFixed(2)} highlight />
          <StatCard icon="🎖️" label="Infantry K/D" value={stats.infantryKillDeath.toFixed(2)} highlight />
          <StatCard icon="⭐" label="Score" value={stats.score.toLocaleString()} />
          <StatCard icon="🤝" label="Assists" value={stats.assists.toLocaleString()} />
        </div>
      </div>

      <div className="mb-4">
        <h5 className="section-title">📈 Performance</h5>
        <div className="flex flex-wrap -mx-1.5">
          <StatCard icon="⏱️" label="Kills/Min" value={stats.killsPerMinute.toFixed(2)} />
          <StatCard icon="🎯" label="Kills/Match" value={stats.killsPerMatch.toFixed(1)} />
          <StatCard icon="💥" label="Damage" value={stats.damage.toLocaleString()} />
          <StatCard icon="🔥" label="DPM" value={stats.damagePerMinute.toFixed(1)} />
          <StatCard icon="🎯" label="Headshots" value={stats.headshots} />
          <StatCard icon="🔫" label="Accuracy" value={stats.accuracy} />
        </div>
      </div>

      <div className="mb-4">
        <h5 className="section-title">🏆 Match Stats</h5>
        <div className="flex flex-wrap -mx-1.5">
          <StatCard icon="🎮" label="Matches Played" value={stats.matchesPlayed.toLocaleString()} />
          <StatCard icon="🏅" label="Wins" value={stats.wins.toLocaleString()} />
          <StatCard icon="😔" label="Losses" value={stats.loses.toLocaleString()} />
          <StatCard icon="📊" label="Win %" value={stats.winPercent} highlight />
          <StatCard icon="🛡️" label="Savior Kills" value={stats.saviorKills.toLocaleString()} />
          <StatCard icon="⚡" label="Multi Kills" value={stats.dividedKills.multiKills.toLocaleString()} />
        </div>
      </div>

      <div className="mb-4">
        <h5 className="section-title">🩹 Support & Teamplay</h5>
        <div className="flex flex-wrap -mx-1.5">
          <StatCard icon="💉" label="Revives" value={stats.revives.toLocaleString()} />
          <StatCard icon="❤️" label="Heals" value={stats.heals.toLocaleString()} />
          <StatCard icon="🎒" label="Resupplies" value={stats.resupplies.toLocaleString()} />
          <StatCard icon="🔧" label="Repairs" value={stats.repairs.toLocaleString()} />
          <StatCard icon="👥" label="Squad Revives" value={stats.squadmateRevive.toLocaleString()} />
          <StatCard icon="👁️" label="Enemies Spotted" value={stats.enemiesSpotted.toLocaleString()} />
        </div>
      </div>
    </>
  );
}