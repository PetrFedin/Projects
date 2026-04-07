'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WidgetCard } from '@/components/ui/widget-card';
import { AcademySegmentSwitcher } from '@/components/brand/AcademySegmentSwitcher';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getAcademyLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { addKnowledgeArticle } from '@/lib/academy/brand-academy-data';
import { ArrowLeft } from 'lucide-react';

export default function CreateKnowledgePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState<'brand' | 'industry' | 'process' | 'faq'>('brand');
  const [audience, setAudience] = useState<('team' | 'partners' | 'clients')[]>([]);

  const toggleAudience = (a: 'team' | 'partners' | 'clients') => {
    setAudience((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const article = addKnowledgeArticle({
      title,
      excerpt,
      category,
      audience: audience.length ? audience : ['partners'],
      updatedAt: new Date().toISOString().slice(0, 10),
      tags: [],
    });
    router.push(ROUTES.brand.academyKnowledgeArticle(article.id));
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-2xl pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={ROUTES.brand.academy}>
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tight">Добавить статью</h1>
            <p className="text-sm text-slate-500">База знаний — для партнёров и клиентов</p>
          </div>
        </div>
        <AcademySegmentSwitcher active="brand" />
      </div>

      <WidgetCard
        title="База знаний"
        description="Статьи помогают партнёрам и клиентам ознакомиться с брендом, сферой, процессами."
      >
      <Card className="rounded-xl border border-slate-100">
        <CardHeader>
          <CardTitle>Новая статья</CardTitle>
          <CardDescription>Заголовок, краткое описание, категория, аудитория.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Заголовок</Label>
              <Input placeholder="О бренде Syntha" className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label>Краткое описание</Label>
              <Textarea placeholder="Философия, история, ДНК бренда..." rows={3} className="mt-1" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required />
            </div>
            <div>
              <Label>Категория</Label>
              <select className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
                <option value="brand">О бренде</option>
                <option value="industry">Индустрия</option>
                <option value="process">Процессы</option>
                <option value="faq">FAQ</option>
              </select>
            </div>
            <div>
              <Label>Аудитория</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={audience.includes('partners')} onChange={() => toggleAudience('partners')} /> Партнёрам
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={audience.includes('clients')} onChange={() => toggleAudience('clients')} /> Клиентам
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={audience.includes('team')} onChange={() => toggleAudience('team')} /> Команде
                </label>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit">Сохранить</Button>
              <Button type="button" variant="outline" asChild><Link href={ROUTES.brand.academy}>Отмена</Link></Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </WidgetCard>

      <RelatedModulesBlock links={getAcademyLinks()} />
    </div>
  );
}
