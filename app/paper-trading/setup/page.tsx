import { AppShell } from "@/components/layout/AppShell";
import { CapitalSelector } from "@/components/paper-trading/CapitalSelector";

export default function PaperTradingSetupPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Paper Trading Setup</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose virtual BDT capital and start a paper-only portfolio.</p>
      </div>
      <CapitalSelector />
    </AppShell>
  );
}

