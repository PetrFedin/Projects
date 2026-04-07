'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getCollectionLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { getCollectionById, updateCollection, type CollectionCard } from '@/lib/data/collections';
import {
  ArrowLeft,
  Package,
  Image,
  Presentation,
  Factory,
  FileText,
} from 'lucide-react';

const productionHref = (collectionId: string) =>
  `${ROUTES.brand.production}?collectionId=${encodeURIComponent(collectionId)}`;
const productsHref = (collectionId: string) =>
  `${ROUTES.brand.products}?collectionId=${encodeURIComponent(collectionId)}`;

export default function BrandCollectionCardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [collection, setCollection] = useState<CollectionCard | null>(null);
  const [concept, setConcept] = useState('');
  const [dna, setDna] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const c = getCollectionById(id);
    if (!c) {
      setCollection(null);
      return;
    }
    setCollection(c);
    setConcept(c.concept);
    setDna(c.dna);
    setDescription(c.description);
  }, [id]);

  const handleSaveDescription = () => {
    if (!id || !collection) return;
    setSaving(true);
    updateCollection(id, { concept, dna, description });
    setCollection(getCollectionById(id) ?? null);
    setSaving(false);
  };

  if (id === undefined) return null;
  if (collection === null) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <p className="text-slate-600">Коллекция не найдена.</p>
        <Button variant="link" asChild className="mt-2">
          <Link href={ROUTES.brand.collections}>К списку коллекций</Link>
        </Button>
      </div>
    );
  }

  const links = getCollectionLinks(collection.id);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.brand.collections} className="inline-flex items-center gap-1 text-sm">
            <ArrowLeft className="h-4 w-4" />
            К списку коллекций
          </Link>
        </Button>
        <Badge variant={collection.status === 'archive' ? 'secondary' : 'default'}>
          {collection.status === 'draft' ? 'Черновик' : collection.status === 'archive' ? 'Архив' : 'Активная'}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{collection.name}</CardTitle>
          <CardDescription>Сезон: {collection.season}</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Концепция, ДНК и описание
          </CardTitle>
          <CardDescription>Опишите идею коллекции и ДНК. После сохранения продолжайте в разделах ниже.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Концепция</Label>
            <Textarea
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Идея коллекции, настроение, ключевые инсайты"
              rows={3}
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label>ДНК коллекции</Label>
            <Textarea
              value={dna}
              onChange={(e) => setDna(e.target.value)}
              placeholder="Стиль, палитра, материалы, целевая аудитория"
              rows={2}
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label>Описание</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание"
              rows={2}
              className="resize-none"
            />
          </div>
          <Button onClick={handleSaveDescription} disabled={saving} size="sm">
            {saving ? 'Сохранение…' : 'Сохранить'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Работа в коллекции</CardTitle>
          <CardDescription>
            Создавайте артикулы, добавляйте инспирейшен, готовьте презентации и каталоги, ведите производство по этой коллекции.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Link
            href={productsHref(collection.id)}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-slate-100/80 p-4 transition-colors"
          >
            <div className="rounded-lg bg-indigo-100 p-2">
              <Package className="h-5 w-5 text-indigo-700" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Артикулы (PIM)</p>
              <p className="text-xs text-slate-500">Концепция, SKU, матрица размеров</p>
            </div>
          </Link>
          <Link
            href={`${ROUTES.brand.media}?collectionId=${encodeURIComponent(collection.id)}`}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-slate-100/80 p-4 transition-colors"
          >
            <div className="rounded-lg bg-amber-100 p-2">
              <Image className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Инспирейшен</p>
              <p className="text-xs text-slate-500">Референсы, мудборды, визуал</p>
            </div>
          </Link>
          <Link
            href={`${ROUTES.brand.contentHub}?collectionId=${encodeURIComponent(collection.id)}`}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-slate-100/80 p-4 transition-colors"
          >
            <div className="rounded-lg bg-emerald-100 p-2">
              <Presentation className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Презентации и каталоги</p>
              <p className="text-xs text-slate-500">Лукбуки, каталоги товаров</p>
            </div>
          </Link>
          <Link
            href={productionHref(collection.id)}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-slate-100/80 p-4 transition-colors"
          >
            <div className="rounded-lg bg-slate-200 p-2">
              <Factory className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Производство</p>
              <p className="text-xs text-slate-500">Схема коллекции, PO, техпаки, QC</p>
            </div>
          </Link>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={links} title="Связанные разделы по коллекции" />
    </div>
  );
}
