"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { formatBDT } from "@/lib/format";
import { calculateSettlementDate } from "@/lib/settlement";

export function TradeForm({ tickers, accountId }: { tickers: string[]; accountId?: number }) {
  const searchParams = useSearchParams();
  const [ticker, setTicker] = useState(searchParams.get("ticker") ?? tickers[0] ?? "");
  const [action, setAction] = useState(searchParams.get("action") ?? "BUY");
  const [quantity, setQuantity] = useState("100");
  const [price, setPrice] = useState("10");
  const [tradeDate, setTradeDate] = useState(new Date().toISOString().slice(0, 10));
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const quantityNumber = Number(quantity);
  const priceNumber = Number(price);
  const gross = Number.isFinite(quantityNumber * priceNumber) ? quantityNumber * priceNumber : 0;
  const slippage = gross * 0.002;
  const transactionCost = 0;
  const settlement = useMemo(() => calculateSettlementDate(tradeDate), [tradeDate]);

  async function submitTrade() {
    setMessage("");
    if (!accountId) {
      setMessage("Create a paper account first.");
      return;
    }
    if (!ticker || quantityNumber <= 0 || priceNumber <= 0) {
      setMessage("Ticker, quantity, and price are required.");
      return;
    }
    setLoading(true);
    const endpoint = action === "BUY" ? "/api/paper-trades/buy" : "/api/paper-trades/sell";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId, ticker, quantity: quantityNumber, price: priceNumber, tradeDate })
    });
    setLoading(false);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(payload.error ?? "Paper trade failed.");
      return;
    }
    setMessage(`${action} paper trade saved.`);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader title="Manual Paper Trade" description="Virtual trading only. Sells are blocked for pending T+2 positions." />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Ticker</span>
          <select className="h-10 rounded-md border bg-background px-3 text-sm" value={ticker} onChange={(event) => setTicker(event.target.value)}>
            {tickers.map((code) => <option key={code} value={code}>{code}</option>)}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Action</span>
          <select className="h-10 rounded-md border bg-background px-3 text-sm" value={action} onChange={(event) => setAction(event.target.value)}>
            <option>BUY</option>
            <option>SELL</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Quantity</span>
          <Input value={quantity} onChange={(event) => setQuantity(event.target.value)} inputMode="numeric" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Price</span>
          <Input value={price} onChange={(event) => setPrice(event.target.value)} inputMode="decimal" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Trade Date</span>
          <Input type="date" value={tradeDate} onChange={(event) => setTradeDate(event.target.value)} />
        </label>
        <div className="rounded-md bg-muted p-4">
          <div className="text-sm text-muted-foreground">Estimated Trade Value</div>
          <div className="mt-1 text-xl font-semibold">{formatBDT(gross)}</div>
          <div className="mt-2 text-xs text-muted-foreground">Slippage: {formatBDT(slippage)} | Cost: {formatBDT(transactionCost)}</div>
          <div className="mt-1 text-xs text-muted-foreground">Settlement: {settlement.toLocaleDateString()}</div>
        </div>
      </div>
      {message ? <p className="mt-4 text-sm text-muted-foreground">{message}</p> : null}
      <Button className="mt-5" onClick={submitTrade} disabled={loading}>
        {loading ? "Submitting..." : "Submit Paper Trade"}
      </Button>
    </Card>
  );
}

