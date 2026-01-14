import React from "react";
import { cn } from "../../lib/cn";

export function Badge({
  tone = "neutral",
  children
}: {
  tone?: "success" | "warning" | "error" | "info" | "neutral";
  children: React.ReactNode;
}) {
  const map: Record<string, string> = {
    success: "text-state-success bg-[rgba(22,163,74,0.10)]",
    warning: "text-state-warning bg-[rgba(245,158,11,0.12)]",
    error: "text-state-error bg-[rgba(220,38,38,0.10)]",
    info: "text-state-info bg-[rgba(37,99,235,0.10)]",
    neutral: "text-text-secondary bg-bg-surface2"
  };

  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium", map[tone])}>
      {children}
    </span>
  );
}



