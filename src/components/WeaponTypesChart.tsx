"use client";

import { BF6Stats } from "@/types/bf6";

interface WeaponTypesChartProps {
  stats: BF6Stats;
}

export default function WeaponTypesChart({ stats }: WeaponTypesChartProps) {
  const weapons = stats.dividedKills.weapons;
  const weaponTypes = [
    { label: "Assault Rifle", value: weapons.AR, icon: "🔫" },
    { label: "SMG", value: weapons.SMG, icon: "💨" },
    { label: "DMR", value: weapons.DMR, icon: "🎯" },
    { label: "Sniper", value: weapons.Snipers, icon: "🔭" },
    { label: "MG", value: weapons.MG, icon: "🔥" },
    { label: "LMG", value: weapons.LMG, icon: "💪" },
    { label: "Shotgun", value: weapons.Shotguns, icon: "💥" },
    { label: "Pistol", value: weapons.Pistols, icon: "🔫" },
  ];

  const maxKills = Math.max(...weaponTypes.map((w) => w.value));

  return (
    <div className="mb-4">
      <h5 className="section-title">🎯 Weapon Types Breakdown</h5>
      <div className="row g-3">
        {weaponTypes.map((wt) => (
          <div key={wt.label} className="col-6 col-md-3">
            <div className="stats-card p-3 h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-white fw-semibold">
                  {wt.icon} {wt.label}
                </span>
                <span className="stat-highlight fw-bold">{wt.value}</span>
              </div>
              <div className="weapon-bar">
                <div
                  className="weapon-bar-fill"
                  style={{
                    width:
                      maxKills > 0
                        ? `${(wt.value / maxKills) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}