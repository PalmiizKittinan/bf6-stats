"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <div className="theme-toggle-group">
      <button
        className={`theme-toggle-btn ${mode === "light" ? "active" : ""}`}
        onClick={() => setMode("light")}
        title="Light theme"
      >
        ☀️ Light
      </button>
      <button
        className={`theme-toggle-btn ${mode === "system" ? "active" : ""}`}
        onClick={() => setMode("system")}
        title="Sync with OS"
      >
        💻 OS
      </button>
      <button
        className={`theme-toggle-btn ${mode === "dark" ? "active" : ""}`}
        onClick={() => setMode("dark")}
        title="Dark theme"
      >
        🌙 Dark
      </button>
    </div>
  );
}