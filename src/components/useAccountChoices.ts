"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

export const PLATFORM_LABELS: Record<string, string> = {
  ea: "EA",
  steam: "Steam",
  xbox: "Xbox",
  psn: "PlayStation",
};

// After Search: the searched name exists on several platforms, the user picks one
export function useAccountChoices() {
  const choices = usePlayerStore((s) => s.choices);
  const loading = usePlayerStore((s) => s.choicesLoading);
  const choose = usePlayerStore((s) => s.chooseAccount);
  const dismiss = usePlayerStore((s) => s.dismissChoices);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!choices) return;
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        dismiss();
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [choices, dismiss]);

  return { wrapperRef, choices, loading, choose, dismiss };
}

export const formatKills = (kills: number | null) =>
  kills === null ? "no stats" : `${kills.toLocaleString()} kills`;
