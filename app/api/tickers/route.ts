import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const rows = await prisma.dailyPrice.findMany({
      distinct: ["tradingCode"],
      select: { tradingCode: true },
      orderBy: { tradingCode: "asc" }
    });
    return NextResponse.json({ tickers: rows.map((row) => row.tradingCode) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load tickers." }, { status: 500 });
  }
}

