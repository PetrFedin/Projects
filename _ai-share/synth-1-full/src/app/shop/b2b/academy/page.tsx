'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { GraduationCap, Store, BookOpen, ChevronRight, Clock, PlayCircle } from 'lucide-react';
import { getCollectionTrainings, getBrandKnowledgeArticles } from '@/lib/academy/brand-academy-data';
import { COLLECTION_TRAINING_TYPE_LABELS } from '@/lib/academy/brand-academy-data';
import { cn } from '@/lib/utils';

/** Мок: коллекции, купленные магазином (в проде — из заказов/договоров) */
const PURCHASED_COLLECTIONS = ['fw26', 'ss26'];

export default function ShopAcademyPage() {
  const [activeTab, setActiveTab] = useState<'trainings' | 'knowledge'>('trainings');
  const allTrainings = getCollectionTrainings();
  const myTrainings = allTrainings.filter((t) => PURCHASED_COLLECTIONS.includes(t.collectionId) && t.forStores);
  const knowledgeArticles = getBrandKnowledgeArticles('partners');

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 space-y-6 pb-24">
      <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
        <GraduationCap className="h-6 w-6" /> Академия
      </h1>
      <p className="text-sm text-slate-500">
        Обучение по купленным коллекциям и база знаний бренда для партнёров.
      </p>

      <div className="flex gap-1 p-2 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('trainings')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider px-4 py-2 transition-colors',
            activeTab === 'trainings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-white/60'
          )}
        >
          <Store className="h-3.5 w-3.5" /> По коллекциям
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('knowledge')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider px-4 py-2 transition-colors',
            activeTab === 'knowledge' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-white/60'
          )}
        >
          <BookOpen className="h-3.5 w-3.5" /> База знаний
        </button>
      </div>

      {activeTab === 'trainings' && (
        <div className="mt-6">
          <Card className="rounded-xl border border-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-indigo-600" /> Обучение по коллекциям
              </CardTitle>
              <CardDescription>
                Product knowledge, мерчандайзинг, скрипты продаж — по коллекциям, которые вы закупили.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myTrainings.length === 0 ? (
                <p className="text-slate-500 text-sm">Нет доступных тренингов. Обучающие материалы появятся после закупки коллекций.</p>
              ) : (
                myTrainings.map((t) => (
                  <Link key={t.id} href={ROUTES.shop.b2bAcademyTraining(t.id)}>
                    <div className="flex items-start justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer">
                      <div>
                        <p className="font-semibold text-slate-900">{t.title}</p>
                        <p className="text-[11px] text-slate-500 mt-1">{t.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-[9px]">{t.collectionName} · {t.season}</Badge>
                          <Badge variant="secondary" className="text-[9px]">
                            <Clock className="h-2.5 w-2.5 mr-0.5" /> {t.duration}
                          </Badge>
                          <Badge variant="secondary" className="text-[9px]">{COLLECTION_TRAINING_TYPE_LABELS[t.type] ?? t.type}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <PlayCircle className="h-5 w-5 text-indigo-500" />
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'knowledge' && (
        <div className="mt-6">
          <Card className="rounded-xl border border-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" /> База знаний бренда
              </CardTitle>
              <CardDescription>
                Информация о бренде, процессах, индустрии — для партнёров.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {knowledgeArticles.length === 0 ? (
                <p className="text-slate-500 text-sm py-8 text-center">Нет статей в базе знаний.</p>
              ) : knowledgeArticles.map((a) => (
                <Link key={a.id} href={ROUTES.shop.b2bAcademyKnowledge(a.id)}>
                  <div className="flex items-start justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer">
                    <div>
                      <p className="font-semibold text-slate-900">{a.title}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{a.excerpt}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      <Button variant="outline" asChild>
        <Link href={ROUTES.shop.b2b}>← B2B хаб</Link>
      </Button>
    </div>
  );
}
