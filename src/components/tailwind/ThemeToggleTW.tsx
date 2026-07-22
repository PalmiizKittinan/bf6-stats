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
    <div className="flex gap-1">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => setMode(opt.key)}
          className={`
            flex items-center gap-1 px-2.5 py-1 rounded-md text-xs cursor-pointer whitespace-nowrap
            border transition-all duration-200
            ${
              mode === opt.key
                ? "border-bf6-accent bg-bf6-accent text-white"
                : "border-bf6-border-hover text-bf6-text bg-bf6-search-bg hover:border-bf6-accent hover:text-bf6-accent"
            }
          `}
        >
          {opt.icon} {opt.label}
        </button>
      ))}
    </div>
  );
}