import React from "react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "ghost";

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    "h-10 px-4 rounded-md text-sm font-medium transition duration-normal ease-standard focus:outline-none focus:shadow-focus disabled:opacity-50 disabled:pointer-events-none";
  const styles: Record<Variant, string> = {
    primary: "bg-accent-primary text-text-inverse hover:bg-accent-hover",
    secondary: "bg-bg-surface text-text-primary border border-border-default hover:bg-bg-surface2",
    ghost: "bg-transparent text-text-primary hover:bg-bg-surface2"
  };
  return <button className={cn(base, styles[variant], className)} {...props} />;
}



