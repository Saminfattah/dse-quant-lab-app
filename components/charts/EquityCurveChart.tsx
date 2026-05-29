"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatBDT } from "@/lib/format";

export function EquityCurveChart({ data }: { data: Array<{ date: string; totalEquity: number }> }) {
  if (!data.length) return <div className="rounded-lg border bg-card p-8 text-sm text-muted-foreground">No equity curve yet.</div>;
  return (
    <div className="h-72 rounded-lg border bg-card p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${Number(value) / 1000}k`} />
          <Tooltip formatter={(value) => formatBDT(Number(value))} />
          <Area type="monotone" dataKey="totalEquity" stroke="#059669" fill="#d1fae5" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

