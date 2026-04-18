'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Clock, CheckCircle2, AlertCircle, Loader2, Plus, ArrowRightLeft } from 'lucide-react';
import { fastApiService } from '@/lib/fastapi-service';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function PRSampleReturns({ skuId }: { skuId: string }) {
  const [samples, setSamples] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadSamples() {
      try {
        const data = await fastApiService.getPrSamples(skuId);
        setSamples(data);
      } catch (error) {
        console.error('Failed to load PR samples:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSamples();
  }, [skuId]);

  const handleReportReturn = async () => {
    try {
      const newSample = await fastApiService.reportPrSample({
        editorial_name: 'Vogue Global',
        sku_id: skuId,
        out_date: new Date().toISOString(),
        expected_return_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'out',
      });
      setSamples([...samples, newSample]);
      toast({ title: 'Образец отправлен', description: 'Запись о передаче в редакцию добавлена.' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось добавить запись.',
      });
    }
  };

  return (
<<<<<<< HEAD
    <Card className="mt-8 overflow-hidden rounded-xl border-slate-100 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50">
        <div>
          <CardTitle className="flex items-center gap-2 uppercase tracking-tight">
            <ArrowRightLeft className="h-5 w-5 text-indigo-600" /> Учет редакционных образцов
=======
    <Card className="border-border-subtle mt-8 overflow-hidden rounded-xl shadow-xl">
      <CardHeader className="bg-bg-surface2/80 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 uppercase tracking-tight">
            <ArrowRightLeft className="text-accent-primary h-5 w-5" /> Учет редакционных образцов
>>>>>>> recover/cabinet-wip-from-stash
          </CardTitle>
          <CardDescription>Трекинг возвратов из изданий и медиа-хабов.</CardDescription>
        </div>
        <Button
          onClick={handleReportReturn}
          size="sm"
<<<<<<< HEAD
          className="rounded-xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white"
=======
          className="bg-text-primary rounded-xl text-[10px] font-black uppercase tracking-widest text-white"
>>>>>>> recover/cabinet-wip-from-stash
        >
          <Plus className="mr-1 h-4 w-4" /> Выдать образец
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center py-12">
<<<<<<< HEAD
            <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
=======
            <Loader2 className="text-text-muted h-8 w-8 animate-spin" />
>>>>>>> recover/cabinet-wip-from-stash
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-white/50">
              <TableRow>
                <TableHead className="pl-8 text-[10px] font-black uppercase">Редакция</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Статус</TableHead>
                <TableHead className="text-[10px] font-black uppercase">
                  Ожидаемый возврат
                </TableHead>
                <TableHead className="pr-8 text-right text-[10px] font-black uppercase">
                  Действие
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {samples.length > 0 ? (
                samples.map((sample) => {
                  const isOverdue =
                    new Date(sample.expected_return_date) < new Date() && sample.status === 'out';
                  return (
<<<<<<< HEAD
                    <TableRow key={sample.id} className="transition-colors hover:bg-slate-50/50">
=======
                    <TableRow key={sample.id} className="hover:bg-bg-surface2/80 transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                      <TableCell className="py-4 pl-8 text-sm font-bold">
                        {sample.editorial_name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            'h-5 border-none px-2 text-[8px] font-black uppercase',
                            sample.status === 'out'
                              ? isOverdue
                                ? 'bg-rose-100 text-rose-600'
<<<<<<< HEAD
                                : 'bg-indigo-50 text-indigo-600'
=======
                                : 'bg-accent-primary/10 text-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
                              : 'bg-emerald-50 text-emerald-600'
                          )}
                        >
                          {sample.status === 'out'
                            ? isOverdue
                              ? 'Просрочено'
                              : 'Выдано'
                            : 'Возвращено'}
                        </Badge>
                      </TableCell>
<<<<<<< HEAD
                      <TableCell className="font-mono text-xs text-slate-500">
=======
                      <TableCell className="text-text-secondary font-mono text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                        {new Date(sample.expected_return_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
<<<<<<< HEAD
                          className="h-8 rounded-xl text-[9px] font-black uppercase text-indigo-600"
=======
                          className="text-accent-primary h-8 rounded-xl text-[9px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          Вернуть
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
<<<<<<< HEAD
                  <TableCell colSpan={4} className="py-12 text-center italic text-slate-400">
=======
                  <TableCell colSpan={4} className="text-text-muted py-12 text-center italic">
>>>>>>> recover/cabinet-wip-from-stash
                    Нет активных выдач для этого артикула.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
