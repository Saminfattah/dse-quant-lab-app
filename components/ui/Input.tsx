import type { InputHTMLAttributes } from "react";
import { classNames } from "@/lib/format";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={classNames(
        "h-10 w-full rounded-md border bg-background px-3 text-sm outline-none ring-primary transition focus:ring-2",
        className
      )}
      {...props}
    />
  );
}

