import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ ticker: string }> }) {
  try {
    const { ticker } = await params;
    const code = ticker.toUpperCase();
    const [prices, signals, trades] = await Promise.all([
      prisma.dailyPrice.findMany({
        where: { tradingCode: code },
        orderBy: { date: "asc" },
        take: 700
      }),
      prisma.prediction.findMany({
        where: { tradingCode: code },
        orderBy: { predictionTime: "desc" },
        take: 25
      }),
      prisma.paperTrade.findMany({
        where: { ticker: code },
        orderBy: { tradeDate: "desc" },
        take: 25
      })
    ]);
    return NextResponse.json({ ticker: code, prices, signals, trades });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load ticker." }, { status: 500 });
  }
}

