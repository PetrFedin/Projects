'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Truck, Package, RotateCw, XCircle } from 'lucide-react';
import { kickstarterProjects } from '@/lib/kickstarter';
import kickstarterPledges from '@/lib/data/kickstarter-pledges.json';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Progress } from '../ui/progress';
import { useUIState } from '@/providers/ui-state';
import type { KickstarterPledge, FulfillmentStatus } from '@/lib/types';

const statusConfig: Record<
  FulfillmentStatus,
  { label: string; icon: React.ElementType; color: string }
> = {
  pending: { label: 'Ожидает производства', icon: Clock, color: 'text-amber-600' },
  in_production: { label: 'В производстве', icon: RotateCw, color: 'text-blue-600' },
  shipped: { label: 'Отправлен', icon: Truck, color: 'text-accent-primary' },
  delivered: { label: 'Доставлен', icon: Package, color: 'text-green-600' },
  cancelled: { label: 'Отменен', icon: XCircle, color: 'text-red-600' },
};

export function MyPreorders() {
  const { user } = useUIState();
  const userPledges = (kickstarterPledges as KickstarterPledge[]).filter(
    (p) => p.userId === user?.uid
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Мои предзаказы</CardTitle>
        <CardDescription>
          Отслеживайте статус ваших предзаказов и ожидаемые даты доставки.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Товар</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Ожидаемая дата</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userPledges.length > 0 ? (
              userPledges.map((pledge) => {
                const campaign = kickstarterProjects.find((c) => c.id === pledge.campaignId);
                if (!campaign) return null;
                const StatusIcon =
                  statusConfig[pledge.fulfillmentStatus as FulfillmentStatus]?.icon || Clock;

                return (
                  <TableRow key={pledge.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={campaign.imageUrl || ''}
                          alt={campaign.title}
                          width={48}
                          height={60}
                          className="rounded-md bg-muted object-cover"
                        />
                        <div>
                          <Link
                            href={`/kickstarter/${campaign.id}`}
                            className="font-semibold hover:underline"
                          >
                            {campaign.title}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            Размер: {pledge.variant.size}, Цвет: {pledge.variant.color}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`border-current/30 flex w-fit items-center gap-1.5 ${statusConfig[pledge.fulfillmentStatus as FulfillmentStatus]?.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[pledge.fulfillmentStatus as FulfillmentStatus]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {campaign.productionEndEstAt
                        ? format(new Date(campaign.productionEndEstAt), 'd MMMM yyyy', {
                            locale: ru,
                          })
                        : 'TBD'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {pledge.totalPrice.toLocaleString('ru-RU')} ₽
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  У вас еще нет предзаказов.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
