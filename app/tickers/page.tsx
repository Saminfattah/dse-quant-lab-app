import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/db";
import { formatBDT, formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function TickersPage() {
  const latest = await prisma.dailyPrice.findMany({
    distinct: ["tradingCode"],
    orderBy: [{ tradingCode: "asc" }, { date: "desc" }],
    take: 500
  }).catch(() => []);
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">DSE Tickers</h1>
        <p className="mt-1 text-sm text-muted-foreground">Browse symbols loaded by the Python data worker.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {latest.length ? latest.map((row) => (
          <Link key={row.tradingCode} href={`/tickers/${row.tradingCode}`}>
            <Card className="transition hover:border-primary">
              <div className="font-semibold">{row.tradingCode}</div>
              <div className="mt-2 text-sm text-muted-foreground">Close: {formatBDT(row.close ?? 0)}</div>
              <div className="text-sm text-muted-foreground">Volume: {formatNumber(row.volume ?? 0)}</div>
            </Card>
          </Link>
        )) : <div className="rounded-lg border bg-card p-8 text-sm text-muted-foreground">No tickers available. Run the Python historical pipeline first.</div>}
      </div>
    </AppShell>
  );
}

