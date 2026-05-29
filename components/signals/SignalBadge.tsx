import { Badge } from "@/components/ui/Badge";
import { signalTone } from "@/lib/risk";

export function SignalBadge({ signal }: { signal: string }) {
  return <Badge tone={signalTone(signal)}>{signal}</Badge>;
}

