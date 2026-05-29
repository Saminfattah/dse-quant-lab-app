"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export function BacktestRunForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/backtests/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    setLoading(false);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(payload.error ?? "Could not queue backtest.");
      return;
    }
    setMessage(`Backtest job queued: #${payload.run.id}. The Python worker should process it.`);
  }

  return (
    <Card>
      <CardHeader title="Run Backtest" description="Creates a backtest job for the Python worker. Heavy simulation does not run inside Vercel." />
      <form action={submit} className="grid gap-4 md:grid-cols-3">
        <Input name="runName" defaultValue="UI Backtest" />
        <Input name="startDate" type="date" defaultValue="2025-01-01" />
        <Input name="endDate" type="date" defaultValue="2026-04-21" />
        <Input name="startingCapitalBdt" defaultValue="1000000" />
        <Input name="maxAllocationPerStock" defaultValue="0.05" />
        <Input name="maxOpenPositions" defaultValue="10" />
        <Input name="buyThreshold" defaultValue="0.70" />
        <Input name="slippageRate" defaultValue="0.002" />
        <Input name="transactionCostRate" defaultValue="0" />
        <div className="md:col-span-3">
          <Button type="submit" disabled={loading}>{loading ? "Queueing..." : "Run Backtest"}</Button>
        </div>
      </form>
      {message ? <p className="mt-4 text-sm text-muted-foreground">{message}</p> : null}
    </Card>
  );
}

