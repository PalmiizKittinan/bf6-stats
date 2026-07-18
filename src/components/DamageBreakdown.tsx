"use client";

import { BF6Stats } from "@/types/bf6";

interface DamageBreakdownProps {
  stats: BF6Stats;
}

export default function DamageBreakdown({ stats }: DamageBreakdownProps) {
  const totalDamage = stats.damage;
  const damageTypes = [
    { label: "Human", value: stats.devidedDamage.human, color: "#e94560" },
    { label: "Explosive", value: stats.devidedDamage.explosive, color: "#ffc107" },
    { label: "Passenger", value: stats.devidedDamage.passenger, color: "#17a2b8" },
    { label: "Vehicle Driver", value: stats.devidedDamage.vehicleDriver, color: "#28a745" },
    { label: "To Vehicle", value: stats.devidedDamage.toVehicle, color: "#6f42c1" },
    { label: "With Vehicle", value: stats.devidedDamage.withVehicle, color: "#fd7e14" },
  ];

  const assistTypes = [
    { label: "Human", value: stats.devidedAssists.human, color: "#e94560" },
    { label: "Passenger", value: stats.devidedAssists.passenger, color: "#17a2b8" },
    { label: "Spot", value: stats.devidedAssists.spot, color: "#ffc107" },
    { label: "Driver", value: stats.devidedAssists.driver, color: "#28a745" },
    { label: "Pilot", value: stats.devidedAssists.pilot, color: "#6f42c1" },
  ];

  return (
    <>
      <div className="mb-4">
        <h5 className="section-title">💥 Damage Breakdown</h5>
        <div className="row g-3">
          {damageTypes.map((dmg) => (
            <div key={dmg.label} className="col-6 col-md-4 col-lg-2">
              <div className="stats-card p-3 text-center h-100">
                <div className="stat-value" style={{ color: dmg.color, fontSize: "1.4rem" }}>
                  {dmg.value.toLocaleString()}
                </div>
                <div className="stat-label">{dmg.label}</div>
                <div className="mt-2">
                  <div className="weapon-bar">
                    <div
                      className="weapon-bar-fill"
                      style={{
                        width: totalDamage > 0 ? `${(dmg.value / totalDamage) * 100}%` : "0%",
                        background: `linear-gradient(90deg, ${dmg.color}, ${dmg.color}88)`,
                      }}
                    />
                  </div>
                  <small className="text-muted">
                    {totalDamage > 0 ? ((dmg.value / totalDamage) * 100).toFixed(1) : 0}%
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h5 className="section-title">🤝 Assists Breakdown</h5>
        <div className="row g-3">
          {assistTypes.map((a) => {
            const totalAssists = stats.assists || 1;
            return (
              <div key={a.label} className="col-6 col-md-4 col-lg-2">
                <div className="stats-card p-3 text-center h-100">
                  <div className="stat-value" style={{ color: a.color, fontSize: "1.4rem" }}>
                    {a.value.toLocaleString()}
                  </div>
                  <div className="stat-label">{a.label}</div>
                  <div className="mt-2">
                    <div className="weapon-bar">
                      <div
                        className="weapon-bar-fill"
                        style={{
                          width: `${(a.value / totalAssists) * 100}%`,
                          background: `linear-gradient(90deg, ${a.color}, ${a.color}88)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}