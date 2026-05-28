'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProductionPageContentTabCollectionsToolbarCreate({
  onCreateClick,
}: {
  onCreateClick?: () => void;
}) {
  return (
    <div>
      <Button
        size="lg"
        className="bg-text-primary h-12 gap-2 rounded-xl px-6 text-[11px] font-black text-white hover:bg-black"
        onClick={() => onCreateClick?.()}
      >
        <Plus className="h-5 w-5" /> Создать новую коллекцию
      </Button>
      <p className="text-text-secondary mt-2 text-[10px]">
        Создайте папку коллекции, заполните данные — затем добавляйте артикулы, импортируйте из
        архива, создавайте сэмплы и заказы
      </p>
    </div>
  );
}
