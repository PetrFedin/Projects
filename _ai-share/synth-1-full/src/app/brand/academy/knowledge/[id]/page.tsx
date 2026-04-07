'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WidgetCard } from '@/components/ui/widget-card';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getAcademyLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { ArrowLeft } from 'lucide-react';
import { AcademySegmentSwitcher } from '@/components/brand/AcademySegmentSwitcher';
import { getKnowledgeArticle } from '@/lib/academy/brand-academy-data';
import { KNOWLEDGE_CATEGORY_LABELS } from '@/lib/academy/brand-academy-data';

export default function KnowledgeArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const article = getKnowledgeArticle(id);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl pb-24">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <p className="text-slate-500">Статья не найдена</p>
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
            <h1 className="text-2xl font-bold uppercase tracking-tight">{article.title}</h1>
            <p className="text-sm text-slate-500">База знаний · {KNOWLEDGE_CATEGORY_LABELS[article.category] ?? article.category}</p>
          </div>
        </div>
        <AcademySegmentSwitcher active="brand" />
      </div>

      <WidgetCard
        title="База знаний"
        description="Статьи для партнёров и клиентов."
      >
      <Card className="rounded-xl border border-slate-100">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{KNOWLEDGE_CATEGORY_LABELS[article.category] ?? article.category}</Badge>
            {article.audience.map((aud) => (
              <Badge key={aud} variant="secondary" className="text-[10px]">
                {aud === 'partners' ? 'Партнёрам' : aud === 'clients' ? 'Клиентам' : 'Команде'}
              </Badge>
            ))}
            <span className="text-[11px] text-slate-500">Обновлено {article.updatedAt}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">{article.excerpt}</p>
          {article.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap pt-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[9px]">{tag}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </WidgetCard>

      <Button variant="outline" asChild>
        <Link href={ROUTES.brand.academyKnowledge}>← К списку статей</Link>
      </Button>

      <RelatedModulesBlock links={getAcademyLinks()} />
    </div>
  );
}
