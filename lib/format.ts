export function formatBDT(amount: number | null | undefined): string {
  const value = Number(amount ?? 0);
  return `৳${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(value)}`;
}

export function formatPercent(value: number | null | undefined, digits = 1): string {
  const pct = Number(value ?? 0) * 100;
  return `${pct.toFixed(digits)}%`;
}

export function formatNumber(value: number | null | undefined): string {
  return new Intl.NumberFormat("en-US").format(Number(value ?? 0));
}

export function classNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

