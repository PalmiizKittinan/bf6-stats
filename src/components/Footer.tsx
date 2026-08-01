import packageJson from "../../package.json";

export default function Footer() {
  const year = new Date().getFullYear();
  const version = packageJson.version;

  return (
    <footer
      className="text-center py-4 mt-4"
      style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
    >
      <p className="text-muted small mb-0">
        Copyright © {year}.{" "}
        <a
          href="https://github.com/PalmiizKittinan/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none"
          style={{ color: "#e94560" }}
        >
          PalmiizKittinan
        </a>.{" "}
        <a
          href="https://github.com/PalmiizKittinan/bf6-stats/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none"
          style={{ color: "#e94560" }}
        >
          BF6 StatsTracker
        </a>
        .{" "}
        <span className="badge bg-secondary" style={{ fontSize: "0.7rem" }}>
          v{version}
        </span>
      </p>
    </footer>
  );
}
