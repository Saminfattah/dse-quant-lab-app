import { NextResponse } from "next/server";
import { getActivePaperAccount, executePaperBuy, updatePaperEquityCurve } from "@/lib/paperTrading";
import { paperTradeSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = paperTradeSchema.parse({
      accountId: body.accountId ? Number(body.accountId) : undefined,
      ticker: body.ticker,
      quantity: Number(body.quantity),
      price: Number(body.price),
      tradeDate: body.tradeDate
    });
    const account = parsed.accountId ? { id: parsed.accountId } : await getActivePaperAccount();
    if (!account) throw new Error("Create a paper account first.");
    const result = await executePaperBuy(account.id, parsed.ticker, parsed.quantity, parsed.price, parsed.tradeDate ? new Date(parsed.tradeDate) : new Date());
    await updatePaperEquityCurve(account.id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Paper buy failed." }, { status: 400 });
  }
}

