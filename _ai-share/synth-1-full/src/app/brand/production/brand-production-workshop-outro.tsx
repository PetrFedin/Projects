'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getProductionLinks } from '@/lib/data/entity-links';

export function BrandProductionWorkshopOutro(props: { opsFloorHref: string }) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="text-xs" asChild>
          <Link href={props.opsFloorHref}>Операции: PO, BOM, QC, аудит (вкладка «Операции»)</Link>
        </Button>
      </div>
      <RelatedModulesBlock
        links={getProductionLinks()}
        title="Производство: QC, видео-этапы, субподрядчики, готовый товар"
      />
    </>
  );
}
