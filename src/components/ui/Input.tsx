import React from "react";
import { cn } from "../../lib/cn";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-md border border-border-default bg-bg-surface px-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:shadow-focus",
        props.className
      )}
    />
  );
}



