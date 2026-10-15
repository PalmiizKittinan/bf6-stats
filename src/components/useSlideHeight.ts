"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Tracks the height of the active carousel slide so the viewport can shrink/grow to fit it. */
export function useSlideHeight(index: number) {
  const slides = useRef<(HTMLElement | null)[]>([]);
  const [height, setHeight] = useState<number | undefined>(undefined);

  const setRef = useCallback(
    (i: number) => (el: HTMLElement | null) => {
      slides.current[i] = el;
    },
    [],
  );

  useEffect(() => {
    const el = slides.current[index];
    if (!el) return;
    const update = () => setHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [index]);

  return { height, setRef };
}
