"use client";

import packageJson from "../../../package.json";

export default function FooterTW() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="tw-navbar-shell w-full mt-10"
      style={{ borderRadius: 0, borderWidth: "1px 0 0 0" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3 px-5 py-4">
        <span className="flex items-center gap-2.5">
          <span className="tw-brand-mark" style={{ width: 28, height: 28, fontSize: "0.7rem", borderRadius: 9 }}>BF6</span>
          <a
            href="https://github.com/PalmiizKittinan/bf6-stats/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold tracking-tight hover:underline"
            style={{ color: "var(--bf6-text-strong)" }}
          >
            BF6 StatsTracker
          </a>
          <span className="tw-pill py-0.5">v{packageJson.version}</span>
        </span>
        <p className="text-sm flex items-center gap-2 flex-wrap mb-0" style={{ color: "var(--bf6-text-muted)" }}>
          <span>Copyright © {year}</span>
          <span className="tw-divider" />
          <a
            href="https://github.com/PalmiizKittinan"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline tw-gradient-text"
          >
            PalmiizKittinan
          </a>
        </p>
      </div>
    </footer>
  );
}
