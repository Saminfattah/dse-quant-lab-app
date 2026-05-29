import { ProbabilityBar } from "@/components/signals/ProbabilityBar";
import { SignalBadge } from "@/components/signals/SignalBadge";
import { SignalReasonCodes } from "@/components/signals/SignalReasonCodes";
import { Button } from "@/components/ui/Button";
import { formatBDT } from "@/lib/format";

type SignalRow = {
  id?: number;
  ticker?: string;
  tradingCode?: string;
  latestPrice?: number | null;
  probabilityUp: number;
  signal: string;
  modelVersion?: string;
  reasonCodes?: string | null;
};

export function SignalTable({ rows }: { rows: SignalRow[] }) {
  if (!rows.length) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
        No model signals available yet. Run the Python signal engine first.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full min-w-[780px] text-sm">
        <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Ticker</th>
            <th className="px-4 py-3">Latest Price</th>
            <th className="px-4 py-3">Probability</th>
            <th className="px-4 py-3">Signal</th>
            <th className="px-4 py-3">Reasons</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const ticker = row.ticker ?? row.tradingCode ?? "N/A";
            return (
              <tr key={`${ticker}-${index}`} className="border-t">
                <td className="px-4 py-3 font-medium">{ticker}</td>
                <td className="px-4 py-3">{formatBDT(row.latestPrice ?? 0)}</td>
                <td className="px-4 py-3"><ProbabilityBar value={row.probabilityUp} /></td>
                <td className="px-4 py-3"><SignalBadge signal={row.signal} /></td>
                <td className="px-4 py-3"><SignalReasonCodes value={row.reasonCodes} /></td>
                <td className="px-4 py-3">
                  <Button href={`/tickers/${ticker}`} variant="secondary" className="h-8">Details</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

