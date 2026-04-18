'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scan, ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getDigitalTwinTestingLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import type { SampleTestingCampaign } from '@/lib/digital-twin-testing';

const MOCK_CAMPAIGN: SampleTestingCampaign = {
  id: 'dt1',
  title: 'SS26 Pre — виртуальная примерка',
  skuIds: ['SKU-101', 'SKU-102', 'SKU-103'],
  segments: [
    { id: 'seg1', name: 'Женщины 25–34', avatarCount: 120 },
    { id: 'seg2', name: 'Мужчины 40+', avatarCount: 80 },
  ],
  status: 'running',
  createdAt: '2026-03-01T10:00:00Z',
  feedbackSummary: [
    { skuId: 'SKU-101', likePct: 72, dislikePct: 8 },
    { skuId: 'SKU-102', likePct: 45, dislikePct: 22 },
    { skuId: 'SKU-103', likePct: 88, dislikePct: 4 },
  ],
};

export default function DigitalTwinTestingPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
      <SectionInfoCard
        title="Digital twin sample testing"
        description="Виртуальная примерка новых моделей на аватарах целевой аудитории для фидбека до производства. Связь с PIM, дизайном и Range Planner. При API — запуск кампаний, сбор лайков/дизлайков по сегментам."
        icon={Scan}
        iconBg="bg-violet-100"
        iconColor="text-violet-600"
        badges={
          <>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/products">PIM</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.footwear360}>360° обувь</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/range-planner">Range Planner</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/planning">Планирование</Link>
            </Button>
          </>
        }
      />
      <div className="flex items-center gap-3">
        <Link href="/brand/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold uppercase">Digital twin sample testing</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" /> Кампания: {MOCK_CAMPAIGN.title}
          </CardTitle>
          <CardDescription>
            Сегменты аватаров и сводка фидбека по моделям. До запуска в производство — корректировка
            ассортимента.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 text-[10px] uppercase text-slate-500">Сегменты</p>
            <ul className="flex flex-wrap gap-2">
              {MOCK_CAMPAIGN.segments.map((s) => (
                <Badge key={s.id} variant="outline" className="text-[10px]">
                  {s.name} · {s.avatarCount} аватаров
                </Badge>
              ))}
            </ul>
          </div>
          {MOCK_CAMPAIGN.feedbackSummary && (
            <div>
              <p className="mb-2 text-[10px] uppercase text-slate-500">Фидбек по моделям</p>
              <ul className="space-y-2">
                {MOCK_CAMPAIGN.feedbackSummary.map((f) => (
                  <li
                    key={f.skuId}
                    className="flex items-center justify-between rounded-lg bg-slate-50 p-2"
                  >
                    <span className="font-mono text-sm">{f.skuId}</span>
                    <span className="flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 text-emerald-600">
                        <ThumbsUp className="h-3.5 w-3.5" /> {f.likePct}%
                      </span>
                      <span className="flex items-center gap-1 text-red-600">
                        <ThumbsDown className="h-3.5 w-3.5" /> {f.dislikePct}%
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-xs text-slate-400">
            API: DIGITAL_TWIN_TESTING_API — создание кампании, отправка на примерку, сбор фидбека.
          </p>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={getDigitalTwinTestingLinks()} />
    </div>
  );
}
