'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { Glasses } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const GlassesVirtualTryOn = dynamic(
  () =>
    import('@/components/virtual-tryon/glasses-virtual-try-on').then((m) => m.GlassesVirtualTryOn),
  { ssr: false, loading: () => <p className="text-sm text-muted-foreground py-8">Загрузка модуля примерки…</p> }
);

/**
 * Опция для брендов очков: примерка по лицу (MediaPipe Face Landmarker + слой оправы).
 * Query: ?frame=https://…/oprawa.png — подставить оправу SKU.
 */
export default function BrandGlassesVirtualTryOnPage() {
  const [frameUrl, setFrameUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    setFrameUrl(new URLSearchParams(window.location.search).get('frame')?.trim() || undefined);
  }, []);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 space-y-6 animate-in fade-in duration-500">
      <SectionInfoCard
        title="Виртуальная примерка очков"
        description="Камера или фото лица: оправа масштабируется по межзрачковому расстоянию и наклону головы. Расчёт в браузере; лица на ваш бэкенд не отправляются."
        icon={Glasses}
        iconBg="bg-sky-100"
        iconColor="text-sky-700"
        badges={
          <Badge variant="outline" className="text-[9px]">
            Опция eyewear
          </Badge>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Примерка</CardTitle>
          <CardDescription>
            Укажите URL PNG/WebP оправы с прозрачным фоном или используйте демо. Для встраивания в витрину передайте{' '}
            <code className="text-xs bg-muted px-1 rounded">?frame=</code> или prop <code className="text-xs bg-muted px-1 rounded">initialGlassesUrl</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GlassesVirtualTryOn initialGlassesUrl={frameUrl} />
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground">
        Примерка одежды (полноценный try-on) по-прежнему через{' '}
        <code className="text-xs bg-muted px-1 rounded">POST /ai/virtual-tryon</code> — отдельный сценарий с opentryon/GPU.
      </p>
      <p className="text-sm">
        <Link href={ROUTES.brand.marketingSamples} className="text-primary underline-offset-4 hover:underline">
          ← Образцы и маркетинг
        </Link>
      </p>
    </div>
  );
}
