import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { backtestRunSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = backtestRunSchema.parse({
      ...body,
      startingCapitalBdt: Number(body.startingCapitalBdt),
      maxAllocationPerStock: Number(body.maxAllocationPerStock),
      maxOpenPositions: Number(body.maxOpenPositions),
      buyThreshold: Number(body.buyThreshold),
      slippageRate: Number(body.slippageRate),
      transactionCostRate: Number(body.transactionCostRate)
    });
    const run = await prisma.backtestRun.create({
      data: {
        userId: "single-user",
        runName: parsed.runName,
        startDate: new Date(parsed.startDate),
        endDate: new Date(parsed.endDate),
        startingCapitalBdt: parsed.startingCapitalBdt,
        maxAllocationPerStock: parsed.maxAllocationPerStock,
        maxOpenPositions: parsed.maxOpenPositions,
        buyThreshold: parsed.buyThreshold,
        slippageRate: parsed.slippageRate,
        transactionCostRate: parsed.transactionCostRate,
        status: "queued",
        resultJson: {
          message: "Queued for Python worker. Vercel does not run heavy backtests."
        }
      }
    });
    return NextResponse.json({ run });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create backtest run." }, { status: 400 });
  }
}

