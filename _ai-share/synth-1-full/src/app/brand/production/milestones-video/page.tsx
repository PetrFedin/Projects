'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, ArrowLeft, CheckCircle2, Save } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getProductionLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import type { MilestoneWithVideo } from '@/lib/production/milestones-video';
import { useFloorTabDraftState } from '@/hooks/use-floor-tab-draft';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MS_DEFAULT = {
  v: 1 as const,
  milestones: [
    { id: 'm1', orderId: 'PO-201', milestoneType: 'cutting_done', milestoneLabel: 'Раскрой завершён', status: 'approved' as const, completedAt: '2026-03-09T12:00:00Z', approvedAt: '2026-03-09T14:00:00Z' },
    { id: 'm2', orderId: 'PO-201', milestoneType: 'assembly_done', milestoneLabel: 'Сборка завершена', status: 'video_uploaded' as const, completedAt: '2026-03-10T18:00:00Z' },
    { id: 'm3', orderId: 'PO-201', milestoneType: 'final_qc', milestoneLabel: 'Финальный ОК', status: 'pending' as const },
  ] satisfies MilestoneWithVideo[],
};

const statusLabels: Record<MilestoneWithVideo['status'], string> = {
  pending: 'Ожидает',
  video_uploaded: 'Видео загружено',
  approved: 'Утверждено',
  rejected: 'Отклонено',
};

export default function MilestonesVideoPage() {
  const { toast } = useToast();
  const { data, setData, save, hydrated } = useFloorTabDraftState('milestones-video', MS_DEFAULT);

  const setMilestone = (index: number, patch: Partial<MilestoneWithVideo>) => {
    setData((prev) => {
      const milestones = [...prev.milestones];
      milestones[index] = { ...milestones[index], ...patch };
      return { ...prev, milestones };
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <SectionInfoCard
        title="Milestones with Video Proof"
        description="Статусы этапов — floor-tab: milestones-video."
        icon={Video}
        iconBg="bg-violet-100"
        iconColor="text-violet-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">Видео</Badge>
            <Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href={ROUTES.brand.documents}>ЭДО</Link></Button>
            <Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href={ROUTES.brand.production}>Production</Link></Button>
          </>
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={ROUTES.brand.production}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-2xl font-bold uppercase">Milestones with Video Proof</h1>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          disabled={!hydrated}
          onClick={async () => {
            await save();
            toast({ title: 'Сохранено', description: 'Вехи записаны.' });
          }}
        >
          <Save className="h-3.5 w-3.5" /> Сохранить
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" /> Этапы по заказу PO-201
          </CardTitle>
          <CardDescription>Критические этапы с видео (плейсхолдер)</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data.milestones.map((m, i) => (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-medium">{m.milestoneLabel}</p>
                  <p className="text-xs text-slate-500">
                    {m.orderId} · {statusLabels[m.status]}
                    {m.completedAt ? ` · ${new Date(m.completedAt).toLocaleDateString('ru-RU')}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {m.status === 'approved' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                  <Select value={m.status} onValueChange={(v) => setMilestone(i, { status: v as MilestoneWithVideo['status'] })}>
                    <SelectTrigger className="h-8 w-[150px] text-[10px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(statusLabels) as MilestoneWithVideo['status'][]).map((s) => (
                        <SelectItem key={s} value={s} className="text-xs">{statusLabels[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={getProductionLinks()} />
    </div>
  );
}
