"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function RemoveWatchlistButton({ ticker }: { ticker: string }) {
  const router = useRouter();
  async function remove() {
    await fetch("/api/watchlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker })
    });
    router.refresh();
  }
  return <Button variant="ghost" className="h-8" onClick={remove}>Remove</Button>;
}

