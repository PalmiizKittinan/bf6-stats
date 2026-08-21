"use client";

import packageJson from "../../../package.json";

export default function FooterTW() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative text-center py-6 mt-10 overflow-hidden"
      style={{ borderTop: "1px solid var(--bf6-border)", background: "var(--bf6-card-gradient)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--bf6-accent), var(--bf6-accent-2), transparent)" }}
      />
      <p className="text-sm flex items-center justify-center gap-2 flex-wrap relative" style={{ color: "var(--bf6-text-muted)" }}>
        <span>Copyright © {year}</span>
        <span className="tw-divider" />
        <a
          href="https://github.com/PalmiizKittinan"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-medium transition-colors tw-gradient-text"
        >
        PalmiizKittinan{" "}
        </a>
        <span className="tw-divider" />
        <a
          href="https://github.com/PalmiizKittinan/bf6-stats/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-medium transition-colors tw-gradient-text"
        >
          BF6 StatsTracker
        </a>
        {" "}
        <span className="tw-divider" />
        <span className="tw-pill">
          v{packageJson.version}
        </span>
      </p>
    </footer>
  );
}
