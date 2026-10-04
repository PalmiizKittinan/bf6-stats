import { NextResponse } from "next/server";
import type { BF6Stats } from "@/types/bf6";

const MULTIPLE_API =
  "https://api.gametools.network/bf6/multiple/?categories=multiplayer&raw=false&format_values=true&seperation=false&lang=en-us";
const TIMEOUT_MS = 10_000;

interface PlayerRef {
  player_id: string | number;
  platform: string;
  user_id: string | number;
}

const isPlayerRef = (p: unknown): p is PlayerRef => {
  const r = p as Partial<PlayerRef> | null;
  return !!r && !!r.player_id && !!r.platform && !!r.user_id;
};

// POST /api/multiple
// Body: { player_id, platform, user_id } or an array of them.
// Returns one BF6Stats for a single object body, or an array for an array body.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const isArray = Array.isArray(body);
  const players: unknown[] = Array.isArray(body) ? body : [body];
  if (players.length === 0 || !players.every(isPlayerRef)) {
    return NextResponse.json(
      { error: "Missing required fields: player_id, platform, user_id" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(MULTIPLE_API, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        players.map(({ player_id, platform, user_id }) => ({
          player_id,
          platform,
          user_id,
        }))
      ),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream API error: ${res.status}` },
        { status: 502 }
      );
    }

    // Upstream returns a flat object for one player and { data: [...] } for several
    const data: BF6Stats | BF6Stats[] | { data: BF6Stats[] } = await res.json();
    const results = Array.isArray(data)
      ? data
      : "data" in data && Array.isArray(data.data)
        ? data.data
        : [data as BF6Stats];
    if (results.length === 0 || !results[0]) {
      return NextResponse.json(
        { error: "Player stats not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(isArray ? results : results[0]);
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    return NextResponse.json(
      { error: timedOut ? "Upstream request timed out" : "Failed to get player stats" },
      { status: timedOut ? 504 : 500 }
    );
  }
}
