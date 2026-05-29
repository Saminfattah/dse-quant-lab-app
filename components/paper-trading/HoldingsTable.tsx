import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatBDT, formatPercent } from "@/lib/format";

type Holding = {
  id: number;
  ticker: string;
  quantity: number;
  averagePrice: number;
  latestPrice: number | null;
  marketValue: number;
  state: string;
  settlementDate: Date;
  unrealizedPnl: number;
};

export function HoldingsTable({ rows }: { rows: Holding[] }) {
  if (!rows.length) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
        No paper positions yet. Start by reviewing model signals or placing a manual paper trade.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full min-w-[960px] text-sm">
        <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Ticker</th>
            <th className="px-4 py-3">Quantity</th>
            <th className="px-4 py-3">Avg Buy</th>
            <th className="px-4 py-3">Latest</th>
            <th className="px-4 py-3">Market Value</th>
            <th className="px-4 py-3">Unrealized P&L</th>
            <th className="px-4 py-3">Return</th>
            <th className="px-4 py-3">State</th>
            <th className="px-4 py-3">Settlement</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const latest = row.latestPrice ?? row.averagePrice;
            const returnPct = latest / row.averagePrice - 1;
            const settled = row.state === "settled";
            return (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-3 font-medium">{row.ticker}</td>
                <td className="px-4 py-3">{row.quantity}</td>
                <td className="px-4 py-3">{formatBDT(row.averagePrice)}</td>
                <td className="px-4 py-3">{formatBDT(latest)}</td>
                <td className="px-4 py-3">{formatBDT(row.marketValue)}</td>
                <td className={row.unrealizedPnl >= 0 ? "px-4 py-3 text-positive" : "px-4 py-3 text-negative"}>{formatBDT(row.unrealizedPnl)}</td>
                <td className="px-4 py-3">{formatPercent(returnPct)}</td>
                <td className="px-4 py-3"><Badge tone={settled ? "positive" : "warning"}>{settled ? "Settled" : row.state.replace("_", " ")}</Badge></td>
                <td className="px-4 py-3">{new Date(row.settlementDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button href={`/paper-trading/trade?ticker=${row.ticker}&action=BUY`} variant="secondary" className="h-8">Paper Buy</Button>
                    <Button href={`/paper-trading/trade?ticker=${row.ticker}&action=SELL`} variant={settled ? "secondary" : "ghost"} className="h-8">Paper Sell</Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

