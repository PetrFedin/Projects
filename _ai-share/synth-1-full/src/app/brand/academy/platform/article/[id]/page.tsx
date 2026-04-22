'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AcademySegmentSwitcher } from '@/components/brand/AcademySegmentSwitcher';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getAcademyLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { getPlatformArticleById, getCourseById } from '@/lib/education-data';
import { ArrowLeft, FileText } from 'lucide-react';

export default function PlatformArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string | undefined) ?? '';
  const article = getPlatformArticleById(id);

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50/80 to-white">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <p className="mt-6 text-slate-500">Статья не найдена</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href={ROUTES.brand.academyPlatform}>Вернуться в Академию платформы</Link>
          </Button>
        </div>
      </div>
    );
  }

  const relatedIds = (article as { relatedIds?: string[] }).relatedIds ?? [];
  const relatedCourses = relatedIds
    .map((rid) => getCourseById(rid))
    .filter((c): c is NonNullable<typeof c> => c != null);

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return d;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 to-white">
      <div className="border-b border-slate-200/60 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 max-w-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href={ROUTES.brand.academyPlatform}>
                <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
              </Link>
              <AcademySegmentSwitcher active="platform" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8 pb-24">
        <article>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <FileText className="h-4 w-4" />
            <span>База знаний</span>
            <span>·</span>
            <span>{(article as { category?: string }).category ?? 'Статья'}</span>
            <span>·</span>
            <span>Обновлено {formatDate((article as { updatedAt?: string }).updatedAt ?? '')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{article.title}</h1>

          {(article as { authorName?: string }).authorName && (
            <p className="mt-2 text-sm text-slate-500">
              Автор: {(article as { authorName: string }).authorName}
            </p>
          )}

          <Card className="mt-6 rounded-2xl border border-slate-200/80">
            <CardContent className="p-6 prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed text-base">
                {(article as { content?: string }).content ?? article.excerpt}
              </p>
            </CardContent>
          </Card>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {relatedCourses.length > 0 && (
            <div className="mt-8">
              <h2 className="font-semibold text-slate-900 mb-3">Связанные курсы</h2>
              <div className="space-y-2">
                {relatedCourses.map((course) => (
                  <Link key={course.id} href={ROUTES.brand.academyPlatformCourse(course.id)}>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 hover:border-indigo-200/60 hover:bg-indigo-50/30 transition-colors">
                      <span className="font-medium text-slate-900">{course.title}</span>
                      <ArrowLeft className="h-4 w-4 rotate-180 text-slate-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        <Button variant="outline" asChild>
          <Link href={ROUTES.brand.academyPlatform} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> К базе знаний
          </Link>
        </Button>

        <RelatedModulesBlock links={getAcademyLinks()} />
      </div>
    </div>
  );
}
