import React from "react";

export function DataTableEmpty({
  title = "No results",
  hint = "Try adjusting filters or search."
}: {
  title?: string;
  hint?: string;
}) {
  return (
    <div className="py-10 text-center">
      <div className="text-sm font-medium text-text-primary">{title}</div>
      <div className="mt-1 text-sm text-text-secondary">{hint}</div>
    </div>
  );
}



