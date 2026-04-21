'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ROUTES, collectionById } from '@/lib/routes';
import { createCollection } from '@/lib/data/collections';
import { ArrowLeft } from 'lucide-react';
import { RegistryPageHeader } from '@/components/design-system';

export default function BrandCollectionsNewPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [season, setSeason] = useState('');
  const [concept, setConcept] = useState('');
  const [dna, setDna] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !season.trim()) return;
    setSubmitting(true);
    try {
      const card = createCollection({
        name: name.trim(),
        season: season.trim(),
        concept: concept.trim(),
        dna: dna.trim(),
        description: description.trim(),
        status: 'draft',
      });
      router.push(collectionById(card.id));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CabinetPageContent maxWidth="full" className="w-full space-y-4 pb-16">
      <RegistryPageHeader
        title="Создать карточку коллекции"
        leadPlain="Заполните название, сезон и описание. Концепция и ДНК можно дописать в карточке коллекции."
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
      />
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Данные коллекции</CardTitle>
          <CardDescription>Название и сезон обязательны.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название коллекции *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: FW26 Main"
                required
                className="max-w-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="season">Сезон *</Label>
              <Input
                id="season"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="Например: FW26 или SS26"
                required
                className="max-w-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="concept">Концепция</Label>
              <Textarea
                id="concept"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Идея коллекции, настроение, ключевые инсайты"
                rows={3}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dna">ДНК коллекции</Label>
              <Textarea
                id="dna"
                value={dna}
                onChange={(e) => setDna(e.target.value)}
                placeholder="Стиль, палитра, материалы, целевая аудитория"
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Краткое описание для внутреннего использования"
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={submitting || !name.trim() || !season.trim()}>
                {submitting ? 'Создаём…' : 'Создать коллекцию'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={ROUTES.brand.collections}>Отмена</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </CabinetPageContent>
  );
}
