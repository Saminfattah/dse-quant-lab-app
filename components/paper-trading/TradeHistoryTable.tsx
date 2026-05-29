import { formatBDT } from "@/lib/format";

type Trade = {
  id: number;
  tradeDate: Date;
  ticker: string;
  action: string;
  quantity: number;
  price: number;
  grossValue: number;
  transactionCost: number;
  slippage: number;
  settlementDate: Date;
  status: string;
  realizedPnl: number;
};

export function TradeHistoryTable({ rows }: { rows: Trade[] }) {
  if (!rows.length) return <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">No paper trade history yet.</div>;
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full min-w-[960px] text-sm">
        <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Ticker</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Quantity</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Trade Value</th>
            <th className="px-4 py-3">Fees/Slippage</th>
            <th className="px-4 py-3">Settlement</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Realized P&L</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((trade) => (
            <tr key={trade.id} className="border-t">
              <td className="px-4 py-3">{new Date(trade.tradeDate).toLocaleDateString()}</td>
              <td className="px-4 py-3 font-medium">{trade.ticker}</td>
              <td className="px-4 py-3">{trade.action}</td>
              <td className="px-4 py-3">{trade.quantity}</td>
              <td className="px-4 py-3">{formatBDT(trade.price)}</td>
              <td className="px-4 py-3">{formatBDT(trade.grossValue)}</td>
              <td className="px-4 py-3">{formatBDT(trade.transactionCost + trade.slippage)}</td>
              <td className="px-4 py-3">{new Date(trade.settlementDate).toLocaleDateString()}</td>
              <td className="px-4 py-3">{trade.status}</td>
              <td className={trade.realizedPnl >= 0 ? "px-4 py-3 text-positive" : "px-4 py-3 text-negative"}>{formatBDT(trade.realizedPnl)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

