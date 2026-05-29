import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { formatBDT, formatPercent } from "@/lib/format";

export function PortfolioSummary({
  startingCapital,
  totalValue,
  cash,
  settledValue,
  pendingValue,
  realizedPnl,
  unrealizedPnl,
  openPositions
}: {
  startingCapital: number;
  totalValue: number;
  cash: number;
  settledValue: number;
  pendingValue: number;
  realizedPnl: number;
  unrealizedPnl: number;
  openPositions: number;
}) {
  const totalReturn = startingCapital > 0 ? totalValue / startingCapital - 1 : 0;
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard label="Starting Capital" value={formatBDT(startingCapital)} />
      <SummaryCard label="Portfolio Value" value={formatBDT(totalValue)} tone={totalReturn >= 0 ? "positive" : "negative"} helper={formatPercent(totalReturn)} />
      <SummaryCard label="Available Cash" value={formatBDT(cash)} />
      <SummaryCard label="Settled Holdings" value={formatBDT(settledValue)} />
      <SummaryCard label="Pending T+2" value={formatBDT(pendingValue)} tone="warning" />
      <SummaryCard label="Realized P&L" value={formatBDT(realizedPnl)} tone={realizedPnl >= 0 ? "positive" : "negative"} />
      <SummaryCard label="Unrealized P&L" value={formatBDT(unrealizedPnl)} tone={unrealizedPnl >= 0 ? "positive" : "negative"} />
      <SummaryCard label="Open Positions" value={String(openPositions)} />
    </div>
  );
}

