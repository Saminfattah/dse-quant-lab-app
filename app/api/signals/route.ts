import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker")?.toUpperCase();
    const signal = searchParams.get("signal");
    const minProbability = Number(searchParams.get("minProbability") ?? 0);
    const signals = await prisma.signal.findMany({
      where: {
        ...(ticker ? { ticker } : {}),
        ...(signal ? { signal } : {}),
        probabilityUp: { gte: minProbability }
      },
      orderBy: [{ signalDate: "desc" }, { probabilityUp: "desc" }],
      take: 250
    });
    if (signals.length > 0) return NextResponse.json({ signals });
    const predictions = await prisma.prediction.findMany({
      where: {
        ...(ticker ? { tradingCode: ticker } : {}),
        ...(signal ? { signal } : {}),
        probabilityUp: { gte: minProbability }
      },
      orderBy: [{ predictionTime: "desc" }, { probabilityUp: "desc" }],
      take: 250
    });
    return NextResponse.json({ signals: predictions });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load signals." }, { status: 500 });
  }
}

