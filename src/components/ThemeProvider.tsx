"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type ThemeMode = "dark" | "light" | "system";

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedTheme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "system",
  setMode: () => {},
  resolvedTheme: "dark",
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(resolved: "dark" | "light") {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-bs-theme", resolved);
  }
}

function subscribeToSystemTheme(callback: () => void): () => void {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshotSystemTheme(): "dark" | "light" {
  return getSystemTheme();
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  // Always start with "system" on both server and client to avoid hydration mismatch
  const [mode, setModeState] = useState<ThemeMode>("system");

  // useSyncExternalStore for OS theme
  const osTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSnapshotSystemTheme,
    () => "dark" as const
  );

  const resolvedTheme: "dark" | "light" =
    mode === "system" ? osTheme : mode;

  // Apply theme to DOM
  applyTheme(resolvedTheme);

  // After hydration, read saved preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bf6-theme");
    if (saved && ["dark", "light", "system"].includes(saved)) {
      setModeState(saved as ThemeMode);
    }
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem("bf6-theme", newMode);
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}