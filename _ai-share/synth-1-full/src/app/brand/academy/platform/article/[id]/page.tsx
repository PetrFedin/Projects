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
import { ArrowLeft } from 'lucide-react';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

export default function PlatformArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const article = getPlatformArticleById(id);

<<<<<<< HEAD
  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50/80 to-white">
        <div className="container mx-auto max-w-3xl px-4 py-12">
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

=======
>>>>>>> recover/cabinet-wip-from-stash
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

  if (!article) {
    return (
      <RegistryPageShell className="from-bg-surface2/80 to-bg-surface w-full max-w-none space-y-6 bg-gradient-to-b pb-16">
        <RegistryPageHeader
          title="Статья не найдена"
          leadPlain="Материал отсутствует в демо-данных платформы."
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
        <Button variant="outline" asChild>
          <Link href={ROUTES.brand.academyPlatform}>Вернуться в Академию платформы</Link>
        </Button>
      </RegistryPageShell>
    );
  }

  const relatedIds = (article as { relatedIds?: string[] }).relatedIds ?? [];
  const relatedCourses = relatedIds
    .map((rid) => getCourseById(rid))
    .filter((c): c is NonNullable<typeof c> => c != null);

  const category = (article as { category?: string }).category ?? 'Статья';
  const updated = formatDate((article as { updatedAt?: string }).updatedAt ?? '');
  const authorName = (article as { authorName?: string }).authorName;
  const leadPlain = [
    `База знаний · ${category} · Обновлено ${updated}`,
    authorName ? `Автор: ${authorName}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 to-white">
      <div className="border-b border-slate-200/60 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto max-w-3xl px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Link href={ROUTES.brand.academyPlatform}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <AcademySegmentSwitcher active="platform" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl space-y-8 px-4 py-8 pb-24">
        <article>
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            <FileText className="h-4 w-4" />
            <span>База знаний</span>
            <span>·</span>
            <span>{(article as { category?: string }).category ?? 'Статья'}</span>
            <span>·</span>
            <span>Обновлено {formatDate((article as { updatedAt?: string }).updatedAt ?? '')}</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{article.title}</h1>

          {(article as { authorName?: string }).authorName && (
            <p className="mt-2 text-sm text-slate-500">
              Автор: {(article as { authorName: string }).authorName}
=======
    <RegistryPageShell className="from-bg-surface2/80 to-bg-surface w-full max-w-none space-y-8 bg-gradient-to-b pb-16">
      <RegistryPageHeader
        title={article.title}
        leadPlain={leadPlain}
        eyebrow={
          <Button variant="ghost" size="icon" className="-ml-2 shrink-0" asChild>
            <Link href={ROUTES.brand.academyPlatform} aria-label="К списку платформы">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        }
        actions={<AcademySegmentSwitcher active="platform" />}
      />

      <article className="space-y-8">
        <Card className="border-border-default/80 rounded-2xl border">
          <CardContent className="prose prose-slate max-w-none p-6">
            <p className="text-text-primary text-base leading-relaxed">
              {(article as { content?: string }).content ?? article.excerpt}
>>>>>>> recover/cabinet-wip-from-stash
            </p>
          </CardContent>
        </Card>

<<<<<<< HEAD
          <Card className="mt-6 rounded-2xl border border-slate-200/80">
            <CardContent className="prose prose-slate max-w-none p-6">
              <p className="text-base leading-relaxed text-slate-700">
                {(article as { content?: string }).content ?? article.excerpt}
              </p>
            </CardContent>
          </Card>
=======
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
>>>>>>> recover/cabinet-wip-from-stash

        {relatedCourses.length > 0 && (
          <div>
            <h2 className="text-text-primary mb-3 font-semibold">Связанные курсы</h2>
            <div className="space-y-2">
              {relatedCourses.map((course) => (
                <Link key={course.id} href={ROUTES.brand.academyPlatformCourse(course.id)}>
                  <div className="border-border-default/80 hover:border-accent-primary/30 hover:bg-accent-primary/10 flex items-center justify-between rounded-xl border p-4 transition-colors">
                    <span className="text-text-primary font-medium">{course.title}</span>
                    <ArrowLeft className="text-text-muted h-4 w-4 rotate-180" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

<<<<<<< HEAD
          {relatedCourses.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 font-semibold text-slate-900">Связанные курсы</h2>
              <div className="space-y-2">
                {relatedCourses.map((course) => (
                  <Link key={course.id} href={ROUTES.brand.academyPlatformCourse(course.id)}>
                    <div className="flex items-center justify-between rounded-xl border border-slate-200/80 p-4 transition-colors hover:border-indigo-200/60 hover:bg-indigo-50/30">
                      <span className="font-medium text-slate-900">{course.title}</span>
                      <ArrowLeft className="h-4 w-4 rotate-180 text-slate-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
=======
      <Button variant="outline" asChild>
        <Link href={ROUTES.brand.academyPlatform} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> К базе знаний
        </Link>
      </Button>
>>>>>>> recover/cabinet-wip-from-stash

      <RelatedModulesBlock links={getAcademyLinks()} />
    </RegistryPageShell>
  );
}
