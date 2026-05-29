import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TradeForm } from "@/components/paper-trading/TradeForm";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ManualTradePage() {
  const [account, tickers] = await Promise.all([
    prisma.paperAccount.findFirst({ orderBy: { createdAt: "desc" } }).catch(() => null),
    prisma.dailyPrice.findMany({ distinct: ["tradingCode"], select: { tradingCode: true }, orderBy: { tradingCode: "asc" }, take: 500 }).catch(() => [])
  ]);
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Manual Paper Trade</h1>
        <p className="mt-1 text-sm text-muted-foreground">Buy/sell virtual positions. No short selling and no pending-share selling.</p>
      </div>
      <Suspense>
        <TradeForm tickers={tickers.map((row) => row.tradingCode)} accountId={account?.id} />
      </Suspense>
    </AppShell>
  );
}

