"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function WatchlistForm() {
  const [ticker, setTicker] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function add() {
    setMessage("");
    const response = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker, notes })
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setMessage(payload.error ?? "Could not add ticker.");
      return;
    }
    setTicker("");
    setNotes("");
    router.refresh();
  }

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
      <Input value={ticker} onChange={(event) => setTicker(event.target.value.toUpperCase())} placeholder="Ticker" />
      <Input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Notes" />
      <Button onClick={add}>Add Ticker</Button>
      {message ? <p className="text-sm text-negative md:col-span-3">{message}</p> : null}
    </div>
  );
}

