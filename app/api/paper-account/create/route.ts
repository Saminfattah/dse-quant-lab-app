import { NextResponse } from "next/server";
import { createPaperAccount, updatePaperEquityCurve } from "@/lib/paperTrading";
import { capitalSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = capitalSchema.parse({ startingCapitalBdt: Number(body.startingCapitalBdt) });
    const account = await createPaperAccount(parsed.startingCapitalBdt);
    await updatePaperEquityCurve(account.id);
    return NextResponse.json({ account });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create paper account." }, { status: 400 });
  }
}

