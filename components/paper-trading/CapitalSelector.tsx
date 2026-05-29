"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { formatBDT } from "@/lib/format";

const quickAmounts = [100000, 500000, 1000000, 2500000, 5000000];

export function CapitalSelector() {
  const [amount, setAmount] = useState("1000000");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const numericAmount = useMemo(() => Number(amount.replaceAll(",", "")), [amount]);
  const isValid = Number.isFinite(numericAmount) && numericAmount > 0;

  async function startPaperTrading() {
    setError("");
    if (!isValid) {
      setError("Enter a numeric amount greater than 0.");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/paper-account/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startingCapitalBdt: numericAmount })
    });
    setLoading(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error ?? "Could not create paper account.");
      return;
    }
    router.push("/paper-trading/portfolio?started=1");
    router.refresh();
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader
        title="Choose Your Paper Trading Capital"
        description="Set the virtual cash balance for Paper Mode. This creates no real market orders."
      />
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {quickAmounts.map((value) => (
            <Button key={value} variant="secondary" onClick={() => setAmount(String(value))}>
              {formatBDT(value)}
            </Button>
          ))}
        </div>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Starting Paper Capital in BDT</span>
          <Input
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="1000000"
          />
        </label>
        <div className="rounded-md bg-muted p-4">
          <div className="text-sm text-muted-foreground">Selected Paper Capital</div>
          <div className="mt-1 text-2xl font-semibold">{isValid ? formatBDT(numericAmount) : "Invalid amount"}</div>
        </div>
        {error ? <p className="text-sm text-negative">{error}</p> : null}
        <Button onClick={startPaperTrading} disabled={loading || !isValid}>
          {loading ? "Starting..." : "Start Paper Trading"}
        </Button>
      </div>
    </Card>
  );
}

