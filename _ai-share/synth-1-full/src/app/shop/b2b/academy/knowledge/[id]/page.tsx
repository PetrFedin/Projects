'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { FileText, ArrowLeft } from 'lucide-react';
import { getKnowledgeArticle } from '@/lib/academy/brand-academy-data';
import { KNOWLEDGE_CATEGORY_LABELS } from '@/lib/academy/brand-academy-data';

export default function ShopKnowledgeArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const article = getKnowledgeArticle(id);

  if (!article) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <p className="mt-4 text-slate-500">Статья не найдена</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href={ROUTES.shop.b2bAcademy}>В академию</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-6 px-4 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Link href={ROUTES.shop.b2bAcademy}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">{article.title}</h1>
          <p className="text-sm text-slate-500">
            {KNOWLEDGE_CATEGORY_LABELS[article.category] ?? article.category}
          </p>
        </div>
      </div>

      <Card className="rounded-xl border border-slate-100">
        <CardContent className="space-y-4 pt-6">
          <div className="flex gap-2">
            <Badge variant="outline">
              {KNOWLEDGE_CATEGORY_LABELS[article.category] ?? article.category}
            </Badge>
            <span className="text-[11px] text-slate-500">Обновлено {article.updatedAt}</span>
          </div>
          <p className="leading-relaxed text-slate-700">{article.excerpt}</p>
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[9px]">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button variant="outline" asChild>
        <Link href={ROUTES.shop.b2bAcademy}>← К списку</Link>
      </Button>
    </div>
  );
}
