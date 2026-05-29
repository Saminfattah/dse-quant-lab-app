import { Badge } from "@/components/ui/Badge";

export function SignalReasonCodes({ value }: { value?: string | null }) {
  const codes = value?.split(",").map((code) => code.trim()).filter(Boolean) ?? [];
  if (codes.length === 0) return <span className="text-sm text-muted-foreground">No reason codes</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {codes.map((code) => (
        <Badge key={code}>{code.replaceAll("_", " ")}</Badge>
      ))}
    </div>
  );
}

