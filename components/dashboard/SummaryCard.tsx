import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { classNames } from "@/lib/format";

export function SummaryCard({
  label,
  value,
  helper,
  tone = "neutral",
  icon
}: {
  label: string;
  value: string;
  helper?: string;
  tone?: "positive" | "negative" | "neutral" | "warning";
  icon?: ReactNode;
}) {
  const toneClass = {
    positive: "text-positive",
    negative: "text-negative",
    warning: "text-warning",
    neutral: "text-foreground"
  }[tone];
  return (
    <Card className="min-h-28">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={classNames("mt-2 text-2xl font-semibold", toneClass)}>{value}</p>
          {helper ? <p className="mt-1 text-xs text-muted-foreground">{helper}</p> : null}
        </div>
        {icon ? <div className="rounded-md bg-muted p-2 text-muted-foreground">{icon}</div> : null}
      </div>
    </Card>
  );
}

