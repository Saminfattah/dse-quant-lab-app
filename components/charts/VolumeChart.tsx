"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function VolumeChart({ data }: { data: Array<{ date: string; volume: number | null }> }) {
  if (!data.length) return <div className="rounded-lg border bg-card p-8 text-sm text-muted-foreground">No volume history available.</div>;
  return (
    <div className="h-56 rounded-lg border bg-card p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="volume" fill="#64748b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

