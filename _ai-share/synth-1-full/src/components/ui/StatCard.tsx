import React from "react";
import { Card } from "./card";
import { cn } from "../../lib/cn";

export function StatCard({
  label,
  value,
  hint,
  trend
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: { value: string; tone: "up" | "down" | "neutral" };
}) {
  const trendClass =
    trend?.tone === "up"
      ? "text-state-success bg-[rgba(22,163,74,0.10)]"
      : trend?.tone === "down"
      ? "text-state-error bg-[rgba(220,38,38,0.10)]"
      : "text-text-secondary bg-bg-surface2";

  return (
    <Card className="p-3">
      <div className="text-xs text-text-muted">{label}</div>
      <div className="mt-2 text-sm font-semibold text-text-primary tabular-nums">{value}</div>
      <div className="mt-3 flex items-center gap-2">
        {trend && <span className={cn("text-xs px-2 py-1 rounded-full", trendClass)}>{trend.value}</span>}
        {hint && <span className="text-xs text-text-secondary">{hint}</span>}
      </div>
    </Card>
  );
}

