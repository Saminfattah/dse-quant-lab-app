export function calculateSettlementDate(tradeDate: Date | string, settlementDays = 2): Date {
  const date = new Date(tradeDate);
  date.setHours(0, 0, 0, 0);
  let added = 0;
  while (added < settlementDays) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 5 && day !== 6) {
      added += 1;
    }
  }
  return date;
}

export function settlementState(settlementDate: Date | string, asOf = new Date()): "Settled" | "Pending T+1" | "Pending T+2" {
  const settlement = new Date(settlementDate);
  settlement.setHours(0, 0, 0, 0);
  const today = new Date(asOf);
  today.setHours(0, 0, 0, 0);
  if (today >= settlement) return "Settled";
  const diffDays = Math.ceil((settlement.getTime() - today.getTime()) / 86400000);
  return diffDays <= 1 ? "Pending T+1" : "Pending T+2";
}

