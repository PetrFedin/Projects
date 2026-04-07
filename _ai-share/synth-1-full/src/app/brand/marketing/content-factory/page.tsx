'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Wand2 } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import { getRelatedLinks } from '@/lib/data/integration-modules';

/** WizCommerce: WizStudio / AI-каталог — виртуальные съёмки без фотосессии. */
export default function BrandMarketingContentFactoryPage() {
  const links = getRelatedLinks('wiz-studio').map((l) => ({ label: l.label, href: l.href }));

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl animate-in fade-in duration-700">
      <SectionInfoCard
        title="WizStudio / AI-каталог"
        description="Виртуальные съёмки и контент без фотосессии. Генерация образов по flat-фото, фоны, lifestyle."
        icon={Camera}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        badges={<Badge variant="outline" className="text-[9px]">WizCommerce</Badge>}
      />
      <Card>
        <CardHeader>
          <CardTitle>AI-съёмка</CardTitle>
          <CardDescription>Загрузите flat-фото — получите lifestyle, модели, разные фоны.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Wand2 className="h-4 w-4" />
            <span>Без реальной фотосессии. Экономия времени и бюджета.</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.brand.aiTools}>AI Creator Studio</Link>
          </Button>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={links} title="Связанные модули" />
    </div>
  );
}
