"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export type CSSFramework = "bootstrap" | "tailwind";

interface CSSFrameworkContextValue {
  framework: CSSFramework;
  setFramework: (fw: CSSFramework) => void;
}

const CSSFrameworkContext = createContext<CSSFrameworkContextValue>({
  framework: "bootstrap",
  setFramework: () => {},
});

export function useCSSFramework() {
  return useContext(CSSFrameworkContext);
}

const STORAGE_KEY = "bf6-css-framework";

export default function CSSFrameworkProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [framework, setFrameworkState] = useState<CSSFramework>("bootstrap");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "bootstrap" || saved === "tailwind") {
      setFrameworkState(saved);
      document.documentElement.setAttribute("data-framework", saved);
    }
  }, []);

  const setFramework = useCallback((fw: CSSFramework) => {
    setFrameworkState(fw);
    localStorage.setItem(STORAGE_KEY, fw);
    document.documentElement.setAttribute("data-framework", fw);
  }, []);

  return (
    <CSSFrameworkContext.Provider value={{ framework, setFramework }}>
      {children}
    </CSSFrameworkContext.Provider>
  );
}