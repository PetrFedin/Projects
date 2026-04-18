import React from 'react';

export function DataTableEmpty({
  title = 'No results',
  hint = 'Try adjusting filters or search.',
}: {
  title?: string;
  hint?: string;
}) {
  return (
    <div className="py-10 text-center">
      <div className="text-text-primary text-sm font-medium">{title}</div>
      <div className="text-text-secondary mt-1 text-sm">{hint}</div>
    </div>
  );
}
