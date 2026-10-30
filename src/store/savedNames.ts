export interface SavedName {
  name: string;
  platform: string;
  // Show this player's last fetched profile + stats when the site opens
  autoLoad?: boolean;
}

const STORAGE_KEY = "bf6-saved-names";

export function loadSavedNames(): SavedName[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function persistSavedNames(names: SavedName[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
}

// Only one name can load on startup: checking one unchecks the others
export function toggleAutoLoad(names: SavedName[], index: number): SavedName[] {
  const on = !names[index]?.autoLoad;
  return names.map((s, i) => ({ ...s, autoLoad: i === index && on }));
}
