"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { formatBDT } from "@/lib/format";

export function BacktestChart({ data }: { data: Array<{ date: string; equity: number }> }) {
  if (!data.length) return <div className="rounded-lg border bg-card p-8 text-sm text-muted-foreground">No backtest equity curve available.</div>;
  return (
    <div className="h-72 rounded-lg border bg-card p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
          <Tooltip formatter={(value) => formatBDT(Number(value))} />
          <Line type="monotone" dataKey="equity" stroke="#059669" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

