"use client";

import DataTable from "./DataTable";
import { VehicleDetail } from "@/types/bf6";

interface VehiclesTableProps {
  vehicles: VehicleDetail[];
}

export default function VehiclesTable({ vehicles }: VehiclesTableProps) {
  if (!vehicles || vehicles.length === 0) return null;

  const columns = [
    {
      key: "image",
      label: "",
      width: "48px",
      render: (item: VehicleDetail) =>
        item.image ? (
          <img
            src={item.image}
            alt={item.vehicleName}
            style={{ width: 40, height: 24, objectFit: "contain" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null,
    },
    {
      key: "vehicleName",
      label: "Vehicle",
      sortable: true,
      render: (item: VehicleDetail) => (
        <div>
          <span className="fw-semibold text-white">{item.vehicleName}</span>
          <br />
          <small className="text-muted">{item.type}</small>
        </div>
      ),
    },
    { key: "kills", label: "Kills", sortable: true, align: "end" as const, render: (item: VehicleDetail) => <span className="fw-bold text-white">{item.kills.toLocaleString()}</span> },
    { key: "killsPerMinute", label: "K/M", sortable: true, align: "end" as const, render: (item: VehicleDetail) => item.killsPerMinute.toFixed(2) },
    { key: "damage", label: "Damage", sortable: true, align: "end" as const, render: (item: VehicleDetail) => item.damage.toLocaleString() },
    { key: "spawns", label: "Spawns", sortable: true, align: "end" as const },
    { key: "assists", label: "Assists", sortable: true, align: "end" as const },
    { key: "multiKills", label: "Multi", sortable: true, align: "end" as const },
    { key: "distanceTraveled", label: "Distance", sortable: true, align: "end" as const, render: (item: VehicleDetail) => item.distanceTraveled.toLocaleString() },
    { key: "destroyed", label: "Destroyed", sortable: true, align: "end" as const },
    { key: "damageTo", label: "Dmg Taken", sortable: true, align: "end" as const, render: (item: VehicleDetail) => item.damageTo.toLocaleString() },
  ];

  return (
    <DataTable
      columns={columns}
      data={vehicles}
      pageSize={10}
      searchable
      searchKeys={["vehicleName", "type"]}
      searchPlaceholder="Search vehicles..."
      title="Vehicles"
      icon="🚗"
      defaultSortKey="kills"
      defaultSortDir="desc"
    />
  );
}