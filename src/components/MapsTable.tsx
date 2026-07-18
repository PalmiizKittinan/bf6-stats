"use client";

import DataTable from "./DataTable";
import { MapDetail } from "@/types/bf6";

interface MapsTableProps {
  maps: MapDetail[];
}

export default function MapsTable({ maps }: MapsTableProps) {
  if (!maps || maps.length === 0) return null;

  // Filter out the "All" entry
  const filtered = maps.filter((m) => m.id !== "lvlmp");

  const columns = [
    {
      key: "image",
      label: "",
      width: "64px",
      render: (item: MapDetail) =>
        item.image ? (
          <img
            src={item.image}
            alt={item.mapName}
            style={{ width: 56, height: 32, objectFit: "cover", borderRadius: 4 }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div
            style={{
              width: 56,
              height: 32,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 4,
            }}
          />
        ),
    },
    {
      key: "mapName",
      label: "Map",
      sortable: true,
      render: (item: MapDetail) => <span className="fw-semibold text-white">{item.mapName}</span>,
    },
    { key: "matches", label: "Matches", sortable: true, align: "end" as const },
    { key: "wins", label: "Wins", sortable: true, align: "end" as const, render: (item: MapDetail) => <span className="text-success">{item.wins}</span> },
    { key: "losses", label: "Losses", sortable: true, align: "end" as const, render: (item: MapDetail) => <span className="text-danger">{item.losses}</span> },
    {
      key: "winPercent",
      label: "Win %",
      align: "end" as const,
      render: (item: MapDetail) => {
        const pct = parseFloat(item.winPercent);
        const color = pct >= 60 ? "#28a745" : pct >= 40 ? "#ffc107" : "#e94560";
        return <span style={{ color, fontWeight: "bold" }}>{item.winPercent}</span>;
      },
    },
    {
      key: "secondsPlayed",
      label: "Time",
      sortable: true,
      align: "end" as const,
      render: (item: MapDetail) => {
        const hours = Math.floor(item.secondsPlayed / 3600);
        const mins = Math.floor((item.secondsPlayed % 3600) / 60);
        return `${hours}h ${mins}m`;
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={filtered}
      pageSize={15}
      searchable
      searchKeys={["mapName"]}
      searchPlaceholder="Search maps..."
      title="Maps"
      icon="🗺️"
    />
  );
}