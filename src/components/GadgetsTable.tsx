"use client";

import DataTable from "./DataTable";
import { GadgetDetail } from "@/types/bf6";

interface GadgetsTableProps {
  gadgets: GadgetDetail[];
}

export default function GadgetsTable({ gadgets }: GadgetsTableProps) {
  if (!gadgets || gadgets.length === 0) return null;

  const columns = [
    {
      key: "image",
      label: "",
      width: "48px",
      render: (item: GadgetDetail) =>
        item.image ? (
          <img
            src={item.image}
            alt={item.gadgetName}
            style={{ width: 32, height: 32, objectFit: "contain" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null,
    },
    {
      key: "gadgetName",
      label: "Gadget",
      sortable: true,
      render: (item: GadgetDetail) => (
        <div>
          <span className="fw-semibold text-white">{item.gadgetName}</span>
          {item.type && (
            <>
              <br />
              <small className="text-muted">{item.type}</small>
            </>
          )}
        </div>
      ),
    },
    { key: "kills", label: "Kills", sortable: true, align: "end" as const, render: (item: GadgetDetail) => <span className="fw-bold text-white">{item.kills}</span> },
    { key: "damage", label: "Damage", sortable: true, align: "end" as const, render: (item: GadgetDetail) => item.damage.toLocaleString() },
    { key: "assists", label: "Assists", sortable: true, align: "end" as const },
    { key: "uses", label: "Uses", sortable: true, align: "end" as const },
    { key: "repairs", label: "Repairs", sortable: true, align: "end" as const },
    { key: "vehiclesDestroyedWith", label: "Veh. Dest.", sortable: true, align: "end" as const },
    { key: "multiKills", label: "Multi", sortable: true, align: "end" as const },
    { key: "spawns", label: "Spawns", sortable: true, align: "end" as const },
  ];

  return (
    <DataTable
      columns={columns}
      data={gadgets}
      pageSize={10}
      searchable
      searchKeys={["gadgetName", "type"]}
      searchPlaceholder="Search gadgets..."
      title="Gadgets"
      icon="🧰"
      defaultSortKey="kills"
      defaultSortDir="desc"
    />
  );
}