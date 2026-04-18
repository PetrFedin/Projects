'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WidgetCard } from '@/components/ui/widget-card';
import { AcademySegmentSwitcher } from '@/components/brand/AcademySegmentSwitcher';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getAcademyLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';
import { getCollectionTrainingById } from '@/lib/academy/brand-academy-data';
import { COLLECTION_TRAINING_TYPE_LABELS } from '@/lib/academy/brand-academy-data';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

export default function CollectionTrainingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const training = getCollectionTrainingById(id);

  if (!training) {
    return (
<<<<<<< HEAD
      <div className="container mx-auto max-w-2xl px-4 py-6 pb-24">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <p className="text-slate-500">Обучение не найдено</p>
        </div>
=======
      <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
        <RegistryPageHeader
          title="Обучение не найдено"
          leadPlain="Записи с таким идентификатором нет в демо-данных."
          eyebrow={
            <Button
              variant="ghost"
              size="icon"
              className="-ml-2 shrink-0"
              onClick={() => router.back()}
              aria-label="Назад"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          }
        />
>>>>>>> recover/cabinet-wip-from-stash
        <Button variant="outline" asChild>
          <Link href={ROUTES.brand.academy}>Вернуться в академию</Link>
        </Button>
      </RegistryPageShell>
    );
  }

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-2xl space-y-6 px-4 py-6 pb-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href={ROUTES.brand.academy}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tight">{training.title}</h1>
            <p className="text-sm text-slate-500">
              {training.collectionName} · {training.season}
            </p>
          </div>
        </div>
        <AcademySegmentSwitcher active="brand" />
      </div>
=======
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
        title={training.title}
        leadPlain={`${training.collectionName} · ${training.season}`}
        eyebrow={
          <Button variant="ghost" size="icon" className="-ml-2 shrink-0" asChild>
            <Link href={ROUTES.brand.academy} aria-label="Назад в академию">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        }
        actions={<AcademySegmentSwitcher active="brand" />}
      />
>>>>>>> recover/cabinet-wip-from-stash

      <WidgetCard
        title="Обучение для магазинов"
        description="Материалы для партнёров, купивших коллекцию."
      >
<<<<<<< HEAD
        <Card className="rounded-xl border border-slate-100">
=======
        <Card className="border-border-subtle rounded-xl border">
>>>>>>> recover/cabinet-wip-from-stash
          <CardHeader className="pb-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {COLLECTION_TRAINING_TYPE_LABELS[training.type] ?? training.type}
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                <Clock className="mr-1 inline h-2.5 w-2.5" /> {training.duration}
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                <BookOpen className="mr-1 inline h-2.5 w-2.5" /> {training.modules} модулей
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
<<<<<<< HEAD
            <p className="leading-relaxed text-slate-700">{training.description}</p>
            {training.forStores && (
              <p className="text-[11px] text-slate-500">
=======
            <p className="text-text-primary leading-relaxed">{training.description}</p>
            {training.forStores && (
              <p className="text-text-secondary text-[11px]">
>>>>>>> recover/cabinet-wip-from-stash
                Доступно магазинам, купившим коллекцию {training.collectionName}
              </p>
            )}
          </CardContent>
        </Card>
      </WidgetCard>

      <Button variant="outline" asChild>
        <Link href={ROUTES.brand.academyStores}>← К списку тренингов</Link>
      </Button>

      <RelatedModulesBlock links={getAcademyLinks()} />
    </RegistryPageShell>
  );
}
