import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const run = await prisma.backtestRun.findUnique({ where: { id: Number(id) } });
    if (!run) return NextResponse.json({ error: "Backtest run not found." }, { status: 404 });
    return NextResponse.json({ run });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load backtest run." }, { status: 500 });
  }
}

