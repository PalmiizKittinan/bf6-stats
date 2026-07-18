"use client";

import { BF6Stats } from "@/types/bf6";

interface StatCardsProps {
  stats: BF6Stats;
}

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <>
      {/* Core Stats */}
      <div className="mb-4">
        <h5 className="section-title">🎯 Core Combat Stats</h5>
        <div className="row g-3">
          <StatCard label="Kills" value={stats.kills.toLocaleString()} icon="💀" />
          <StatCard label="Deaths" value={stats.deaths.toLocaleString()} icon="☠️" />
          <StatCard label="K/D Ratio" value={stats.killDeath.toFixed(2)} icon="📊" highlight />
          <StatCard label="Infantry K/D" value={stats.infantryKillDeath.toFixed(2)} icon="🎖️" highlight />
          <StatCard label="Score" value={stats.score.toLocaleString()} icon="⭐" />
          <StatCard label="Assists" value={stats.assists.toLocaleString()} icon="🤝" />
        </div>
      </div>

      {/* Performance Stats */}
      <div className="mb-4">
        <h5 className="section-title">📈 Performance</h5>
        <div className="row g-3">
          <StatCard label="Kills/Min" value={stats.killsPerMinute.toFixed(2)} icon="⏱️" />
          <StatCard label="Kills/Match" value={stats.killsPerMatch.toFixed(1)} icon="🎯" />
          <StatCard label="Damage" value={stats.damage.toLocaleString()} icon="💥" />
          <StatCard label="DPM" value={stats.damagePerMinute.toFixed(1)} icon="🔥" />
          <StatCard label="Headshots" value={stats.headshots} icon="🎯" />
          <StatCard label="Accuracy" value={stats.accuracy} icon="🔫" />
        </div>
      </div>

      {/* Match Stats */}
      <div className="mb-4">
        <h5 className="section-title">🏆 Match Stats</h5>
        <div className="row g-3">
          <StatCard label="Matches Played" value={stats.matchesPlayed.toLocaleString()} icon="🎮" />
          <StatCard label="Wins" value={stats.wins.toLocaleString()} icon="🏅" />
          <StatCard label="Losses" value={stats.loses.toLocaleString()} icon="😔" />
          <StatCard label="Win %" value={stats.winPercent} icon="📊" highlight />
          <StatCard label="Savior Kills" value={stats.saviorKills.toLocaleString()} icon="🛡️" />
          <StatCard label="Multi Kills" value={stats.dividedKills.multiKills.toLocaleString()} icon="⚡" />
        </div>
      </div>

      {/* Support Stats */}
      <div className="mb-4">
        <h5 className="section-title">🩹 Support & Teamplay</h5>
        <div className="row g-3">
          <StatCard label="Revives" value={stats.revives.toLocaleString()} icon="💉" />
          <StatCard label="Heals" value={stats.heals.toLocaleString()} icon="❤️" />
          <StatCard label="Resupplies" value={stats.resupplies.toLocaleString()} icon="🎒" />
          <StatCard label="Repairs" value={stats.repairs.toLocaleString()} icon="🔧" />
          <StatCard label="Squad Revives" value={stats.squadmateRevive.toLocaleString()} icon="👥" />
          <StatCard label="Enemies Spotted" value={stats.enemiesSpotted.toLocaleString()} icon="👁️" />
        </div>
      </div>

      {/* Kill Breakdown */}
      <div className="mb-4">
        <h5 className="section-title">🔫 Kill Breakdown</h5>
        <div className="row g-3">
          <StatCard label="ADS Kills" value={stats.dividedKills.ads.toLocaleString()} icon="🎯" />
          <StatCard label="Hipfire Kills" value={stats.dividedKills.hipfire.toLocaleString()} icon="🔫" />
          <StatCard label="Long Distance" value={stats.dividedKills.longDistance.toLocaleString()} icon="🔭" />
          <StatCard label="Grenade Kills" value={stats.dividedKills.grenades.toLocaleString()} icon="💣" />
          <StatCard label="Vehicle Kills" value={stats.dividedKills.vehicle.toLocaleString()} icon="🚁" />
          <StatCard label="Human Kills" value={stats.dividedKills.human.toLocaleString()} icon="🧍" />
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mb-4">
        <h5 className="section-title">📋 Additional Stats</h5>
        <div className="row g-3">
          <StatCard label="Shots Fired" value={stats.shotsFired.toLocaleString()} icon="🔥" />
          <StatCard label="Shots Hit" value={stats.shotsHit.toLocaleString()} icon="✅" />
          <StatCard label="Vehicles Destroyed" value={stats.vehiclesDestroyed.toLocaleString()} icon="💥" />
          <StatCard label="Gadgets Destroyed" value={stats.gadgetsDestoyed.toLocaleString()} icon="📡" />
          <StatCard label="Throwables" value={stats.thrownThrowables.toLocaleString()} icon="⚾" />
          <StatCard label="Dmg Per Match" value={stats.damagePerMatch.toLocaleString()} icon="📈" />
        </div>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div className="col-6 col-md-4 col-lg-2">
      <div className="stats-card p-3 text-center h-100">
        <div className="fs-4 mb-1">{icon}</div>
        <div className={`stat-value ${highlight ? "stat-highlight" : ""}`}>{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}