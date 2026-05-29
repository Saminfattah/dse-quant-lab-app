"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function PriceChart({ data }: { data: Array<{ date: string; close: number | null; ma20?: number | null }> }) {
  if (!data.length) return <div className="rounded-lg border bg-card p-8 text-sm text-muted-foreground">No price history available.</div>;
  return (
    <div className="h-80 rounded-lg border bg-card p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
          <Tooltip />
          <Line dataKey="close" stroke="#059669" strokeWidth={2} dot={false} />
          <Line dataKey="ma20" stroke="#2563eb" strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

