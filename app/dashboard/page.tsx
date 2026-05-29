import { Activity, Banknote, BriefcaseBusiness, LineChart } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { SignalTable } from "@/components/dashboard/SignalTable";
import { EquityCurveChart } from "@/components/charts/EquityCurveChart";
import { prisma } from "@/lib/db";
import { formatBDT, formatPercent } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [account, latestSignals, model, backtest] = await Promise.all([
    prisma.paperAccount.findFirst({ orderBy: { createdAt: "desc" }, include: { equityCurve: { orderBy: { date: "asc" } }, positions: true } }).catch(() => null),
    prisma.signal.findMany({ orderBy: [{ signalDate: "desc" }, { probabilityUp: "desc" }], take: 10 }).catch(() => []),
    prisma.modelRegistry.findFirst({ orderBy: { createdAt: "desc" } }).catch(() => null),
    prisma.backtestRun.findFirst({ orderBy: { createdAt: "desc" } }).catch(() => null)
  ]);
  const fallbackPredictions = latestSignals.length
    ? []
    : await prisma.prediction.findMany({ orderBy: [{ predictionTime: "desc" }, { probabilityUp: "desc" }], take: 10 }).catch(() => []);
  const signalRows = latestSignals.length ? latestSignals : fallbackPredictions;
  const positions = account?.positions ?? [];
  const invested = positions.reduce((sum, item) => sum + item.marketValue, 0);
  const pending = positions.filter((item) => item.state !== "settled").reduce((sum, item) => sum + item.marketValue, 0);
  const realized = positions.reduce((sum, item) => sum + item.realizedPnl, 0);
  const unrealized = positions.reduce((sum, item) => sum + item.unrealizedPnl, 0);
  const equity = account?.equityCurve.map((row) => ({ date: row.date.toISOString().slice(0, 10), totalEquity: row.totalEquity })) ?? [];

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Dashboard Home</h1>
        <p className="mt-1 text-sm text-muted-foreground">A single view of paper portfolio state, model signals, and data readiness.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Paper Portfolio Value" value={formatBDT(account?.currentPortfolioValueBdt ?? 0)} icon={<BriefcaseBusiness className="h-4 w-4" />} />
        <SummaryCard label="Available Cash" value={formatBDT(account?.cashBalanceBdt ?? 0)} icon={<Banknote className="h-4 w-4" />} />
        <SummaryCard label="Invested Amount" value={formatBDT(invested)} />
        <SummaryCard label="Pending Settlement" value={formatBDT(pending)} tone="warning" />
        <SummaryCard label="Realized P&L" value={formatBDT(realized)} tone={realized >= 0 ? "positive" : "negative"} />
        <SummaryCard label="Unrealized P&L" value={formatBDT(unrealized)} tone={unrealized >= 0 ? "positive" : "negative"} />
        <SummaryCard label="Today’s Signals" value={String(signalRows.length)} icon={<Activity className="h-4 w-4" />} />
        <SummaryCard label="Validation Precision" value={formatPercent(model?.precision ?? 0)} icon={<LineChart className="h-4 w-4" />} helper={backtest ? `Latest backtest: ${backtest.status}` : "No backtest yet"} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <EquityCurveChart data={equity} />
        <SignalTable rows={signalRows} />
      </div>
    </AppShell>
  );
}
