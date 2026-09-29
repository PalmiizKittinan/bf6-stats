import { PerSeasonStats } from "@/types/bf6";

export interface SeasonModeRow {
  key: string;
  name: string;
  image: string;
  matches: number;
  wins: number;
  losses: number;
  winPercent: string;
  kills: number;
  deaths: number;
  killDeath: number;
  kpm: number;
  score: number;
  timePlayed: string;
  secondsPlayed: number;
}

export interface SeasonPage {
  key: string;
  label: string; // "Season 4"
  modes: SeasonModeRow[];
}

function seasonNumber(key: string): number {
  const m = key.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : -1;
}

/** Turn `perSeason` into pages sorted newest season first. */
export function buildSeasonPages(perSeason: PerSeasonStats): SeasonPage[] {
  return Object.entries(perSeason)
    .sort(([a], [b]) => seasonNumber(b) - seasonNumber(a))
    .map(([key, modes]) => ({
      key,
      label: key.replace(/^Season\s*(\d+)$/i, "Season $1"),
      modes: Object.entries(modes)
        .map(([modeKey, m]): SeasonModeRow => {
          // Custom modes (e.g. Portal) report zeros at the top level; the
          // gameModes entry holds the real numbers, so prefer it when present.
          const gm = m.gameModes?.[0];
          return {
            key: modeKey,
            name: m.gamemodeName,
            image: m.image,
            matches: gm?.matches ?? m.matchesPlayed ?? 0,
            wins: gm?.wins ?? m.wins ?? 0,
            losses: gm?.losses ?? m.loses ?? 0,
            winPercent: gm?.winPercent ?? m.winPercent ?? "0%",
            kills: gm?.kills ?? m.kills ?? 0,
            deaths: gm?.deaths ?? m.deaths ?? 0,
            killDeath: gm?.killDeath ?? m.killDeath ?? 0,
            kpm: gm?.kpm ?? m.killsPerMinute ?? 0,
            score: gm?.scoreIn ?? m.score ?? 0,
            timePlayed: m.timePlayed ?? "-",
            secondsPlayed: gm?.secondsPlayed ?? m.secondsPlayed ?? 0,
          };
        })
        .sort((a, b) => b.secondsPlayed - a.secondsPlayed),
    }));
}
