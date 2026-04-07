'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, FileText, Image } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import { getRelatedLinks } from '@/lib/data/integration-modules';

/** Colect: AI Creator Studio — генерация описаний, lookbook, контент-планы. */
export default function BrandAiToolsPage() {
  const links = getRelatedLinks('ai-creator-studio').map((l) => ({ label: l.label, href: l.href }));

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl animate-in fade-in duration-700">
      <SectionInfoCard
        title="AI Creator Studio"
        description="Генерация описаний, lookbook, контент-планы. Описания SKU, сценарии съёмок, планирование контента."
        icon={Sparkles}
        iconBg="bg-violet-100"
        iconColor="text-violet-600"
        badges={<Badge variant="outline" className="text-[9px]">Colect</Badge>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Описания</CardTitle>
            <CardDescription>Генерация описаний товаров по фото и атрибутам.</CardDescription>
          </CardHeader>
          <CardContent><Button variant="outline" size="sm">Создать</Button></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Image className="h-4 w-4" /> Lookbook / контент-планы</CardTitle>
            <CardDescription>Сценарии съёмок, планирование контента по сезонам.</CardDescription>
          </CardHeader>
          <CardContent><Button variant="outline" size="sm">Создать</Button></CardContent>
        </Card>
        <Card className="border-violet-200 bg-violet-50/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-violet-600" /> Копирайт под канал</CardTitle>
            <CardDescription>Один SKU → тексты для Wildberries, Ozon, Instagram (тон, ограничения длины, ключевые слова).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="default" size="sm" className="w-full sm:w-auto">Сгенерировать пакет</Button>
            <p className="text-[10px] text-muted-foreground">Демо: подключение к LLM и шаблонам каналов.</p>
          </CardContent>
        </Card>
      </div>
      <RelatedModulesBlock links={links} title="Связанные модули" />
    </div>
  );
}
