"use client";

/**
 * Shared Tailwind UI primitives used across ProfileTW, StatCardsTW, and StatsPageTW.
 */

export function SectionTitle({ icon, title, children }: { icon: string; title: string; children?: React.ReactNode }) {
  return (
    <h5 className="tw-section-title">
      <span>{icon} {title}</span>
      {children}
    </h5>
  );
}

export function StatCard({ icon, label, value, highlight }: { icon: string; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="w-1/2 sm:w-1/3 lg:w-1/6 p-1.5">
      <div className="tw-glass-card p-4 text-center h-full flex flex-col items-center">
        <div className="tw-icon-badge tw-icon-badge-sm mb-2">{icon}</div>
        <div className={`text-lg font-bold ${highlight ? "tw-accent-glow" : ""}`} style={{ color: highlight ? "var(--bf6-accent)" : "var(--bf6-text-strong)" }}>
          {value}
        </div>
        <div className="text-xs uppercase tracking-wider mt-1" style={{ color: "var(--bf6-text-muted)" }}>{label}</div>
      </div>
    </div>
  );
}