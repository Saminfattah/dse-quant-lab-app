import { AppShell } from "@/components/layout/AppShell";
import { BacktestRunForm } from "@/components/backtesting/BacktestRunForm";
import { BacktestChart } from "@/components/charts/BacktestChart";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { prisma } from "@/lib/db";
import { formatBDT, formatPercent } from "@/lib/format";

export const dynamic = "force-dynamic";

type BacktestResult = {
  equityCurve?: Array<{ date: string; equity: number }>;
  totalReturn?: number;
  maxDrawdown?: number;
  winRate?: number;
  tradeCount?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
};

export default async function BacktestingPage() {
  const runs = await prisma.backtestRun.findMany({ orderBy: { createdAt: "desc" }, take: 10 }).catch(() => []);
  const latest = runs[0];
  const result = (latest?.resultJson ?? {}) as unknown as BacktestResult;
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Backtesting</h1>
        <p className="mt-1 text-sm text-muted-foreground">Submit jobs to the Python worker and review completed results here.</p>
      </div>
      <BacktestRunForm />
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total Return" value={formatPercent(result.totalReturn ?? 0)} />
        <SummaryCard label="Max Drawdown" value={formatPercent(result.maxDrawdown ?? 0)} tone="negative" />
        <SummaryCard label="Win Rate" value={formatPercent(result.winRate ?? 0)} />
        <SummaryCard label="Trades" value={String(result.tradeCount ?? 0)} />
        <SummaryCard label="Precision" value={formatPercent(result.precision ?? 0)} />
        <SummaryCard label="Recall" value={formatPercent(result.recall ?? 0)} />
        <SummaryCard label="F1 Score" value={formatPercent(result.f1Score ?? 0)} />
        <SummaryCard label="Starting Capital" value={formatBDT(latest?.startingCapitalBdt ?? 0)} />
      </div>
      <div className="mt-6">
        <BacktestChart data={result.equityCurve ?? []} />
      </div>
      <section className="mt-6 rounded-lg border bg-card p-5">
        <h2 className="text-xl font-semibold">Recent Backtest Jobs</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground">
              <tr><th className="py-2">Run</th><th>Status</th><th>Dates</th><th>Threshold</th><th>Created</th></tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.id} className="border-t">
                  <td className="py-3">{run.runName}</td>
                  <td>{run.status}</td>
                  <td>{run.startDate.toLocaleDateString()} to {run.endDate.toLocaleDateString()}</td>
                  <td>{formatPercent(run.buyThreshold)}</td>
                  <td>{run.createdAt.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
