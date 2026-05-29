import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { classNames } from "@/lib/format";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  children: ReactNode;
};

const variants = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "border bg-card text-foreground hover:bg-muted",
  danger: "bg-negative text-white hover:opacity-90",
  ghost: "text-foreground hover:bg-muted"
};

export function Button({ href, variant = "primary", className, children, ...props }: ButtonProps) {
  const classes = classNames(
    "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    className
  );
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

