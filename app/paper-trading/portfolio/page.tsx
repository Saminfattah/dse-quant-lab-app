import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { HoldingsTable } from "@/components/paper-trading/HoldingsTable";
import { PortfolioSummary } from "@/components/paper-trading/PortfolioSummary";
import { TradeHistoryTable } from "@/components/paper-trading/TradeHistoryTable";
import { EquityCurveChart } from "@/components/charts/EquityCurveChart";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const account = await prisma.paperAccount.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      positions: { where: { quantity: { gt: 0 } }, orderBy: { ticker: "asc" } },
      trades: { orderBy: { createdAt: "desc" }, take: 100 },
      equityCurve: { orderBy: { date: "asc" } }
    }
  }).catch(() => null);

  if (!account) {
    return (
      <AppShell>
        <div className="rounded-lg border bg-card p-10 text-center">
          <h1 className="text-2xl font-semibold">You have not started paper trading yet.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Choose your BDT paper capital to create a virtual account.</p>
          <Button href="/paper-trading/setup" className="mt-5">Choose Paper Capital</Button>
        </div>
      </AppShell>
    );
  }

  const settled = account.positions.filter((item) => item.state === "settled").reduce((sum, item) => sum + item.marketValue, 0);
  const pending = account.positions.filter((item) => item.state !== "settled").reduce((sum, item) => sum + item.marketValue, 0);
  const realized = account.positions.reduce((sum, item) => sum + item.realizedPnl, 0);
  const unrealized = account.positions.reduce((sum, item) => sum + item.unrealizedPnl, 0);
  const total = account.cashBalanceBdt + settled + pending;
  const equity = account.equityCurve.map((row) => ({ date: row.date.toISOString().slice(0, 10), totalEquity: row.totalEquity }));

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Paper Portfolio</h1>
          <p className="mt-1 text-sm text-muted-foreground">T+2 settlement is modeled. Pending positions cannot be sold.</p>
        </div>
        <Button href="/paper-trading/trade">Manual Paper Trade</Button>
      </div>
      <PortfolioSummary
        startingCapital={account.startingCapitalBdt}
        totalValue={total}
        cash={account.cashBalanceBdt}
        settledValue={settled}
        pendingValue={pending}
        realizedPnl={realized}
        unrealizedPnl={unrealized}
        openPositions={account.positions.length}
      />
      <div className="mt-6"><EquityCurveChart data={equity} /></div>
      <section className="mt-6">
        <h2 className="mb-3 text-xl font-semibold">Holdings</h2>
        <HoldingsTable rows={account.positions} />
      </section>
      <section className="mt-6">
        <h2 className="mb-3 text-xl font-semibold">Trade History</h2>
        <TradeHistoryTable rows={account.trades} />
      </section>
    </AppShell>
  );
}

