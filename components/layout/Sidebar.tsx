import Link from "next/link";
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  CandlestickChart,
  ClipboardList,
  Gauge,
  Home,
  LineChart,
  Settings,
  ShieldAlert,
  WalletCards
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/paper-trading/setup", label: "Paper Setup", icon: WalletCards },
  { href: "/paper-trading/portfolio", label: "Portfolio", icon: BriefcaseBusiness },
  { href: "/paper-trading/trade", label: "Manual Trade", icon: CandlestickChart },
  { href: "/signals", label: "Signals", icon: Activity },
  { href: "/tickers", label: "Tickers", icon: LineChart },
  { href: "/backtesting", label: "Backtesting", icon: BarChart3 },
  { href: "/watchlist", label: "Watchlist", icon: ClipboardList },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/risk-disclaimer", label: "Risk", icon: ShieldAlert }
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r bg-card px-4 py-5 lg:block">
      <Link href="/" className="mb-6 flex items-center gap-3 px-2">
        <Home className="h-6 w-6 text-primary" />
        <div>
          <div className="font-semibold">DSE Quant Lab</div>
          <Badge tone="warning" className="mt-1">Paper Mode</Badge>
        </div>
      </Link>
      <nav className="space-y-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

