"use client";

import packageJson from "../../../package.json";

export default function FooterTW() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="text-center py-6 mt-10"
      style={{ borderTop: "1px solid var(--bf6-border)", background: "var(--bf6-card-gradient)" }}
    >
      <p className="text-sm flex items-center justify-center gap-2 flex-wrap" style={{ color: "var(--bf6-text-muted)" }}>
        <span>Copyright © {year}</span>
        <span className="tw-divider" />
        <a
          href="https://github.com/PalmiizKittinan"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-medium transition-colors"
          style={{ color: "var(--bf6-accent)" }}
        >
        PalmiizKittinan{" "}
        </a>
        <span className="tw-divider" />
        <a
          href="https://github.com/PalmiizKittinan/bf6-stats/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-medium transition-colors"
          style={{ color: "var(--bf6-accent)" }}
        >
          BF6 StatsTracker
        </a>
        {" "}
        <span className="tw-divider" />
        <span
          className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold"
          style={{ background: "var(--bf6-search-bg)", color: "var(--bf6-text-muted)", border: "1px solid var(--bf6-border)" }}
        >
          v{packageJson.version}
        </span>
      </p>
    </footer>
  );
}
