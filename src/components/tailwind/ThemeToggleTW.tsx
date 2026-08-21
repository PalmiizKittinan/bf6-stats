"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggleTW() {
  const { mode, setMode } = useTheme();

  const options = [
    { key: "light" as const, icon: "☀️", label: "Light" },
    { key: "system" as const, icon: "💻", label: "OS" },
    { key: "dark" as const, icon: "🌙", label: "Dark" },
  ];

  return (
    <div className="tw-segmented">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => setMode(opt.key)}
          className={`tw-segmented-btn flex items-center gap-1 ${mode === opt.key ? "tw-segmented-btn-active" : ""}`}
        >
          {opt.icon} {opt.label}
        </button>
      ))}
    </div>
  );
}
