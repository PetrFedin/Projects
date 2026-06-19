'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  buildShopOrderCommsSession,
  shopOrderCommsCalendarDeepHref,
  shopOrderCommsMessagesDeepHref,
} from '@/lib/b2b/shop-order-comms';
import { Calendar, MessageSquare } from 'lucide-react';

type Props = {
  orderId?: string;
  collectionId?: string;
};

export function ShopOrderCommsChatPanel({ orderId, collectionId }: Props) {
  if (!orderId?.trim()) {
    return (
      <Card data-testid="shop-order-comms-chat-missing-order">
        <CardContent className="py-8 text-center text-sm text-text-secondary">
          Укажите `?order=` для order-context chat.
        </CardContent>
      </Card>
    );
  }

  const session = useMemo(
    () => buildShopOrderCommsSession({ orderId, collectionId }),
    [orderId, collectionId]
  );
  const messagesHref = shopOrderCommsMessagesDeepHref(orderId);

  return (
    <div className="space-y-4" data-testid="shop-order-comms-chat-panel">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <CardTitle className="text-base">Order chat</CardTitle>
          </div>
          <CardDescription>NuOrder collab: messages в контексте заказа {orderId}.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={messagesHref} data-testid="shop-order-comms-messages-deep-link">
              Open messages
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.collaborativeHref}>Collaborative comms</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.brandOrderChatHref}>Brand order chat</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function ShopOrderCommsCalendarPanel({ orderId, collectionId }: Props) {
  if (!orderId?.trim()) {
    return (
      <Card data-testid="shop-order-comms-calendar-missing-order">
        <CardContent className="py-8 text-center text-sm text-text-secondary">
          Укажите `?order=` для order calendar.
        </CardContent>
      </Card>
    );
  }

  const session = useMemo(
    () => buildShopOrderCommsSession({ orderId, collectionId }),
    [orderId, collectionId]
  );
  const calendarHref = shopOrderCommsCalendarDeepHref(orderId);

  return (
    <div className="space-y-4" data-testid="shop-order-comms-calendar-panel">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Calendar className="h-4 w-4" />
            <CardTitle className="text-base">Order calendar</CardTitle>
          </div>
          <CardDescription>Delivery windows · milestones · production sync.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={calendarHref} data-testid="shop-order-comms-calendar-deep-link">
              Open calendar
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.workingOrderHref}>Working order</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.replenishmentAtpHref}>Replenishment · ATP</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
