'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import { ListTodo } from 'lucide-react';

export function BrandProductionWorkshopToolsCard(props: {
  floorHref: (floorTab: ProductionFloorTabId) => string;
}) {
  const { floorHref } = props;

  return (
    <Card className="border-accent-primary/20 bg-accent-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-tight">
          <ListTodo className="h-4 w-4" aria-hidden /> Инструменты производства
        </CardTitle>
        <CardDescription className="text-xs">
          После выбора артикула («В цех · процесс») эти ссылки ведут в модули с тем же контекстом.
          Без артикула сначала откройте таблицу ниже.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
            <Link href={floorHref('plan')}>GANTT · план PO</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
            <Link href={floorHref('launch')}>Выпуск · смены</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
            <Link href={floorHref('quality')}>ОТК · мобильное</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
            <Link href={floorHref('supplies')}>VMI · бронь материалов</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
            <Link href={floorHref('nesting')}>Nesting AI · раскрой</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
