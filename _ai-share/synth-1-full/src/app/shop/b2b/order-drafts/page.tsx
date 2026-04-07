'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileEdit, ArrowLeft, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { getWorkingOrderVersions } from '@/lib/b2b/working-order-store';
import { getConsolidatedDraft } from '@/lib/b2b/consolidated-order-draft';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

export default function B2BOrderDraftsPage() {
  const versions = getWorkingOrderVersions();
  const consolidated = getConsolidatedDraft();
  const draftVersions = versions.filter((v) => v.status === 'draft' || v.status === 'pending_review');

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
            <FileEdit className="h-6 w-6" /> Черновики заказов
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            JOOR: незавершённые заказы по коллекциям. Продолжить в матрице или Working Order.
          </p>
        </div>
      </div>

      {consolidated && consolidated.lines.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase">Сводный черновик агента</CardTitle>
            <CardDescription>Zedonk: один драфт по разным брендам. MOV/MOQ по бренду.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="default" size="sm" className="rounded-lg font-black uppercase text-[10px]">
              <Link href={ROUTES.shop.b2bAgentConsolidatedOrder}>Открыть сводный заказ</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase">Working Order — черновики</CardTitle>
          <CardDescription>Загруженные файлы в статусе черновик или на согласовании.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {draftVersions.length === 0 ? (
            <p className="text-slate-500 text-sm">Нет черновиков. Создайте заказ в матрице или загрузите Working Order.</p>
          ) : (
            draftVersions.slice(0, 10).map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50"
              >
                <div>
                  <p className="font-bold text-slate-900">{v.fileName}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(v.createdAt).toLocaleDateString('ru-RU')} · {v.uploadedBy} · {v.status}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg text-[10px] font-black uppercase" asChild>
                  <Link href={`${ROUTES.shop.b2bWorkingOrder}?version=${encodeURIComponent(v.id)}`}>
                    Продолжить <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 mb-6">
        <Button asChild variant="default" className="rounded-xl font-black uppercase text-[10px] tracking-widest">
          <Link href={ROUTES.shop.b2bCreateOrder}>Создать заказ</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl font-black uppercase text-[10px] tracking-widest">
          <Link href={ROUTES.shop.b2bAiSmartOrder}>AI SmartOrder (PDF/email)</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl font-black uppercase text-[10px] tracking-widest">
          <Link href={ROUTES.shop.b2bWorkingOrder}>Working Order</Link>
        </Button>
      </div>

      <RelatedModulesBlock
        title="Связанные разделы"
        links={getShopB2BHubLinks().filter((l) =>
          [ROUTES.shop.b2bOrders, ROUTES.shop.b2bCreateOrder].includes(l.href as string)
        )}
      />
    </div>
  );
}
