import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculatePortfolioValue, getActivePaperAccount, updatePaperEquityCurve } from "@/lib/paperTrading";

export async function GET() {
  try {
    const account = await getActivePaperAccount();
    if (!account) {
      return NextResponse.json({ account: null, message: "No paper account found." });
    }
    await updatePaperEquityCurve(account.id);
    const value = await calculatePortfolioValue(account.id);
    const [positions, trades, equityCurve] = await Promise.all([
      prisma.paperPosition.findMany({ where: { accountId: account.id, quantity: { gt: 0 } }, orderBy: { ticker: "asc" } }),
      prisma.paperTrade.findMany({ where: { accountId: account.id }, orderBy: { createdAt: "desc" }, take: 100 }),
      prisma.paperEquityCurve.findMany({ where: { accountId: account.id }, orderBy: { date: "asc" } })
    ]);
    return NextResponse.json({ account, value, positions, trades, equityCurve });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load portfolio." }, { status: 500 });
  }
}

