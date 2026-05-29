"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export function ResetPortfolio({ accountId }: { accountId?: number }) {
  const [capital, setCapital] = useState("1000000");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function reset() {
    if (!accountId) {
      setMessage("No paper account exists yet.");
      return;
    }
    if (confirmation !== "RESET") {
      setMessage("Type RESET to confirm portfolio reset.");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/paper-account/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId, startingCapitalBdt: Number(capital), confirmation })
    });
    setLoading(false);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(payload.error ?? "Reset failed.");
      return;
    }
    setMessage("Paper portfolio reset.");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader
        title="Reset Paper Portfolio"
        description="Resetting deletes virtual holdings, paper trade history, and equity curve records for this account."
      />
      <div className="grid gap-3 md:grid-cols-3">
        <Input value={capital} onChange={(event) => setCapital(event.target.value)} placeholder="Starting capital" />
        <Input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Type RESET" />
        <Button variant="danger" onClick={reset} disabled={loading}>{loading ? "Resetting..." : "Reset Paper Portfolio"}</Button>
      </div>
      {message ? <p className="mt-3 text-sm text-muted-foreground">{message}</p> : null}
    </Card>
  );
}

