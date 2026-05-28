'use client';

import * as React from 'react';

// A simple masonry-like layout component.
// NOTE: This is not a true masonry layout, but it's good enough for this demo.
// For a true masonry layout, we'd need to use a library like `react-masonry-css`
// or implement a more complex layout algorithm.

type MasonryProps<T> = {
  items: T[];
  render: React.ComponentType<{ look: T; className?: string }>;
  columnWidth?: number;
  columnGutter?: number;
  className?: string;
};

export function Masonry<T extends { id: string }>({
  items,
  render: Component,
  columnWidth = 300,
  columnGutter = 24,
  className,
}: MasonryProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [numColumns, setNumColumns] = React.useState(3);

  React.useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const calculatedNumColumns = Math.max(
          1,
          Math.floor((containerWidth + columnGutter) / (columnWidth + columnGutter))
        );
        setNumColumns(calculatedNumColumns);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columnWidth, columnGutter]);

  const columns: T[][] = Array.from({ length: numColumns }, () => []);
  items.forEach((item, index) => {
    columns[index % numColumns].push(item);
  });

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
        gap: `${columnGutter}px`,
        alignItems: 'start',
      }}
    >
      {columns.map((col, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-3">
          {col.map((item) => (
            <Component key={item.id} look={item as any} />
          ))}
        </div>
      ))}
    </div>
  );
}
