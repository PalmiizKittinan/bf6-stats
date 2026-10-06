"use client";

/**
 * Shared Tailwind UI primitives used across ProfileTW, StatCardsTW, and StatsPageTW.
 */

export function SectionTitle({ icon, title, children }: { icon: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="tw-section-head">
      <span className="tw-icon-badge tw-icon-badge-sm">{icon}</span>
      <h5 className="tw-section-title">{title}</h5>
      <span className="tw-section-rule" />
      {children}
    </div>
  );
}

// Static class map so Tailwind can detect every grid variant at build time.
const GRID_COLS = {
  // Wide cards (class / rank / season cards)
  wide3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  wide4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
} as const;

export function StatGrid({ cols = 6, children }: { cols?: keyof typeof GRID_COLS; children: React.ReactNode }) {
  return <div className={`grid gap-3 ${GRID_COLS[cols]}`}>{children}</div>;
}

export function StatCard({ icon, label, value, highlight }: { icon: string; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`tw-glass-card tw-stat-tile tw-rise p-4 h-full flex flex-col gap-3 ${highlight ? "tw-stat-tile-highlight" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="tw-stat-label pt-1">{label}</span>
        <span className="tw-icon-badge tw-icon-badge-sm">{icon}</span>
      </div>
      <div className={`tw-stat-value mt-auto ${highlight ? "tw-gradient-text" : ""}`}>{value}</div>
    </div>
  );
}

export function MiniStat({ label, value, accent }: { label: string; value: React.ReactNode; accent?: "gradient" | "success" }) {
  return (
    <div className="tw-mini-stat">
      <div className="tw-mini-stat-label">{label}</div>
      <div
        className={`tw-mini-stat-value ${accent === "gradient" ? "tw-gradient-text" : ""}`}
        style={accent === "success" ? { color: "var(--bf6-success)" } : undefined}
      >
        {value}
      </div>
    </div>
  );
}

export function EmptyState({ hint }: { hint?: string }) {
  return (
    <div className="text-center py-20">
      <div className="tw-glass-card tw-glass-static tw-rise relative overflow-hidden px-8 py-12 mx-auto" style={{ maxWidth: 560 }}>
        <div className="tw-mesh" />
        <div className="relative">
          <div className="tw-icon-badge mx-auto mb-5" style={{ width: 72, height: 72, fontSize: "2.1rem", borderRadius: 22 }}>🎮</div>
          <div className="tw-eyebrow mb-2">Battlefield 6 · Stats Tracker</div>
          <h3 className="font-bold text-3xl mb-3 tracking-tight tw-gradient-text">Welcome to BF6 Stats</h3>
          <p className="mb-0" style={{ color: "var(--bf6-text-muted)" }}>
            Please enter a player name in the search bar above to start tracking stats.
          </p>
          {hint && (
            <p className="mt-3 mb-0 text-sm" style={{ color: "var(--bf6-text-muted)" }}>
              ℹ️ {hint}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="tw-spinner" />
      <h5 className="mb-0" style={{ color: "var(--bf6-text-strong)" }}>{message}</h5>
    </div>
  );
}

export function RefreshingBar() {
  return (
    <div className="flex items-center justify-center gap-2 py-2 mb-4">
      <div className="tw-spinner tw-spinner-sm" />
      <span style={{ color: "var(--bf6-text-strong)" }}>Refreshing data...</span>
    </div>
  );
}

export function ErrorState({ title, message, children }: { title: string; message: string; children?: React.ReactNode }) {
  return (
    <div className="text-center py-20">
      <div className="tw-glass-card tw-glass-static tw-rise px-8 py-10 mx-auto" style={{ maxWidth: 500, borderColor: "rgba(239, 68, 68, 0.35)" }}>
        <div
          className="tw-icon-badge mx-auto mb-4"
          style={{ width: 64, height: 64, fontSize: "1.8rem", borderRadius: 20, background: "rgba(239, 68, 68, 0.12)", borderColor: "rgba(239, 68, 68, 0.3)" }}
        >
          ⚠️
        </div>
        <h4 className="text-xl font-bold mb-2" style={{ color: "var(--bf6-text-strong)" }}>{title}</h4>
        <p className="mb-0" style={{ color: "var(--bf6-text-muted)" }}>{message}</p>
        {children}
      </div>
    </div>
  );
}
