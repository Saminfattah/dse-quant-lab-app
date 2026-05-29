"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-8">
      <div>
        <div className="text-sm font-semibold">DSE Quant Lab</div>
        <div className="text-xs text-muted-foreground">Research-only DSE signal and paper-trading dashboard</div>
      </div>
      <div className="flex items-center gap-3">
        <Badge tone="warning">Paper Mode</Badge>
        <Button
          variant="secondary"
          className="h-9 w-9 px-0"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="hidden h-4 w-4 dark:block" />
          <Moon className="h-4 w-4 dark:hidden" />
        </Button>
      </div>
    </header>
  );
}

