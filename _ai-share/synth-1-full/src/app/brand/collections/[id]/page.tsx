'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
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
import { ArrowLeft, Package, Image, Presentation, Factory, FileText } from 'lucide-react';
import { RegistryPageHeader } from '@/components/design-system';

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
      <CabinetPageContent maxWidth="full" className="w-full space-y-4 pb-16">
        <RegistryPageHeader
          title="Коллекция не найдена"
          leadPlain="Проверьте ссылку или вернитесь к списку коллекций."
        />
        <Button variant="link" asChild>
          <Link href={ROUTES.brand.collections}>К списку коллекций</Link>
        </Button>
      </CabinetPageContent>
    );
  }

  const links = getCollectionLinks();

  return (
    <CabinetPageContent maxWidth="full" className="w-full space-y-6 pb-16">
      <RegistryPageHeader
        title={collection.name}
        leadPlain={`Сезон: ${collection.season}`}
        eyebrow={
          <Button variant="ghost" size="sm" asChild>
            <Link
              href={ROUTES.brand.collections}
              className="inline-flex items-center gap-1 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />К списку коллекций
            </Link>
          </Button>
        }
        actions={
          <Badge variant={collection.status === 'archive' ? 'secondary' : 'default'}>
            {collection.status === 'draft'
              ? 'Черновик'
              : collection.status === 'archive'
                ? 'Архив'
                : 'Активная'}
          </Badge>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4" />
            Концепция, ДНК и описание
          </CardTitle>
          <CardDescription>
            Опишите идею коллекции и ДНК. После сохранения продолжайте в разделах ниже.
          </CardDescription>
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
            Создавайте артикулы, добавляйте инспирейшен, готовьте презентации и каталоги, ведите
            производство по этой коллекции.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Link
            href={productsHref(collection.id)}
            className="border-border-subtle bg-bg-surface2/80 hover:bg-bg-surface2/80 flex items-center gap-3 rounded-xl border p-4 transition-colors"
          >
            <div className="bg-accent-primary/15 rounded-lg p-2">
              <Package className="text-accent-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-text-primary font-medium">Артикулы (PIM)</p>
              <p className="text-text-secondary text-xs">Концепция, SKU, матрица размеров</p>
            </div>
          </Link>
          <Link
            href={`${ROUTES.brand.media}?collectionId=${encodeURIComponent(collection.id)}`}
            className="border-border-subtle bg-bg-surface2/80 hover:bg-bg-surface2/80 flex items-center gap-3 rounded-xl border p-4 transition-colors"
          >
            <div className="rounded-lg bg-amber-100 p-2">
              <Image className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-text-primary font-medium">Инспирейшен</p>
              <p className="text-text-secondary text-xs">Референсы, мудборды, визуал</p>
            </div>
          </Link>
          <Link
            href={`${ROUTES.brand.contentHub}?collectionId=${encodeURIComponent(collection.id)}`}
            className="border-border-subtle bg-bg-surface2/80 hover:bg-bg-surface2/80 flex items-center gap-3 rounded-xl border p-4 transition-colors"
          >
            <div className="rounded-lg bg-emerald-100 p-2">
              <Presentation className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-text-primary font-medium">Презентации и каталоги</p>
              <p className="text-text-secondary text-xs">Лукбуки, каталоги товаров</p>
            </div>
          </Link>
          <Link
            href={productionHref(collection.id)}
            className="border-border-subtle bg-bg-surface2/80 hover:bg-bg-surface2/80 flex items-center gap-3 rounded-xl border p-4 transition-colors"
          >
            <div className="bg-border-subtle rounded-lg p-2">
              <Factory className="text-text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-text-primary font-medium">Производство</p>
              <p className="text-text-secondary text-xs">Схема коллекции, PO, техпаки, QC</p>
            </div>
          </Link>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={links} title="Связанные разделы по коллекции" />
    </CabinetPageContent>
  );
}
