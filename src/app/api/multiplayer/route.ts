import { NextRequest, NextResponse } from "next/server";

const MULTIPLE_API = "https://api.gametools.network/bf6/multiple/";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const apiUrl = searchParams
      ? `${MULTIPLE_API}?${searchParams}`
      : MULTIPLE_API;

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Proxy error" },
      { status: 500 }
    );
  }
}