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

  const bestPrice = bids.length > 0 ? Math.min(...bids.map(b => b.cmtPrice)) : 0;
  const fastestTime = bids.length > 0 ? Math.min(...bids.map(b => b.leadTimeDays)) : 0;

  // Mock Eco-Score based on deterministic values for demo purposes
  const getEcoScore = (bid: Workshop2VendorBid) => (bid.vendorName.length * 7 % 30) + 70;
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
    <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm w-full mt-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <LucideIcons.Landmark className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-text-primary text-base font-semibold">Аукцион / Тендерная площадка</h2>
            <p className="text-text-secondary text-[11px] leading-snug">
              Размещение запросов и получение ставок от производств и поставщиков.
            </p>
          </div>
        </div>
        <span
          className="border-border-default bg-bg-surface2 text-text-secondary shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px]"
        >
          API
        </span>
      </div>

      <div className="border-border-subtle flex flex-col gap-1.5 border-t border-dotted pt-2.5 mt-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="bg-bg-surface2/70 text-text-primary max-w-full rounded border border-border-subtle px-2 py-1 text-[10px] leading-snug">
            <span className="text-text-muted font-bold">Суть</span> · Ставок: {bids.length}
          </span>
          <span className="text-text-primary max-w-full rounded border border-border-subtle bg-white px-2 py-1 text-[10px] font-semibold leading-snug">
            <span className="text-text-muted font-bold">Гот.</span> ·{' '}
            {bids.some(b => b.status === 'accepted') ? 'Подрядчик утверждён' : bids.length > 0 ? 'Идёт тендер' : 'Нет ставок'}
          </span>
        </div>
      </div>

      <div className="min-w-0 space-y-4 mt-4">
        <div className="flex items-center justify-between border-b pb-2">
          <p className="text-text-primary text-sm font-semibold flex items-center gap-1.5">
            <LucideIcons.ListChecks className="w-4 h-4 text-slate-400" />
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
            {loading ? <LucideIcons.Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LucideIcons.Plus className="h-3.5 w-3.5" />}
            Запросить котировку
          </Button>
        </div>

        {bids.length === 0 ? (
          <p className="text-sm text-text-muted mb-4">Пока нет ни одной ставки.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table className="mb-4">
              <TableHeader className="bg-bg-surface2">
                <TableRow>
                  <TableHead className="text-[11px] font-medium h-9">Фабрика</TableHead>
                  <TableHead className="text-[11px] font-medium h-9">Цена (CMT)</TableHead>
                  <TableHead className="text-[11px] font-medium h-9">Срок (дни)</TableHead>
                  <TableHead className="text-[11px] font-medium h-9">Eco-Score</TableHead>
                  <TableHead className="text-[11px] font-medium h-9">MOQ</TableHead>
                  <TableHead className="text-[11px] font-medium h-9">Статус</TableHead>
                  <TableHead className="text-right text-[11px] font-medium h-9">Действия</TableHead>
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
                      <TableCell className="font-medium py-2">
                        <div className="flex flex-col gap-1 text-xs">
                          <span>{bid.vendorName}</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {isBestPrice && (
                              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 text-[9px] px-1.5 py-0 h-4 rounded">
                                <DollarSign className="w-2.5 h-2.5 mr-0.5" /> Лучшая цена
                              </Badge>
                            )}
                            {isFastest && (
                              <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200 text-[9px] px-1.5 py-0 h-4 rounded">
                                <Clock className="w-2.5 h-2.5 mr-0.5" /> Быстрее всех
                              </Badge>
                            )}
                            {isMostEco && (
                              <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200 text-[9px] px-1.5 py-0 h-4 rounded">
                                <Leaf className="w-2.5 h-2.5 mr-0.5" /> Самый эко
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs py-2">
                        {bid.cmtPrice} {bid.currency}
                      </TableCell>
                      <TableCell className="text-xs py-2">{bid.leadTimeDays}</TableCell>
                      <TableCell className="text-xs py-2">
                        <div className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-medium">{ecoScore}</span><span className="text-text-muted">/100</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs py-2">{bid.moq}</TableCell>
                      <TableCell className="py-2">
                        <Badge
                          className="text-[9px] px-1.5 py-0.5 h-5"
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
                      <TableCell className="text-right py-2">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[10px]"
                            onClick={() => handleNegotiate(bid.id, bid.vendorName)}
                          >
                            <MessageSquare className="w-3.5 h-3.5 mr-1 text-slate-500" />
                            Чат
                          </Button>
                          {bid.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="default"
                              className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white"
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

      <AlertDialog open={!!confirmAcceptBidId} onOpenChange={(open) => !open && setConfirmAcceptBidId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение принятия ставки</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите выбрать данного поставщика? Остальные ставки будут автоматически отклонены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-xs" disabled={loading}>Отмена</AlertDialogCancel>
            <AlertDialogAction className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => confirmAcceptBidId && handleAcceptBid(confirmAcceptBidId)} disabled={loading}>
              Да, утвердить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!chatBidId} onOpenChange={(open) => !open && setChatBidId(null)}>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-4 py-3 border-b border-border-default bg-bg-surface shrink-0">
            <DialogTitle className="text-base">Чат с фабрикой {chatVendorName}</DialogTitle>
            <DialogDescription className="text-xs">
              Обсуждение условий ставки
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden bg-bg-canvas">
            {chatBidId && (
              <ContextualChatThread
                contextType="bid"
                contextId={chatBidId}
                className="border-0 rounded-none h-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
