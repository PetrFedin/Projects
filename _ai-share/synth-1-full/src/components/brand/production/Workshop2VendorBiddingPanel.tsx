'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import * as LucideIcons from 'lucide-react';
import { MessageSquare, Leaf, Clock, DollarSign, Award } from 'lucide-react';
import type { Workshop2VendorBid } from '@/lib/production/workshop2-dossier-phase1.types';
import { ContextualChatThread } from '@/components/brand/messages/ContextualChatThread';

type Workshop2VendorBiddingPanelProps = {
  articleId: string;
  bids?: Workshop2VendorBid[];
  onBidsUpdate?: (bids: Workshop2VendorBid[]) => void;
};

export function Workshop2VendorBiddingPanel({
  articleId,
  bids = [],
  onBidsUpdate,
}: Workshop2VendorBiddingPanelProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [confirmAcceptBidId, setConfirmAcceptBidId] = useState<string | null>(null);
  const [chatBidId, setChatBidId] = useState<string | null>(null);
  const [chatVendorName, setChatVendorName] = useState<string | null>(null);

  const bestPrice = bids.length > 0 ? Math.min(...bids.map((b) => b.cmtPrice)) : 0;
  const fastestTime = bids.length > 0 ? Math.min(...bids.map((b) => b.leadTimeDays)) : 0;

  // Mock Eco-Score based on deterministic values for demo purposes
  const getEcoScore = (bid: Workshop2VendorBid) => ((bid.vendorName.length * 7) % 30) + 70;
  const highestEcoScore = bids.length > 0 ? Math.max(...bids.map(getEcoScore)) : 0;

  const handleAddBid = async () => {
    toast({
      title: 'Интеграция',
      description: 'Отправка RFQ недоступна. Подключите B2B портал поставщиков.',
      variant: 'destructive',
    });
  };

  const handleAcceptBid = async (bidId: string) => {
    toast({
      title: 'Интеграция',
      description: 'Утверждение ставок отключено в текущей среде.',
      variant: 'destructive',
    });
  };

  const handleNegotiate = (bidId: string, vendorName: string) => {
    setChatBidId(bidId);
    setChatVendorName(vendorName);
  };

  return (
    <div className="border-border-default mt-4 w-full rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <LucideIcons.Landmark className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-text-primary text-base font-semibold">
              Аукцион / Тендерная площадка
            </h2>
            <p className="text-text-secondary text-[11px] leading-snug">
              Размещение запросов и получение ставок от производств и поставщиков.
            </p>
          </div>
        </div>
        <span className="border-border-default bg-bg-surface2 text-text-secondary shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px]">
          API
        </span>
      </div>

      <div className="border-border-subtle mt-4 flex flex-col gap-1.5 border-t border-dotted pt-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="bg-bg-surface2/70 text-text-primary border-border-subtle max-w-full rounded border px-2 py-1 text-[10px] leading-snug">
            <span className="text-text-muted font-bold">Суть</span> · Ставок: {bids.length}
          </span>
          <span className="text-text-primary border-border-subtle max-w-full rounded border bg-white px-2 py-1 text-[10px] font-semibold leading-snug">
            <span className="text-text-muted font-bold">Гот.</span> ·{' '}
            {bids.some((b) => b.status === 'accepted')
              ? 'Подрядчик утверждён'
              : bids.length > 0
                ? 'Идёт тендер'
                : 'Нет ставок'}
          </span>
        </div>
      </div>

      <div className="mt-4 min-w-0 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <p className="text-text-primary flex items-center gap-1.5 text-sm font-semibold">
            <LucideIcons.ListChecks className="h-4 w-4 text-slate-400" />
            Предложения (Котировки)
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-[11px]"
            onClick={handleAddBid}
            disabled={loading}
          >
            {loading ? (
              <LucideIcons.Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LucideIcons.Plus className="h-3.5 w-3.5" />
            )}
            Запросить котировку
          </Button>
        </div>

        {bids.length === 0 ? (
          <p className="text-text-muted mb-4 text-sm">Пока нет ни одной ставки.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table className="mb-4">
              <TableHeader className="bg-bg-surface2">
                <TableRow>
                  <TableHead className="h-9 text-[11px] font-medium">Фабрика</TableHead>
                  <TableHead className="h-9 text-[11px] font-medium">Цена (CMT)</TableHead>
                  <TableHead className="h-9 text-[11px] font-medium">Срок (дни)</TableHead>
                  <TableHead className="h-9 text-[11px] font-medium">Eco-Score</TableHead>
                  <TableHead className="h-9 text-[11px] font-medium">MOQ</TableHead>
                  <TableHead className="h-9 text-[11px] font-medium">Статус</TableHead>
                  <TableHead className="h-9 text-right text-[11px] font-medium">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bids.map((bid) => {
                  const ecoScore = getEcoScore(bid);
                  const isBestPrice = bid.cmtPrice === bestPrice;
                  const isFastest = bid.leadTimeDays === fastestTime;
                  const isMostEco = ecoScore === highestEcoScore;

                  return (
                    <TableRow key={bid.id}>
                      <TableCell className="py-2 font-medium">
                        <div className="flex flex-col gap-1 text-xs">
                          <span>{bid.vendorName}</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {isBestPrice && (
                              <Badge
                                variant="outline"
                                className="h-4 rounded border-emerald-200 bg-emerald-50 px-1.5 py-0 text-[9px] text-emerald-700"
                              >
                                <DollarSign className="mr-0.5 h-2.5 w-2.5" /> Лучшая цена
                              </Badge>
                            )}
                            {isFastest && (
                              <Badge
                                variant="outline"
                                className="h-4 rounded border-blue-200 bg-blue-50 px-1.5 py-0 text-[9px] text-blue-700"
                              >
                                <Clock className="mr-0.5 h-2.5 w-2.5" /> Быстрее всех
                              </Badge>
                            )}
                            {isMostEco && (
                              <Badge
                                variant="outline"
                                className="h-4 rounded border-green-200 bg-green-50 px-1.5 py-0 text-[9px] text-green-700"
                              >
                                <Leaf className="mr-0.5 h-2.5 w-2.5" /> Самый эко
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 text-xs">
                        {bid.cmtPrice} {bid.currency}
                      </TableCell>
                      <TableCell className="py-2 text-xs">{bid.leadTimeDays}</TableCell>
                      <TableCell className="py-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Award className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="font-medium">{ecoScore}</span>
                          <span className="text-text-muted">/100</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 text-xs">{bid.moq}</TableCell>
                      <TableCell className="py-2">
                        <Badge
                          className="h-5 px-1.5 py-0.5 text-[9px]"
                          variant={
                            bid.status === 'accepted'
                              ? 'default'
                              : bid.status === 'rejected'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {bid.status === 'accepted'
                            ? 'Принята'
                            : bid.status === 'rejected'
                              ? 'Отклонена'
                              : 'Рассмотрение'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[10px]"
                            onClick={() => handleNegotiate(bid.id, bid.vendorName)}
                          >
                            <MessageSquare className="mr-1 h-3.5 w-3.5 text-slate-500" />
                            Чат
                          </Button>
                          {bid.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="default"
                              className="h-7 bg-emerald-600 text-[10px] text-white hover:bg-emerald-700"
                              onClick={() => setConfirmAcceptBidId(bid.id)}
                              disabled={loading || bids.some((b) => b.status === 'accepted')}
                            >
                              Принять
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AlertDialog
        open={!!confirmAcceptBidId}
        onOpenChange={(open) => !open && setConfirmAcceptBidId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение принятия ставки</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите выбрать данного поставщика? Остальные ставки будут
              автоматически отклонены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-xs" disabled={loading}>
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-8 bg-emerald-600 text-xs hover:bg-emerald-700"
              onClick={() => confirmAcceptBidId && handleAcceptBid(confirmAcceptBidId)}
              disabled={loading}
            >
              Да, утвердить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!chatBidId} onOpenChange={(open) => !open && setChatBidId(null)}>
        <DialogContent className="flex h-[600px] flex-col overflow-hidden p-0 sm:max-w-[500px]">
          <DialogHeader className="border-border-default bg-bg-surface shrink-0 border-b px-4 py-3">
            <DialogTitle className="text-base">Чат с фабрикой {chatVendorName}</DialogTitle>
            <DialogDescription className="text-xs">Обсуждение условий ставки</DialogDescription>
          </DialogHeader>
          <div className="bg-bg-canvas flex-1 overflow-hidden">
            {chatBidId && (
              <ContextualChatThread
                contextType="bid"
                contextId={chatBidId}
                className="h-full rounded-none border-0"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
