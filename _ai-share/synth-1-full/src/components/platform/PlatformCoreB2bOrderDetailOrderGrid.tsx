'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Workshop2B2bOrderDetailView } from '@/hooks/use-workshop2-b2b-order-detail';
import { hubCabinet } from '@/lib/platform-core-cabinet-chrome';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { cn } from '@/lib/utils';

type Props = {
  orderId: string;
  order: Workshop2B2bOrderDetailView;
  articleId: string;
  articleHref: string;
};

export function PlatformCoreB2bOrderDetailOrderGrid({
  orderId,
  order,
  articleId,
  articleHref,
}: Props) {
  const coreMode = isPlatformCoreMode();

  return (
    <>
      <Card>
        <CardHeader className="sr-only">
          <CardTitle>Оптовый заказ · {orderId}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-text-muted text-[10px] font-bold uppercase">Статус</p>
            <Badge variant="outline" data-testid="platform-core-order-status">
              {order.statusLabelRu}
            </Badge>
          </div>
          <div>
            <p className="text-text-muted text-[10px] font-bold uppercase">Партнёр</p>
            <p className="font-medium">{order.buyerLabelRu}</p>
          </div>
          <div>
            <p className="text-text-muted text-[10px] font-bold uppercase">Коллекция</p>
            <p className="font-medium">{order.collectionId ?? '—'}</p>
          </div>
          <div>
            <p className="text-text-muted text-[10px] font-bold uppercase">Артикул</p>
            <Link href={articleHref} className="text-accent-primary font-medium hover:underline">
              {articleId}
            </Link>
          </div>
          <div>
            <p className="text-text-muted text-[10px] font-bold uppercase">Сумма</p>
            <p className="font-black tabular-nums" data-testid="platform-core-order-total">
              {order.totalRub.toLocaleString('ru-RU')} ₽
            </p>
          </div>
          <div>
            <p className="text-text-muted text-[10px] font-bold uppercase">Отгрузка</p>
            <p>{order.requestedDeliveryDate ?? '—'}</p>
          </div>
          {order.paymentTermsLabelRu ? (
            <div>
              <p className="text-text-muted text-[10px] font-bold uppercase">Оплата</p>
              <p>{order.paymentTermsLabelRu}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card data-testid="platform-core-order-lines-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Строки заказа</CardTitle>
        </CardHeader>
        <CardContent
          className={cn(coreMode && 'max-md:overflow-x-clip md:px-4 lg:px-6')}
        >
          <div
            className={cn(
              coreMode && 'md:hidden lg:block',
              coreMode && hubCabinet.workspaceTableScroll
            )}
            data-testid="platform-core-order-lines-table-wrap"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Артикул</TableHead>
                  <TableHead>Цвет</TableHead>
                  <TableHead>Размер</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Опт, ₽</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.lines.map((line, idx) => (
                  <TableRow
                    key={`${line.articleId}-${line.size}-${idx}`}
                    data-testid={`platform-core-order-line-${idx}`}
                  >
                    <TableCell className="font-medium">{line.articleId}</TableCell>
                    <TableCell>{line.colorCode}</TableCell>
                    <TableCell>{line.size}</TableCell>
                    <TableCell className="text-right tabular-nums">{line.qty}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {line.wholesalePriceRub.toLocaleString('ru-RU')}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {(line.qty * line.wholesalePriceRub).toLocaleString('ru-RU')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {coreMode ? (
            <div
              className={cn('hidden md:grid lg:hidden', hubCabinet.workspaceCardGrid)}
              data-testid="platform-core-order-lines-card-grid"
            >
              {order.lines.map((line, idx) => (
                <Card
                  key={`card-${line.articleId}-${line.size}-${idx}`}
                  className="border-border-subtle"
                  data-testid={`platform-core-order-line-card-${idx}`}
                >
                  <CardContent className="space-y-1 p-3 text-xs">
                    <p className="font-bold">{line.articleId}</p>
                    <p className="text-text-secondary">
                      {line.colorCode} · {line.size}
                    </p>
                    <p className="tabular-nums">
                      {line.qty} × {line.wholesalePriceRub.toLocaleString('ru-RU')} ₽ ={' '}
                      <span className="font-semibold">
                        {(line.qty * line.wholesalePriceRub).toLocaleString('ru-RU')} ₽
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </>
  );
}
