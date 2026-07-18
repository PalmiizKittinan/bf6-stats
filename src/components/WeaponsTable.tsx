"use client";

import DataTable from "./DataTable";
import { WeaponDetail } from "@/types/bf6";

interface WeaponsTableProps {
  weapons: WeaponDetail[];
}

export default function WeaponsTable({ weapons }: WeaponsTableProps) {
  if (!weapons || weapons.length === 0) return null;

  const columns = [
    {
      key: "image",
      label: "",
      width: "48px",
      render: (item: WeaponDetail) => (
        <img
          src={item.image}
          alt={item.weaponName}
          style={{ width: 40, height: 24, objectFit: "contain" }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ),
    },
    {
      key: "weaponName",
      label: "Weapon",
      sortable: true,
      render: (item: WeaponDetail) => (
        <div>
          <span className="fw-semibold text-white">{item.weaponName}</span>
          <br />
          <small className="text-muted">{item.type}</small>
        </div>
      ),
    },
    { key: "kills", label: "Kills", sortable: true, align: "end" as const, render: (item: WeaponDetail) => <span className="fw-bold text-white">{item.kills.toLocaleString()}</span> },
    { key: "killsPerMinute", label: "K/M", sortable: true, align: "end" as const, render: (item: WeaponDetail) => item.killsPerMinute.toFixed(2) },
    { key: "damage", label: "Damage", sortable: true, align: "end" as const, render: (item: WeaponDetail) => item.damage.toLocaleString() },
    { key: "headshotKills", label: "HS Kills", sortable: true, align: "end" as const },
    { key: "headshots", label: "HS %", align: "end" as const },
    { key: "accuracy", label: "Accuracy", align: "end" as const },
    { key: "shotsHit", label: "Hits", sortable: true, align: "end" as const, render: (item: WeaponDetail) => item.shotsHit.toLocaleString() },
    { key: "shotsFired", label: "Fired", sortable: true, align: "end" as const, render: (item: WeaponDetail) => item.shotsFired.toLocaleString() },
    { key: "scopedKills", label: "Scoped", sortable: true, align: "end" as const },
    { key: "hipfireKills", label: "Hipfire", sortable: true, align: "end" as const },
    { key: "multiKills", label: "Multi", sortable: true, align: "end" as const },
    { key: "spawns", label: "Spawns", sortable: true, align: "end" as const },
  ];

  return (
    <DataTable
      columns={columns}
      data={weapons}
      pageSize={10}
      searchable
      searchKeys={["weaponName", "type"]}
      searchPlaceholder="Search weapons..."
      title="Weapons"
      icon="🔫"
      defaultSortKey="kills"
      defaultSortDir="desc"
    />
  );
}