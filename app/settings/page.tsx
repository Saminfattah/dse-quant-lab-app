import { AppShell } from "@/components/layout/AppShell";
import { ResetPortfolio } from "@/components/paper-trading/ResetPortfolio";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/db";
import { formatBDT, formatPercent } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [account, latestDaily, latestIntraday, model] = await Promise.all([
    prisma.paperAccount.findFirst({ orderBy: { createdAt: "desc" } }).catch(() => null),
    prisma.dailyPrice.findFirst({ orderBy: { date: "desc" } }).catch(() => null),
    prisma.intradayPrice.findFirst({ orderBy: { timestamp: "desc" } }).catch(() => null),
    prisma.modelRegistry.findFirst({ orderBy: { createdAt: "desc" } }).catch(() => null)
  ]);
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">MVP settings are displayed here; persistent configuration can be expanded after auth is added.</p>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader title="Paper Trading" />
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <div>Starting capital: <strong>{formatBDT(account?.startingCapitalBdt ?? 1000000)}</strong></div>
            <div>Mode: <Badge tone="warning">Paper Mode</Badge></div>
            <div>Max allocation per stock: <strong>{formatPercent(0.05)}</strong></div>
            <div>Max open positions: <strong>10</strong></div>
            <div>Slippage rate: <strong>{formatPercent(0.002)}</strong></div>
            <div>Transaction cost: <strong>Configurable placeholder</strong></div>
          </div>
        </Card>
        <ResetPortfolio accountId={account?.id} />
        <Card>
          <CardHeader title="Model and Data" />
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <div>Buy threshold: <strong>{formatPercent(model?.threshold ?? 0.70)}</strong></div>
            <div>Minimum precision requirement: <strong>{formatPercent(0.65)}</strong></div>
            <div>Model version: <strong>{model?.modelVersion ?? "No model registered"}</strong></div>
            <div>Validation precision: <strong>{formatPercent(model?.precision ?? 0)}</strong></div>
            <div>Latest daily update: <strong>{latestDaily?.date.toLocaleDateString() ?? "N/A"}</strong></div>
            <div>Latest intraday update: <strong>{latestIntraday?.timestamp.toLocaleString() ?? "N/A"}</strong></div>
          </div>
        </Card>
        <Card>
          <CardHeader title="Risk Controls" />
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <div>Avoid illiquid stocks: <strong>Enabled</strong></div>
            <div>Avoid floor-active stocks: <strong>Enabled</strong></div>
            <div>Stop-loss: <strong>{formatPercent(0.08)}</strong></div>
            <div>Take-profit: <strong>{formatPercent(0.15)}</strong></div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

