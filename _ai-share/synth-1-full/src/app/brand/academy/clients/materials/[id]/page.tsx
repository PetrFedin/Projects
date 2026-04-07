'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WidgetCard } from '@/components/ui/widget-card';
import { AcademySegmentSwitcher } from '@/components/brand/AcademySegmentSwitcher';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getAcademyLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getClientMaterialById } from '@/lib/academy/brand-academy-data';

const TYPE_LABELS: Record<string, string> = {
  care: 'Уход за изделиями',
  styling: 'Стилинг / сочетания',
  intro: 'О коллекции',
  lookbook: 'Lookbook',
};

export default function ClientMaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const material = getClientMaterialById(id);

  if (!material) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl pb-24">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <p className="text-slate-500">Материал не найден</p>
        </div>
        <Button variant="outline" asChild>
          <Link href={ROUTES.brand.academy}>Вернуться в академию</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-2xl pb-24">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={ROUTES.brand.academy}>
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tight">{material.title}</h1>
            <p className="text-sm text-slate-500">{TYPE_LABELS[material.type] ?? material.type}</p>
          </div>
        </div>
        <AcademySegmentSwitcher active="brand" />
      </div>

      <WidgetCard
        title="Для клиентов"
        description="Материалы для конечных покупателей."
      >
      <Card className="rounded-xl border border-slate-100">
        <CardContent className="pt-6 space-y-4">
          <div className="flex gap-2">
            <Badge variant="outline">{TYPE_LABELS[material.type] ?? material.type}</Badge>
            {material.collectionId && (
              <Badge variant="secondary" className="text-[10px]">{material.collectionId.toUpperCase()}</Badge>
            )}
          </div>
          <p className="text-slate-700 leading-relaxed">{material.description}</p>
          {material.url && (
            <Button variant="outline" size="sm" asChild>
              <a href={material.url} target="_blank" rel="noopener noreferrer" className="gap-2">
                <ExternalLink className="h-3.5 w-3.5" /> Открыть материал
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
      </WidgetCard>

      <Button variant="outline" asChild>
        <Link href={ROUTES.brand.academyClients}>← К списку материалов</Link>
      </Button>

      <RelatedModulesBlock links={getAcademyLinks()} />
    </div>
  );
}
