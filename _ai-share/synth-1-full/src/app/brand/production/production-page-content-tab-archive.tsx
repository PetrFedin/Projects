'use client';

import { FolderArchive, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { ProductionArchiveHub } from '@/components/brand/production-archive-hub';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

export function ProductionPageContentTabArchive({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const { archiveSearchQuery, setArchiveSearchQuery, handleAction, prodRole } = px;

  return (
    <TabsContent value="archive" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Архив" barColor="bg-text-primary" />
      <SectionInfoCard
        title="Архив"
        description="Завершённые коллекции, PO, документы. Поиск и фильтры. Восстановление из архива для редактирования или повторного использования."
        icon={FolderArchive}
        iconBg="bg-bg-surface2"
        iconColor="text-text-secondary"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Поиск
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Восстановление
            </Badge>
          </>
        }
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Поиск по архиву (коллекции, артикулы, документы)..."
            value={archiveSearchQuery || ''}
            onChange={(e) => setArchiveSearchQuery?.(e.target.value)}
            className="h-10 rounded-xl pl-9 text-[10px]"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-10 text-[9px]"
          onClick={() =>
            handleAction?.('Восстановление', 'Выберите элемент в архиве для восстановления')
          }
        >
          Восстановить из архива
        </Button>
      </div>
      <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
        <div className="from-text-primary/80 to-text-primary h-1 w-full bg-gradient-to-r" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-bg-surface2 text-text-secondary flex h-10 w-10 items-center justify-center rounded-xl">
              <FolderArchive className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-black uppercase">Архив производства</CardTitle>
              <CardDescription className="text-[10px]">
                Документы, PO, сэмплы завершённых коллекций
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ProductionArchiveHub
            sku={{
              id: 'archive',
              name: 'Архив производственных документов',
              sku: 'ARCHIVE',
              factory: '—',
              brand: 'Syntha',
            }}
            userRole={
              (prodRole === 'manufacturer'
                ? 'manufacturer'
                : prodRole === 'admin'
                  ? 'admin'
                  : 'brand') as 'admin' | 'brand' | 'manufacturer'
            }
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
