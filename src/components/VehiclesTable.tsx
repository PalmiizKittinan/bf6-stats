"use client";

import { Vehicle } from "@/types/bf6";

interface VehiclesTableProps {
  vehicles: Vehicle[];
}

export default function VehiclesTable({ vehicles }: VehiclesTableProps) {
  if (!vehicles || vehicles.length === 0) return null;

  const maxKills = Math.max(...vehicles.map((v) => v.kills));

  return (
    <div className="mb-4">
      <h5 className="section-title">🚗 Vehicles</h5>
      <div className="table-responsive">
        <table className="table table-dark table-hover align-middle mb-0">
          <thead>
            <tr>
              <th style={{ width: "30px" }}>#</th>
              <th>Vehicle</th>
              <th className="text-end">Kills</th>
              <th className="text-end">K/M</th>
              <th className="text-end">Damage</th>
              <th className="text-end">Spawns</th>
              <th className="text-end">Destroyed</th>
              <th className="text-end">Distance</th>
              <th style={{ width: "150px" }}>Progress</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, index) => (
              <tr key={vehicle.id}>
                <td className="text-muted">{index + 1}</td>
                <td className="fw-semibold text-white">
                  {vehicle.archetypeName}
                </td>
                <td className="text-end fw-bold text-white">
                  {vehicle.kills.toLocaleString()}
                </td>
                <td className="text-end">
                  {vehicle.killsPerMinute.toFixed(1)}
                </td>
                <td className="text-end">
                  {vehicle.damage.toLocaleString()}
                </td>
                <td className="text-end">{vehicle.spawns}</td>
                <td className="text-end">{vehicle.destroyed}</td>
                <td className="text-end">
                  {vehicle.distanceTraveled.toLocaleString()}
                </td>
                <td>
                  <div className="weapon-bar">
                    <div
                      className="weapon-bar-fill"
                      style={{
                        width:
                          maxKills > 0
                            ? `${(vehicle.kills / maxKills) * 100}%`
                            : "0%",
                        background:
                          "linear-gradient(90deg, #17a2b8, #6dd5ed)",
                      }}
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