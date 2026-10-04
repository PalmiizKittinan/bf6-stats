import { NextResponse } from "next/server";

const SEARCH_API = "https://api.gametools.network/bf6/player/";
const TIMEOUT_MS = 10_000;

// GET /api/search?name={playerName}
export async function GET(request: Request) {
  const name = new URL(request.url).searchParams.get("name")?.trim();
  if (!name) {
    return NextResponse.json(
      { error: "Name parameter is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${SEARCH_API}?name=${encodeURIComponent(name)}&limit=10`,
      { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream API error: ${res.status}` },
        { status: 502 }
      );
    }
    return NextResponse.json(await res.json());
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    return NextResponse.json(
      { error: timedOut ? "Upstream request timed out" : "Failed to search player" },
      { status: timedOut ? 504 : 500 }
    );
  }
}
