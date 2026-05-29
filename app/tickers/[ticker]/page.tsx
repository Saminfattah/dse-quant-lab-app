import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { SignalBadge } from "@/components/signals/SignalBadge";
import { PriceChart } from "@/components/charts/PriceChart";
import { VolumeChart } from "@/components/charts/VolumeChart";
import { prisma } from "@/lib/db";
import { formatBDT, formatPercent } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function TickerDetailPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const code = ticker.toUpperCase();
  const [prices, signal, trades] = await Promise.all([
    prisma.dailyPrice.findMany({ where: { tradingCode: code }, orderBy: { date: "asc" }, take: 500 }).catch(() => []),
    prisma.prediction.findFirst({ where: { tradingCode: code }, orderBy: { predictionTime: "desc" } }).catch(() => null),
    prisma.paperTrade.findMany({ where: { ticker: code }, orderBy: { tradeDate: "desc" }, take: 10 }).catch(() => [])
  ]);
  const chartData = prices.map((row, index, arr) => {
    const slice = arr.slice(Math.max(0, index - 19), index + 1);
    const ma20 = slice.reduce((sum, item) => sum + Number(item.close ?? 0), 0) / slice.length;
    return { date: row.date.toISOString().slice(0, 10), close: row.close, volume: row.volume, ma20 };
  });
  const latest = prices.at(-1);
  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">{code}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Price, volume, latest model signal, and related paper trades.</p>
        </div>
        <div className="flex gap-2">
          <Button href={`/paper-trading/trade?ticker=${code}&action=BUY`}>Paper Buy</Button>
          <Button href="/watchlist" variant="secondary">Add to Watchlist</Button>
        </div>
      </div>
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4"><p className="text-sm text-muted-foreground">Latest Close</p><p className="mt-2 text-2xl font-semibold">{formatBDT(latest?.close ?? 0)}</p></div>
        <div className="rounded-lg border bg-card p-4"><p className="text-sm text-muted-foreground">Volume</p><p className="mt-2 text-2xl font-semibold">{Number(latest?.volume ?? 0).toLocaleString()}</p></div>
        <div className="rounded-lg border bg-card p-4"><p className="text-sm text-muted-foreground">Latest Signal</p><div className="mt-3">{signal ? <SignalBadge signal={signal.signal} /> : "N/A"}</div></div>
        <div className="rounded-lg border bg-card p-4"><p className="text-sm text-muted-foreground">Probability Up</p><p className="mt-2 text-2xl font-semibold">{formatPercent(signal?.probabilityUp ?? 0)}</p></div>
      </div>
      <div className="grid gap-6">
        <PriceChart data={chartData} />
        <VolumeChart data={chartData} />
      </div>
      <section className="mt-6 rounded-lg border bg-card p-5">
        <h2 className="text-xl font-semibold">Related Paper Trades</h2>
        <div className="mt-3 grid gap-2">
          {trades.length ? trades.map((trade) => (
            <div key={trade.id} className="flex justify-between rounded-md bg-muted p-3 text-sm">
              <span>{trade.action} {trade.quantity} @ {formatBDT(trade.price)}</span>
              <span>{trade.tradeDate.toLocaleDateString()}</span>
            </div>
          )) : <p className="text-sm text-muted-foreground">No paper trades for this ticker yet.</p>}
        </div>
      </section>
    </AppShell>
  );
}

