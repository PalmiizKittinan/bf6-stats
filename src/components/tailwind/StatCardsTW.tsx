"use client";

import { BF6Stats } from "@/types/bf6";
import { StatCard, SectionTitle } from "./TailwindShared";

interface StatCardsProps {
  stats: BF6Stats;
}

export default function StatCardsTW({ stats }: StatCardsProps) {
  return (
    <>
      <div className="mb-6">
        <SectionTitle icon="🎯" title="Core Combat Stats" />
        <div className="flex flex-wrap -mx-1.5">
          <StatCard icon="💀" label="Kills" value={stats.kills.toLocaleString()} />
          <StatCard icon="☠️" label="Deaths" value={stats.deaths.toLocaleString()} />
          <StatCard icon="📊" label="K/D Ratio" value={stats.killDeath.toFixed(2)} highlight />
          <StatCard icon="🎖️" label="Infantry K/D" value={stats.infantryKillDeath.toFixed(2)} highlight />
          <StatCard icon="⭐" label="Score" value={stats.score.toLocaleString()} />
          <StatCard icon="🤝" label="Assists" value={stats.assists.toLocaleString()} />
        </div>
      </div>

      <div className="mb-6">
        <SectionTitle icon="📈" title="Performance" />
        <div className="flex flex-wrap -mx-1.5">
          <StatCard icon="⏱️" label="Kills/Min" value={stats.killsPerMinute.toFixed(2)} />
          <StatCard icon="🎯" label="Kills/Match" value={stats.killsPerMatch.toFixed(1)} />
          <StatCard icon="💥" label="Damage" value={stats.damage.toLocaleString()} />
          <StatCard icon="🔥" label="DPM" value={stats.damagePerMinute.toFixed(1)} />
          <StatCard icon="🎯" label="Headshots" value={stats.headshots} />
          <StatCard icon="🔫" label="Accuracy" value={stats.accuracy} />
        </div>
      </div>

      <div className="mb-6">
        <SectionTitle icon="🏆" title="Match Stats" />
        <div className="flex flex-wrap -mx-1.5">
          <StatCard icon="🎮" label="Matches Played" value={stats.matchesPlayed.toLocaleString()} />
          <StatCard icon="🏅" label="Wins" value={stats.wins.toLocaleString()} />
          <StatCard icon="😔" label="Losses" value={stats.loses.toLocaleString()} />
          <StatCard icon="📊" label="Win %" value={stats.winPercent} highlight />
          <StatCard icon="🛡️" label="Savior Kills" value={stats.saviorKills.toLocaleString()} />
          <StatCard icon="⚡" label="Multi Kills" value={stats.dividedKills.multiKills.toLocaleString()} />
        </div>
      </div>

      <div className="mb-6">
        <SectionTitle icon="🩹" title="Support & Teamplay" />
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