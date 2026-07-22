"use client";

import packageJson from "../../../package.json";

export default function FooterTW() {
  const year = new Date().getFullYear();

  return (
    <footer className="text-center py-4 mt-8" style={{ borderTop: "1px solid var(--bf6-border)" }}>
      <p className="text-sm" style={{ color: "var(--bf6-text-muted)" }}>
        © {year}{" "}
        <a
          href="https://github.com/PalmiizKittinan"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          style={{ color: "var(--bf6-accent)" }}
        >
          Palmiiz
        </a>
        {" • "}
        <a
          href="https://github.com/PalmiizKittinan/bf6-stats"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          style={{ color: "var(--bf6-accent)" }}
        >
          GitHub
        </a>
        {" • "}
        <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold ml-1" style={{ background: "var(--bf6-search-bg)", color: "var(--bf6-text-muted)" }}>
          v{packageJson.version}
        </span>
      </p>
    </footer>
  );
}