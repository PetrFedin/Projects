'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getProductionLinks } from '@/lib/data/entity-links';
import { ROUTES, collectionById } from '@/lib/routes';
import {
  getActiveCollections,
  getArchivedCollections,
  type CollectionCard,
} from '@/lib/data/collections';
import { Plus, Archive, FolderOpen, ArrowRight } from 'lucide-react';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

export default function BrandCollectionsHubPage() {
  const [active, setActive] = useState<CollectionCard[]>([]);
  const [archived, setArchived] = useState<CollectionCard[]>([]);

  useEffect(() => {
    setActive(getActiveCollections());
    setArchived(getArchivedCollections());
  }, []);

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-6 pb-24">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Коллекции</CardTitle>
            <CardDescription className="mt-1 text-sm">
              Создайте карточку коллекции, опишите концепцию и ДНК, затем работайте в ней: артикулы,
              инспирейшен, презентации, каталоги и производство.
            </CardDescription>
          </div>
=======
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
        title="Коллекции"
        leadPlain="Создайте карточку коллекции, опишите концепцию и ДНК, затем работайте в ней: артикулы, инспирейшен, презентации, каталоги и производство."
        actions={
>>>>>>> recover/cabinet-wip-from-stash
          <Button asChild>
            <Link href={ROUTES.brand.collectionsNew} className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Создать коллекцию
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <FolderOpen className="h-4 w-4" />
            Активные коллекции
          </CardTitle>
          <CardDescription>
            Откройте карточку коллекции, чтобы вести концепцию, артикулы, инспирейшен и
            производство.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {active.length === 0 ? (
<<<<<<< HEAD
            <p className="py-4 text-sm text-slate-500">Нет активных коллекций. Создайте первую.</p>
=======
            <p className="text-text-secondary py-4 text-sm">
              Нет активных коллекций. Создайте первую.
            </p>
>>>>>>> recover/cabinet-wip-from-stash
          ) : (
            active.map((c) => (
              <Link
                key={c.id}
                href={collectionById(c.id)}
<<<<<<< HEAD
                className="block rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-100/80"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{c.name}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">Сезон: {c.season}</p>
                    {c.concept && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{c.concept}</p>
=======
                className="border-border-subtle bg-bg-surface2/80 hover:bg-bg-surface2/80 block rounded-xl border p-4 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-text-primary font-semibold">{c.name}</h3>
                    <p className="text-text-secondary mt-0.5 text-xs">Сезон: {c.season}</p>
                    {c.concept && (
                      <p className="text-text-secondary mt-2 line-clamp-2 text-sm">{c.concept}</p>
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge
                      variant={c.status === 'draft' ? 'secondary' : 'default'}
                      className="text-[10px]"
                    >
                      {c.status === 'draft' ? 'Черновик' : 'Активная'}
                    </Badge>
                    <ArrowRight className="text-text-muted h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      {archived.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Archive className="h-4 w-4" />
              Архив
            </CardTitle>
            <CardDescription>Закрытые коллекции для справки и отчётности.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {archived.map((c) => (
              <Link
                key={c.id}
                href={collectionById(c.id)}
<<<<<<< HEAD
                className="block rounded-xl border border-slate-100 bg-slate-50/30 p-4 transition-colors hover:bg-slate-100/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-700">{c.name}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">Сезон: {c.season}</p>
=======
                className="border-border-subtle bg-bg-surface2/30 hover:bg-bg-surface2/50 block rounded-xl border p-4 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-text-primary font-semibold">{c.name}</h3>
                    <p className="text-text-secondary mt-0.5 text-xs">Сезон: {c.season}</p>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    Архив
                  </Badge>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <RelatedModulesBlock links={getProductionLinks()} title="Производство и связанные разделы" />
    </RegistryPageShell>
  );
}
