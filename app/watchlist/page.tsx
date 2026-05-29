import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { SignalBadge } from "@/components/signals/SignalBadge";
import { WatchlistForm } from "@/components/watchlist/WatchlistForm";
import { RemoveWatchlistButton } from "@/components/watchlist/RemoveWatchlistButton";
import { prisma } from "@/lib/db";
import { formatBDT, formatPercent } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const items = await prisma.watchlistItem.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);
  const signals = await prisma.prediction.findMany({
    where: { tradingCode: { in: items.map((item) => item.ticker) } },
    orderBy: { predictionTime: "desc" },
    take: 100
  }).catch(() => []);
  const latestPrices = await prisma.dailyPrice.findMany({
    where: { tradingCode: { in: items.map((item) => item.ticker) } },
    orderBy: { date: "desc" },
    take: 500
  }).catch(() => []);
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Watchlist</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track symbols, model confidence, notes, and alert preferences.</p>
      </div>
      <Card>
        <CardHeader title="Add Ticker" description="Watchlist is single-user for the MVP and can be extended to Supabase Auth later." />
        <WatchlistForm />
      </Card>
      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.length ? items.map((item) => {
          const signal = signals.find((row) => row.tradingCode === item.ticker);
          const latestPrice = latestPrices.find((row) => row.tradingCode === item.ticker);
          return (
            <Card key={item.id} className="transition hover:border-primary">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{item.ticker}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{item.notes || "No notes"}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {signal ? <SignalBadge signal={signal.signal} /> : null}
                  <RemoveWatchlistButton ticker={item.ticker} />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Probability</span>
                <span className="text-right">{formatPercent(signal?.probabilityUp ?? 0)}</span>
                <span className="text-muted-foreground">Latest price</span>
                <span className="text-right">{formatBDT(latestPrice?.close ?? 0)}</span>
              </div>
              <Button href={`/tickers/${item.ticker}`} variant="secondary" className="mt-4 h-8">View Details</Button>
            </Card>
          );
        }) : <div className="rounded-lg border bg-card p-8 text-sm text-muted-foreground">No watchlist items yet.</div>}
      </div>
    </AppShell>
  );
}
