"use client";

import { BF6Stats } from "@/types/bf6";

interface DamageBreakdownProps {
  stats: BF6Stats;
}

export default function DamageBreakdown({ stats }: DamageBreakdownProps) {
  const totalDamage = stats.damage;
  const humanDmg = stats.devidedDamage.human;
  const explosiveDmg = stats.devidedDamage.explosive;
  const passengerDmg = stats.devidedDamage.passenger;
  const vehicleDriverDmg = stats.devidedDamage.vehicleDriver;
  const toVehicleDmg = stats.devidedDamage.toVehicle;
  const withVehicleDmg = stats.devidedDamage.withVehicle;

  const damageTypes = [
    { label: "Human", value: humanDmg, color: "#e94560" },
    { label: "Explosive", value: explosiveDmg, color: "#ffc107" },
    { label: "Passenger", value: passengerDmg, color: "#17a2b8" },
    { label: "Vehicle Driver", value: vehicleDriverDmg, color: "#28a745" },
    { label: "To Vehicle", value: toVehicleDmg, color: "#6f42c1" },
    { label: "With Vehicle", value: withVehicleDmg, color: "#fd7e14" },
  ];

  return (
    <div className="mb-4">
      <h5 className="section-title">💥 Damage Breakdown</h5>
      <div className="row g-3">
        {damageTypes.map((dmg) => (
          <div key={dmg.label} className="col-6 col-md-4 col-lg-2">
            <div className="stats-card p-3 text-center h-100">
              <div
                className="stat-value"
                style={{ color: dmg.color, fontSize: "1.4rem" }}
              >
                {dmg.value.toLocaleString()}
              </div>
              <div className="stat-label">{dmg.label}</div>
              <div className="mt-2">
                <div className="weapon-bar">
                  <div
                    className="weapon-bar-fill"
                    style={{
                      width:
                        totalDamage > 0
                          ? `${(dmg.value / totalDamage) * 100}%`
                          : "0%",
                      background: `linear-gradient(90deg, ${dmg.color}, ${dmg.color}88)`,
                    }}
                  />
                </div>
                <small className="text-muted">
                  {totalDamage > 0
                    ? ((dmg.value / totalDamage) * 100).toFixed(1)
                    : 0}
                  %
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}