import { NextResponse } from "next/server";
import { resetPaperAccount, updatePaperEquityCurve } from "@/lib/paperTrading";
import { resetAccountSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = resetAccountSchema.parse({
      accountId: Number(body.accountId),
      startingCapitalBdt: Number(body.startingCapitalBdt),
      confirmation: body.confirmation
    });
    const account = await resetPaperAccount(parsed.accountId, parsed.startingCapitalBdt);
    await updatePaperEquityCurve(account.id);
    return NextResponse.json({ account });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not reset paper account." }, { status: 400 });
  }
}

