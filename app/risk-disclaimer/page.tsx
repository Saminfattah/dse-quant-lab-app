import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";

const risks = [
  "This app is not financial advice and cannot guarantee profit.",
  "Paper trading is the default and intended operating mode.",
  "DSE retail direct auto-execution is not supported by this app.",
  "Model predictions can be wrong, stale, overfit, or biased.",
  "Backtests can overfit and may include lookahead, survivorship, liquidity, or data-quality risks if not audited carefully.",
  "DSE liquidity can be low, and slippage can be much worse than modeled.",
  "Floor-price behavior can distort prices, volume, and model features.",
  "T+2 settlement can lock positions and prevent quick selling of pending holdings.",
  "Human review is required before any real trade.",
  "The system assumes no short selling.",
  "Data may be delayed, incomplete, inaccurate, or unavailable."
];

export default function RiskDisclaimerPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Risk Disclaimer</h1>
        <p className="mt-1 text-sm text-muted-foreground">Read this before relying on any signal, chart, or backtest.</p>
      </div>
      <Card>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p>
            DSE Quant Lab is a research-only dashboard for paper trading, model diagnostics, and human-reviewed decision support.
            It does not place broker orders and does not provide investment advice.
          </p>
          <ul className="mt-4 space-y-2">
            {risks.map((risk) => <li key={risk}>{risk}</li>)}
          </ul>
          <p className="mt-5 font-medium">
            Any real order must be reviewed manually and entered manually through your broker platform.
          </p>
        </div>
      </Card>
    </AppShell>
  );
}

