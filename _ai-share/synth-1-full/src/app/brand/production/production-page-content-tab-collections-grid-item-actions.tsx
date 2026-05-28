'use client';

import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProductionPageContentTabCollectionsGridItemActions({
  c,
  p,
}: {
  c: any;
  p: Record<string, unknown>;
}) {
  const px = p as Record<string, any>;
  const { setActiveTab, setIsCreatingCollection, toggleCollectionSelection } = px;

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        className="border-border-default hover:border-accent-primary/30 hover:bg-accent-primary/10 hover:text-accent-primary h-9 rounded-lg text-[9px] font-bold"
        onClick={(e) => {
          e.stopPropagation();
          setActiveTab?.('plm');
          toggleCollectionSelection?.(c.id);
        }}
      >
        Артикулы
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-border-default hover:border-accent-primary/30 hover:bg-accent-primary/10 hover:text-accent-primary h-9 rounded-lg text-[9px] font-bold"
        onClick={(e) => {
          e.stopPropagation();
          setActiveTab?.('samples');
          toggleCollectionSelection?.(c.id);
        }}
      >
        Сэмплы
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-border-default hover:border-accent-primary/30 hover:bg-accent-primary/10 hover:text-accent-primary h-9 rounded-lg text-[9px] font-bold"
        onClick={(e) => {
          e.stopPropagation();
          setActiveTab?.('orders');
          toggleCollectionSelection?.(c.id);
        }}
      >
        Заказы
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-border-default hover:border-accent-primary/30 hover:bg-accent-primary/10 hover:text-accent-primary h-9 rounded-lg text-[9px] font-bold"
        onClick={(e) => {
          e.stopPropagation();
          setActiveTab?.('materials');
          toggleCollectionSelection?.(c.id);
        }}
      >
        Снабжение
      </Button>
      {px.setDuplicateFromCollection && (
        <Button
          variant="ghost"
          size="sm"
          className="text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 h-9 rounded-lg text-[9px] font-bold"
          onClick={(e) => {
            e.stopPropagation();
            px.setDuplicateFromCollection({ id: c.id, name: c.name || c.id });
            setIsCreatingCollection?.(true);
          }}
          title="Копировать коллекцию"
        >
          <Copy className="mr-1 h-3.5 w-3.5" /> Копировать
        </Button>
      )}
    </div>
  );
}
