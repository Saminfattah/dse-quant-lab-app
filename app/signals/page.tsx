import { AppShell } from "@/components/layout/AppShell";
import { SignalTable } from "@/components/dashboard/SignalTable";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SignalsPage() {
  const rows = await prisma.signal.findMany({
    orderBy: [{ signalDate: "desc" }, { probabilityUp: "desc" }],
    take: 200
  }).catch(() => []);
  const fallbackPredictions = rows.length
    ? []
    : await prisma.prediction.findMany({ orderBy: [{ predictionTime: "desc" }, { probabilityUp: "desc" }], take: 200 }).catch(() => []);
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Model Signals</h1>
        <p className="mt-1 text-sm text-muted-foreground">Decision-support labels only. Use BUY WATCH instead of aggressive buy instructions.</p>
      </div>
      <SignalTable rows={rows.length ? rows : fallbackPredictions} />
    </AppShell>
  );
}
