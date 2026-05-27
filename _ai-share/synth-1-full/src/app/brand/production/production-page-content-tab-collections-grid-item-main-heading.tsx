'use client';

/** Заголовок карточки коллекции в сетке (название + подпись типа). */
export function ProductionPageContentTabCollectionsGridItemMainHeading({
  c,
}: {
  c: Record<string, unknown>;
}) {
  return (
    <>
      <h3 className="text-text-primary group-hover:text-accent-primary text-lg font-black uppercase tracking-tight transition-colors">
        {c.name as string}
      </h3>
      <p className="text-text-secondary mt-1 text-[11px] font-medium">
        {c.type as string} · {c.items as string | number} позиций
      </p>
    </>
  );
}
