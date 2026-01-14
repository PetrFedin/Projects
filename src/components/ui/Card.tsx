import React from "react";
import { cn } from "../../lib/cn";

export function Card(props: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("bg-bg-surface border border-border-subtle rounded-lg shadow-sm", props.className)}>
      {props.children}
    </div>
  );
}



