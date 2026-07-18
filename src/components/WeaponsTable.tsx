"use client";

import { Weapon } from "@/types/bf6";

interface WeaponsTableProps {
  weapons: Weapon[];
}

export default function WeaponsTable({ weapons }: WeaponsTableProps) {
  if (!weapons || weapons.length === 0) return null;

  const maxKills = Math.max(...weapons.map((w) => w.kills));

  return (
    <div className="mb-4">
      <h5 className="section-title">🔫 Top Weapons</h5>
      <div className="table-responsive">
        <table className="table table-dark table-hover align-middle mb-0">
          <thead>
            <tr>
              <th style={{ width: "30px" }}>#</th>
              <th>Weapon</th>
              <th>Type</th>
              <th className="text-end">Kills</th>
              <th className="text-end">K/M</th>
              <th className="text-end">Headshots</th>
              <th className="text-end">Accuracy</th>
              <th className="text-end">Damage</th>
              <th style={{ width: "150px" }}>Progress</th>
            </tr>
          </thead>
          <tbody>
            {weapons.slice(0, 15).map((weapon, index) => (
              <tr key={weapon.id}>
                <td className="text-muted">{index + 1}</td>
                <td className="fw-semibold text-white">{weapon.weaponName}</td>
                <td>
                  <span className="badge bg-secondary">{weapon.weaponType}</span>
                </td>
                <td className="text-end fw-bold text-white">{weapon.kills.toLocaleString()}</td>
                <td className="text-end">{weapon.killsPerMinute.toFixed(1)}</td>
                <td className="text-end">{weapon.headshots}</td>
                <td className="text-end">{weapon.accuracy}</td>
                <td className="text-end">{weapon.damage.toLocaleString()}</td>
                <td>
                  <div className="weapon-bar">
                    <div
                      className="weapon-bar-fill"
                      style={{ width: `${(weapon.kills / maxKills) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}