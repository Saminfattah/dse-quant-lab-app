import { formatPercent } from "@/lib/format";

export function ProbabilityBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value * 100));
  return (
    <div className="min-w-32">
      <div className="mb-1 flex justify-between text-xs">
        <span>{formatPercent(value, 0)}</span>
        <span className="text-muted-foreground">P(Up)</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

