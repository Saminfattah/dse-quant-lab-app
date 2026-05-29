import { ArrowRight, BarChart3, ShieldCheck, WalletCards } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function LandingPage() {
  const features: Array<[string, string, LucideIcon]> = [
    ["Signals", "Review BUY WATCH, HOLD, AVOID, and SELL REVIEW alerts.", BarChart3],
    ["Paper Trading", "Choose BDT capital and track a virtual T+2 portfolio.", WalletCards],
    ["Risk Controls", "No broker execution, no short selling, and clear warnings.", ShieldCheck]
  ];
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12">
        <Badge tone="warning" className="mb-6 w-fit">Paper Mode | Research Only</Badge>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-normal md:text-7xl">DSE Quant Lab</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          A research-only DSE signal and paper-trading dashboard for model review, virtual portfolios, backtests, and human decision support.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/dashboard">Open Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Button>
          <Button href="/paper-trading/setup" variant="secondary">Start Paper Trading</Button>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map(([title, text, Icon]) => (
            <div key={title} className="rounded-lg border bg-card p-5">
              <Icon className="mb-4 h-6 w-6 text-primary" />
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted-foreground">
          Not financial advice. The app does not execute trades. Any real order must be manually reviewed and entered through your broker platform.
        </p>
      </section>
    </main>
  );
}
