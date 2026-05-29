import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const items = await prisma.watchlistItem.findMany({
      where: { userId: "single-user" },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load watchlist." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ticker = String(body.ticker ?? "").toUpperCase().trim();
    if (!ticker) throw new Error("Ticker is required.");
    const item = await prisma.watchlistItem.upsert({
      where: { userId_ticker: { userId: "single-user", ticker } },
      update: { notes: body.notes ?? "" },
      create: { userId: "single-user", ticker, notes: body.notes ?? "" }
    });
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not update watchlist." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const ticker = String(body.ticker ?? "").toUpperCase().trim();
    if (!ticker) throw new Error("Ticker is required.");
    await prisma.watchlistItem.deleteMany({ where: { userId: "single-user", ticker } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not remove watchlist item." }, { status: 400 });
  }
}
