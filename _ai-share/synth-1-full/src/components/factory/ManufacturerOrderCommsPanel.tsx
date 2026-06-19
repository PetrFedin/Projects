'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildManufacturerOrderCommsSession } from '@/lib/b2b/manufacturer-order-comms';
import { FactoryCommsAttachTzComposeStrip } from '@/components/factory/FactoryCommsAttachTzComposeStrip';
import { Calendar, MessageSquare } from 'lucide-react';

type Props = {
  orderId?: string;
  collectionId?: string;
  factoryId?: string;
};

export function ManufacturerOrderCommsPanel({ orderId, collectionId, factoryId }: Props) {
  const session = buildManufacturerOrderCommsSession({ orderId, collectionId, factoryId });

  return (
    <div className="space-y-4" data-testid="manufacturer-order-comms-panel">
      <FactoryCommsAttachTzComposeStrip variant="manufacturer" />
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <CardTitle className="text-base">Order comms</CardTitle>
          </div>
          <CardDescription>Столп 5 · B2B PO {session.orderId} · цепочка в golden path.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.messagesHref} data-testid="manufacturer-order-comms-messages-link">
              Open messages
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.calendarHref}>
              <Calendar className="mr-1 h-3 w-3" />
              Order calendar
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
